import React, { createContext, useEffect, useState } from 'react';
import { 
    getAuth, 
    onAuthStateChanged, 
    signOut, 
    signInWithPopup, 
    GoogleAuthProvider, 
    GithubAuthProvider,
    fetchSignInMethodsForEmail 
} from "firebase/auth";
import { app } from '../firebase/firebase.config';
export const AuthContext = createContext(null);
const auth = getAuth(app);

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
   

    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => {
            return unsubscribe();
        };
    }, []);

    const authInfo = {
        user,
        loading,
        logOut,
        
    }; 
    return (
         <AuthContext.Provider value={authInfo}> 
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;