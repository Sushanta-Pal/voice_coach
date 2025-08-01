import React, { createContext, useState } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  const signIn = () => setIsSignedIn(true);
  const signOut = () => setIsSignedIn(false);

  const value = { isSignedIn, signIn, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};