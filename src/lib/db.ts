import Dexie, { type Table } from 'dexie';
import type { User } from '../types/user';

export class UsersDatabase extends Dexie {
  users!: Table<User, number>; 

  constructor() {
    super('UsersDB');
    this.version(1).stores({
      users: 'username' 
    });
  }
}

export const db = new UsersDatabase();
