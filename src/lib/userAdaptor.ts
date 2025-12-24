import type { User } from "../types/user";

export const userAdapter = (user:User) => {
  const [firstName = '', lastName = ''] = (user.name || '').split(' ');
  return { ...user, firstName, lastName };
};