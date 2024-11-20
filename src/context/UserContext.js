'use client';
import { createContext, useState } from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});
  
  const userMethod = {
    user,
    setUser
  };

  return (
    <UserContext.Provider value={userMethod}>
      {children}
    </UserContext.Provider>
  );
};

export {
  UserContext,
  UserProvider
};
