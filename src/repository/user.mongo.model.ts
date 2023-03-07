import { model, Schema } from 'mongoose';
import { User } from '../entities/user';

const userSchema = new Schema<User>({
  name: {
    type: String,
    requiered: true,
  },
  password: {
    type: String,
    requierd: true,
  },
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  enemies: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

userSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
    delete returnedObject.password;
  },
});

export const UserModel = model('User', userSchema, 'users');
