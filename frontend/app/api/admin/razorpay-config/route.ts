import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface RazorpayConfig {
  keyId: string
  keySecret: string
  environment: 'test' | 'live'
  webhookSecret: string
  domain: string
  adminEmail: string
  databaseUrl: string
}

export async function POST(request: NextRequest) {
  try {
    const config: RazorpayConfig = await request.json()

    // Validate required fields
    if (!config.keyId || !config.keySecret || !config.domain) {
      return NextResponse.json(
        { error: 'Missing required fields: keyId, keySecret, domain' },
        { status: 400 }
      )
    }

    // Validate Razorpay Key ID format
    const keyIdPattern = /^rzp_(test|live)_[a-zA-Z0-9]{14,}$/
    if (!keyIdPattern.test(config.keyId)) {
      return NextResponse.json(
        { error: 'Invalid Razorpay Key ID format. Should be rzp_test_xxxxxxxxxxxxx or rzp_live_xxxxxxxxxxxxx' },
        { status: 400 }
      )
    }

    // Validate Key Secret length
    if (config.keySecret.length < 32) {
      return NextResponse.json(
        { error: 'Invalid Razorpay Key Secret. Should be at least 32 characters long' },
        { status: 400 }
      )
    }

    // Validate domain format
    const domainPattern = /^https?:\/\/.+\..+/
    if (!domainPattern.test(config.domain)) {
      return NextResponse.json(
        { error: 'Invalid domain format. Should be https://yourdomain.com' },
        { status: 400 }
      )
    }

    // Create environment variables content
    const envContent = `# Razorpay Payment Gateway Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=${config.keyId}
RAZORPAY_KEY_SECRET=${config.keySecret}
RAZORPAY_ENVIRONMENT=${config.environment}
RAZORPAY_WEBHOOK_SECRET=${config.webhookSecret}
NEXT_PUBLIC_BASE_URL=${config.domain}

# Admin Configuration
ADMIN_EMAIL=${config.adminEmail}
DATABASE_URL=${config.databaseUrl}

# Email Configuration (optional)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password
`

    // Test Razorpay connection before saving
    try {
      const testResponse = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${config.keyId}:${config.keySecret}`).toString('base64')}`
        },
        body: JSON.stringify({
          amount: 100, // 1 rupee in paise
          currency: 'INR',
          receipt: 'test_connection_' + Date.now()
        })
      })

      if (!testResponse.ok) {
        const errorData = await testResponse.json()
        return NextResponse.json(
          { 
            error: 'Razorpay connection failed', 
            details: errorData.error?.description || 'Invalid credentials'
          },
          { status: 400 }
        )
      }
    } catch (error) {
      return NextResponse.json(
        { 
          error: 'Failed to connect to Razorpay', 
          details: error instanceof Error ? error.message : 'Network error'
        },
        { status: 400 }
      )
    }

    // Write to .env.local file
    const envPath = path.join(process.cwd(), '.env.local')
    fs.writeFileSync(envPath, envContent)

    // Also save to a config file for reference
    const configPath = path.join(process.cwd(), 'razorpay-config.json')
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2))

    console.log('Razorpay configuration saved:', {
      keyId: config.keyId,
      environment: config.environment,
      domain: config.domain
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Razorpay configuration saved successfully',
      config: {
        keyId: config.keyId,
        environment: config.environment,
        domain: config.domain
      }
    })

  } catch (error) {
    console.error('Error saving Razorpay configuration:', error)
    return NextResponse.json(
      { 
        error: 'Failed to save configuration',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Read current configuration
    const configPath = path.join(process.cwd(), 'razorpay-config.json')
    
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
      return NextResponse.json({ success: true, config })
    } else {
      return NextResponse.json({ success: true, config: null })
    }

  } catch (error) {
    console.error('Error reading Razorpay configuration:', error)
    return NextResponse.json(
      { error: 'Failed to read configuration' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('PUT request body:', body)
    
    const { keyId, keySecret } = body

    if (!keyId || !keySecret) {
      console.log('Missing credentials:', { keyId: !!keyId, keySecret: !!keySecret })
      return NextResponse.json(
        { 
          error: 'Key ID and Key Secret are required for testing',
          received: { keyId: !!keyId, keySecret: !!keySecret }
        },
        { status: 400 }
      )
    }

    // Test Razorpay connection
    const testResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`
      },
      body: JSON.stringify({
        amount: 100, // 1 rupee in paise
        currency: 'INR',
        receipt: 'test_connection_' + Date.now()
      })
    })

    if (!testResponse.ok) {
      const errorData = await testResponse.json()
      let errorMessage = 'Connection failed'
      let details = errorData.error?.description || 'Invalid credentials'
      
      // Provide specific error messages
      if (errorData.error?.code === 'BAD_REQUEST_ERROR') {
        errorMessage = 'Authentication failed'
        details = 'Invalid Key ID or Key Secret. Please check your credentials from Razorpay Dashboard.'
      } else if (errorData.error?.code === 'UNAUTHORIZED_ERROR') {
        errorMessage = 'Unauthorized access'
        details = 'Your credentials are not authorized. Please verify your Key ID and Key Secret.'
      }
      
      return NextResponse.json(
        { 
          success: false,
          error: errorMessage, 
          details: details,
          code: errorData.error?.code
        },
        { status: 400 }
      )
    }

    const orderData = await testResponse.json()

    return NextResponse.json({ 
      success: true, 
      message: 'Razorpay connection successful',
      orderId: orderData.id
    })

  } catch (error) {
    console.error('Error testing Razorpay connection:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to test connection', 
        details: error instanceof Error ? error.message : 'Network error'
      },
      { status: 500 }
    )
  }
}
