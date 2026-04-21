import { Server } from 'socket.io'
import { prisma } from '@/lib/prisma'

let io: Server

export async function GET(req: Request) {
  if (!io) {
    const httpServer = (req as any).socket.server
    io = new Server(httpServer, { path: '/api/socket' })

    io.on('connection', (socket) => {
      console.log('Игрок подключился')

      socket.on('place-pixel', async (data) => {
        const { x, y, color, userId } = data
        await prisma.pixel.create({ data: { x, y, color, userId } })
        io.emit('pixel-placed', { x, y, color })
      })
    })
  }
  return new Response('Socket.io ready')
}