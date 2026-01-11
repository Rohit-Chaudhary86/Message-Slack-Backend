// import { createMessageService } from "../service/messageService.js";
// import { NEW_MESSAGE_EVENT, NEW_MESSAGE_RECEIVED_EVENT } from "../utils/common/eventConstants.js";

// export default function messageHandlers(io, socket) {
//   socket.on(NEW_MESSAGE_EVENT,async function createMessageHandler(data,cb){
//     const messageResponse=await createMessageService(data);
//     //  if (typeof cb === "function") {
//      socket.broadcast.emit(NEW_MESSAGE_RECEIVED_EVENT,messageResponse)
//     cb({
//       success: true,
//       message: "Succesfully created the message",
//       data: messageResponse,
//     });
//  // }
// });
// }

import { createMessageService } from "../service/messageService.js";
import { NEW_MESSAGE_EVENT, NEW_MESSAGE_RECEIVED_EVENT } from "../utils/common/eventConstants.js";

export default function messageHandlers(io, socket) {
  socket.on(NEW_MESSAGE_EVENT, async function createMessageHandler(data, cb) {
    try {
      console.log(`📨 [${NEW_MESSAGE_EVENT}] from ${socket.id}`);
      
      // Create the message
      const messageResponse = await createMessageService(data);
      console.log(`✅ Message saved: ${messageResponse._id}`);
      
      // Broadcast to everyone EXCEPT the sender
      socket.broadcast.emit(NEW_MESSAGE_RECEIVED_EVENT, messageResponse);
      console.log(`📢 Broadcasted to others`);
      
      // ONLY call cb if it exists and is a function
      if (cb && typeof cb === 'function') {
        cb({
          success: true,
          message: "Successfully created the message",
          data: messageResponse,
        });
      } else {
        // Send alternative confirmation for clients without callbacks
        socket.emit('message-confirmed', {
          success: true,
          messageId: messageResponse._id,
          timestamp: new Date().toISOString()
        });
      }
      
    } catch (error) {
      console.error(`❌ Error in ${NEW_MESSAGE_EVENT}:`, error.message);
      
      // Handle error callback if exists
      if (cb && typeof cb === 'function') {
        cb({
          success: false,
          message: "Failed to create message",
          error: error.message
        });
      } else {
        // Send error to socket
        socket.emit('error', {
          message: "Message creation failed",
          error: error.message
        });
      }
    }
  });
  
  // Optional: Add channel joining handler
  socket.on('join-channel', (channelId) => {
    if (channelId) {
      socket.join(channelId);
      console.log(`👥 ${socket.id} joined channel ${channelId}`);
      socket.emit('joined', { channelId, success: true });
    }
  });
}