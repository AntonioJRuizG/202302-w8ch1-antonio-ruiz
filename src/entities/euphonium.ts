import { User } from './user';

export type Euphonium = {
  id: string;
  manufacturer: string;
  model: string;
  valves: number;
  level: string;
  marchingBand: boolean;
  image: string;
  creator: User;
};
