import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: './frontend/prisma/schema-mongodb.prisma',
  output: './frontend/node_modules/.prisma/client',
  generator: {
    provider: 'prisma-client-js',
    output: './frontend/node_modules/.prisma/client'
  }
})
