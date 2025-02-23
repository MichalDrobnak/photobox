/* eslint-disable no-unused-vars */
import React from 'react';
import { User } from '../models/user';
import LoginCredentials from './login-credentials';

interface AuthContextType {
  user: User;
  refreshProfile: () => void;
  login: (
    credentials: LoginCredentials,
    callback?: () => void,
    errorCallback?: () => void
  ) => void;
  logout: (callback?: () => void, errorCallback?: () => void) => void;
}

const AuthContext = React.createContext<AuthContextType>(null!);

export default AuthContext;
