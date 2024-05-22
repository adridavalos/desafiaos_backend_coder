import { Server } from 'socket.io';
import modelChat from './dao/models/chat.model.js'
const initSocket = (httpServer) => {
    
    const io = new Server(httpServer);

    io.on('connection', async(client) => {
       const messages = await modelChat.find().lean();
        client.emit('chatLog', messages);
        console.log(`Cliente conectado, id ${client.id} desde ${client.handshake.address}`);
    
        client.on('newMessage', async(data) => {
            
            await modelChat.create(data);
            console.log(`Mensaje recibido desde ${client.id}: ${data.user} ${data.message}`);
    
            io.emit('messageArrived', data);
        });
    });

    return io;
}

export default initSocket;