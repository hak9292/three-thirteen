import { useState, useEffect } from 'react';
import { ref, set, onValue, remove, get, child } from 'firebase/database';
import { useRouter } from 'next/router';
import { auth } from '../lib/firebase';
import { db } from '../lib/room';
import { onAuthStateChanged } from 'firebase/auth';

function generateRoomCode() {
  return Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit code
}

export default function Lobby() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [joinedRoom, setJoinedRoom] = useState('');
  const [players, setPlayers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) return router.push('/login');
      setUser(u);

      // load username from /users/{uid}
      const snap = await get(child(ref(db), 'users/' + u.uid));
      if (snap.exists()) setUsername(snap.val().username);
    });

    return () => unsub();
  }, []);

  const createRoom = async () => {
    const code = generateRoomCode();
    await set(ref(db, 'rooms/' + code), {
      host: user.uid,
      players: {
        [user.uid]: { username }
      }
    });
    setJoinedRoom(code);
    navigator.clipboard.writeText(code);
    listenToRoom(code);
  };

  const joinRoom = async () => {
    const roomRef = ref(db, 'rooms/' + roomCode);
    const roomSnap = await get(roomRef);
    if (!roomSnap.exists()) {
      alert("Room doesn't exist.");
      return;
    }
    await set(ref(db, 'rooms/' + roomCode + '/players/' + user.uid), {
      username
    });
    setJoinedRoom(roomCode);
    listenToRoom(roomCode);
  };

  const listenToRoom = (code) => {
    const playerRef = ref(db, 'rooms/' + code + '/players');
    onValue(playerRef, (snapshot) => {
      const data = snapshot.val() || {};
      setPlayers(Object.values(data));
    });
  };

  const leaveRoom = async () => {
    if (!joinedRoom || !user?.uid) return;
    await remove(ref(db, 'rooms/' + joinedRoom + '/players/' + user.uid));
    const check = await get(ref(db, 'rooms/' + joinedRoom + '/players'));
    if (!check.exists()) {
      await remove(ref(db, 'rooms/' + joinedRoom));
    }
    setJoinedRoom('');
    setPlayers([]);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Game Lobby</h1>

      {joinedRoom ? (
        <>
          <p className="mb-2">Room Code: <strong>{joinedRoom}</strong></p>
          <p>Players in Room:</p>
          <ul className="list-disc ml-6 mb-4">
            {players.map((p, i) => <li key={i}>{p.username}</li>)}
          </ul>
          <button className="bg-red-500 text-white px-4 py-2" onClick={leaveRoom}>Leave Room</button>
        </>
      ) : (
        <>
          <button className="bg-green-600 text-white px-4 py-2 mr-4" onClick={createRoom}>Create Room</button>
          <input className="border p-2 mr-2" value={roomCode} onChange={e => setRoomCode(e.target.value)} placeholder="Enter Room Code" />
          <button className="bg-blue-600 text-white px-4 py-2" onClick={joinRoom}>Join Room</button>
        </>
      )}
    </div>
  );
}