import { model, Schema } from 'mongoose';
import { Euphonium } from '../../entities/euphonium';

const euphoniumSchema = new Schema<Euphonium>({
  manufacturer: {
    type: String,
    requiered: true,
  },
  model: {
    type: String,
    requiered: true,
  },
  valves: {
    type: Number,
    requierd: false,
  },
  level: {
    type: String,
    requiered: false,
  },
  marchingBand: {
    type: Boolean,
    requiered: false,
  },

  creator: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

euphoniumSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
    delete returnedObject.password;
  },
});

export const euphoniumModel = model('Euphonium', euphoniumSchema, 'euphoniums');
