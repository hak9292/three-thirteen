import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { auth } from '../lib/firebase';

export default function Game() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUser(user);
      else router.push('/login');
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl">Welcome to the Game Room</h1>
      {user && <p className="mb-4">Logged in as: {user.email}</p>}
      <button onClick={() => { signOut(auth); router.push('/login'); }} className="bg-red-500 text-white px-4 py-2">Sign Out</button>
    </div>
  );
}