
import Channel from '../schema/channel.js';
import crudRepository from './crudRepository.js';
// We are only adding core methods and rest of the CRUD methods coming from crudRepository

const channelRepository = {
  ...crudRepository(Channel),
  
  getChannelWithWorkspaceDetails:async function(channelId){
   const channel=await Channel.findById(channelId).populate('workspaceId');
   return channel
  }
    
};
export default channelRepository;
