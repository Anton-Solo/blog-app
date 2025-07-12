'use client';

import { useEffect, useState } from 'react';
import { signInWithGoogle } from '../lib/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAppDispatch } from '../store/store';
import { setUser, clearUser } from '@/slices/authSlice';
import { Button } from './ui/button';
import { AuthUser } from '@/types';

export default function GoogleLoginButton() {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUserState(firebaseUser);
      if (firebaseUser) {
        dispatch(setUser({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
        }));
      } else {
        dispatch(clearUser());
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <img
          src={user.photoURL || '/default-avatar.png'}
          alt={user.displayName || 'Google User'}
          className="w-10 h-10 rounded-full border"
        />
        <span className="text-gray-700 font-medium hidden md:block">{user.displayName || user.email}</span>
      </div>
    );
  }

  return (
    <Button
      onClick={signInWithGoogle}
      className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
    >
      Login
    </Button>
  );
} 