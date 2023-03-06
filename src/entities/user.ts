export type User = {
  id: string;
  name: string;
  password: string;
  friends: User[];
  enemies: User[];
};
