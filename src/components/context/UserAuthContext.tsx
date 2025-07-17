import { createContext, useContext, useState } from "react";
import type { ReactNode } from 'react';
import request from "../config/axios_config";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";
import * as UAParser from 'ua-parser-js';

const userAuthContext = createContext<any | undefined>(undefined);

interface UserAuthContextProviderProps {
  children: ReactNode;
}

export function UserAuthContextProvider({ children }: UserAuthContextProviderProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
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
  const [settings, setSettings] = useState<any>({});


  const getLoginMetaData = async () => {
    const ipRes = await fetch('https://ipapi.co/json');
    const ipData = await ipRes.json();

    const parser = new UAParser.UAParser();
    const deviceInfo = `${parser.getBrowser().name} on ${parser.getOS().name}`;

    const payload = {
      loginTime: new Date().toISOString(),
      deviceInfo: deviceInfo,
      ipAddress: ipData.ip,
      location: `${ipData.city}, ${ipData.region}`
    };
    console.log('Login Metadata:', payload);
    return payload;
  }

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
      throw error; // Re-throw the error to handle it in the calling component
    }
  }

  const getSettings = async () => {
    try {
      const response = await request.get('/api/users/get/settings');
      setSettings(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching user settings:", error);
      throw error;
    }
  }



  const SignOut = () => {
    setUser({
      uid: "",
      email: "",
      name: "",
      photoURL: "",
      role: "",
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      active: false
    });
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    navigate('/login');
  }

  const contextValue: any = {
    user,
    setUser,
    getLoginSessions,
    getUserDetails,
    createNewUser,
    SignOut,
    email,
    setEmail,
    password,
    setPassword,
    getLoginMetaData,
    getSettings,
    settings,
    setSettings
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