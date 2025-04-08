import { ref, set } from 'firebase/database';
import { db } from './room';

export const saveUsername = async (uid, username) => {
  await set(ref(db, 'users/' + uid), { username });
};