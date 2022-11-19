import mongoose from 'mongoose';

export default mongoose.model('Users', {
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    address: String,
    age: String,
    phone: String
});