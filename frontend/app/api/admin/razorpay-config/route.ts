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
