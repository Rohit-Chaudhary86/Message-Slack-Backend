import User from '../schema/user.js';
import crudRepository from './crudRepository.js';
// We are only adding core methods and rest of the CRUD methods coming from crudRepository
const userRepository = {
  ...crudRepository(User),

  signUpUser: async function (data) {
    const newUser = new User(data);
    await newUser.save();
    return newUser;
  },

  getByEmail: async function (email) {
    const user = await User.findOne({ email });
    return user;
  },
  getByUsername:async function(username){
    const user=await User.findOne({username}).select('-password')//excludes password from getting fetched
    return user
  }
};
export default userRepository;
