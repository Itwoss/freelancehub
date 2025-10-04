const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testOrders() {
  try {
    console.log('🔍 Checking orders in database...')
    
    // Count total orders
    const totalOrders = await prisma.order.count()
    console.log('📊 Total orders in database:', totalOrders)
    
    // Get all orders with user and project details
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        project: {
          select: {
            id: true,
            title: true,
            price: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    })
    
    console.log('📋 Recent orders:')
    orders.forEach((order, index) => {
      console.log(`${index + 1}. Order ID: ${order.id}`)
      console.log(`   User: ${order.user.name} (${order.user.email})`)
      console.log(`   Product: ${order.project.title}`)
      console.log(`   Amount: ₹${order.totalAmount}`)
      console.log(`   Status: ${order.status}`)
      console.log(`   Date: ${order.createdAt}`)
      console.log('---')
    })
    
    // Check if there are any users
    const userCount = await prisma.user.count()
    console.log('👥 Total users in database:', userCount)
    
    // Check if there are any projects
    const projectCount = await prisma.project.count()
    console.log('📦 Total projects in database:', projectCount)
    
  } catch (error) {
    console.error('❌ Error checking orders:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testOrders()
