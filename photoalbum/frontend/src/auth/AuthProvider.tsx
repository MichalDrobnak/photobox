/* eslint-disable no-unused-vars */
import { Center, Loader } from '@mantine/core';
import { ReactNode, useEffect, useState } from 'react';
import { LoginCredentials } from '.';
import AuthService from './auth';
import AuthContext from './auth-context';

const LoadingScreen = () => {
  return (
    <Center style={{ width: '100%', height: '100vh' }}>
      <Loader></Loader>
    </Center>
  );
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [profileFetchFinished, setProfileFetchFinished] = useState(false);
  const authService = new AuthService();

  useEffect(() => {
    authService
      .getProfile()
      .then(user => setUser(user))
      .finally(() => setProfileFetchFinished(true));
  }, []);

  const refreshProfile = (): void => {
    authService.getProfile().then(user => setUser(user));
  };

  const login = (
    credentials: LoginCredentials,
    callback?: () => void,
    errorCallback?: () => void
  ) => {
    return authService.login(
      credentials,
      newUser => {
        setUser(newUser);
        callback && callback();
      },
      errorCallback
    );
  };

  const logout = (callback?: () => void, errorCallback?: () => void) => {
    return authService.logout(() => {
      setUser(null);
      callback && callback();
    }, errorCallback);
  };

  const value = { user, login, logout, refreshProfile };

  return (
    <AuthContext.Provider value={value}>
      {profileFetchFinished ? children : LoadingScreen()}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
