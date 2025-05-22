import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  isAdmin: boolean;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Check if user is admin by fetching user role from backend
        try {
          const userRoleResponse = await apiRequest(`/api/users/${user.uid}/role`);
          setIsAdmin(userRoleResponse?.isAdmin || false);
        } catch (error) {
          console.error("Error checking user role:", error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, [auth]);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Set display name
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: name
        });
        
        // Create user in our database
        await apiRequest('/api/users', {
          method: 'POST',
          body: JSON.stringify({
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            name: name,
            isAdmin: false
          })
        });
      }
      
      toast({
        title: "Account created",
        description: "You have successfully signed up!",
      });
    } catch (error) {
      console.error("Error signing up:", error);
      toast({
        title: "Sign up failed",
        description: (error as Error).message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Welcome back",
        description: "You have successfully signed in!",
      });
    } catch (error) {
      console.error("Error signing in:", error);
      toast({
        title: "Sign in failed",
        description: (error as Error).message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await firebaseSignOut(auth);
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Sign out failed",
        description: (error as Error).message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    isAdmin,
    loading,
    signUp,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}