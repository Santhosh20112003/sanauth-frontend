import { createContext, useContext, useState } from "react";
import type { ReactNode } from 'react';
import request from "../config/axios_config";
import { v4 as uuidv4 } from 'uuid';

const userAuthContext = createContext<any | undefined>(undefined);

interface UserAuthContextProviderProps {
  children: ReactNode;
}

export function UserAuthContextProvider({ children }: UserAuthContextProviderProps) {
  const [user, setUser] = useState<any>({
    uid: "",
    email: "",
    name: "",
    photoURL: "",
    role: "",
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    active: false
  });

  const getLoginSessions = async () => {
    const response = await request.get('/api/users/get/login/sessions');
    return response;
  }

  const getUserDetails = async () => {
    try {
      const response = await request.get('/api/auth/me');
      setUser(response.data);
    }
    catch (error) {
      console.error("Error fetching user details:", error);
    }
  }

  const createNewUser = async (formData: any) => {
    try {
      const uid = uuidv4();
      const response = await request.post('/api/auth/admin/create', {
        uid,
        email: formData.email,
        password: formData.password,
        name: formData.name,
        photoURL: `https://dummyjson.com/icon/${uid}/150`,
        role: 'USER',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        isActive: true
      });
      return response;
    }
    catch (error) {
      console.error("Error creating new user:", error);
    }
  }

  const contextValue: any = {
    user,
    setUser,
    getLoginSessions,
    getUserDetails,
    createNewUser
  };


  return (
    <userAuthContext.Provider value={contextValue}>
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth(): any {
  const context = useContext(userAuthContext);
  // ⚠️ Add this check to avoid runtime errors!
  if (!context) {
    throw new Error('useUserAuth must be used within UserAuthContextProvider');
  }
  return context;
}