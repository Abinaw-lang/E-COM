import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { auth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  updateProfile,
  getIdToken
} from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || localStorage.getItem('firebaseToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const idToken = await getIdToken(fbUser, /* forceRefresh */ false);
        localStorage.setItem('firebaseToken', idToken);
        setToken(idToken);
        setUser({
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName,
          photoURL: fbUser.photoURL
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
      const idToken = await getIdToken(userCredential.user);
      localStorage.setItem('firebaseToken', idToken);
      setToken(idToken);
      setUser({ uid: userCredential.user.uid, email: userCredential.user.email, displayName: userCredential.user.displayName });
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
      localStorage.setItem('firebaseToken', idToken);
      setToken(idToken);
      setUser({ uid: userCredential.user.uid, email: userCredential.user.email, displayName: userCredential.user.displayName });
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
