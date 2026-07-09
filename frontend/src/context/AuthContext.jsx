import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { auth, db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  updateProfile,
  getIdToken
} from 'firebase/auth';
import { getDoc, setDoc, doc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || localStorage.getItem('firebaseToken'));
  const [loading, setLoading] = useState(true);

  const fetchUserRole = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      return userDoc.exists() ? userDoc.data().role || 'user' : 'user';
    } catch (err) {
      return 'user';
    }
  };

  const createUserDocument = async (uid, data) => {
    try {
      await setDoc(doc(db, 'users', uid), {
        uid,
        email: data.email,
        name: data.name || '',
        phone: data.phone || '',
        role: 'user',
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      console.error('Failed to create user document:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const idToken = await getIdToken(fbUser, /* forceRefresh */ false);
        const role = await fetchUserRole(fbUser.uid);
        localStorage.setItem('firebaseToken', idToken);
        setToken(idToken);
        setUser({
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName,
          photoURL: fbUser.photoURL,
          role
        });
      } else {
        localStorage.removeItem('firebaseToken');
        setToken(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const register = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      if (data.name) {
        await updateProfile(userCredential.user, { displayName: data.name });
      }
      await createUserDocument(userCredential.user.uid, data);
      const idToken = await getIdToken(userCredential.user);
      localStorage.setItem('firebaseToken', idToken);
      setToken(idToken);
      setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        role: 'user'
      });
      toast.success('Registration successful!');
      return { user: userCredential.user, token: idToken };
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  };

  const login = async (data) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const idToken = await getIdToken(userCredential.user);
      const role = await fetchUserRole(userCredential.user.uid);
      localStorage.setItem('firebaseToken', idToken);
      setToken(idToken);
      setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        role
      });
      toast.success('Login successful!');
      return { user: userCredential.user, token: idToken };
    } catch (error) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
      localStorage.removeItem('firebaseToken');
      setToken(null);
      setUser(null);
      toast.success('Logged out successfully!');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
