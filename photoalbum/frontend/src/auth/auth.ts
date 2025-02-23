/* eslint-disable no-unused-vars */
import axios from 'axios';
import { User } from '../models/user';
import LoginCredentials from './login-credentials';

class AuthService {
  login(
    credentials: LoginCredentials,
    callback?: (user: User | null) => void,
    errorCallback?: (reason: any) => void
  ): void {
    axios
      .post(import.meta.env.VITE_BASE_URL + 'api/auth/login/', credentials, {
        withCredentials: true,
      })
      .then(() => {
        return this.getProfile();
      })
      .then(callback)
      .catch(errorCallback);
  }

  logout(callback?: () => void, errorCallback?: (reason: any) => void): void {
    axios
      .get(import.meta.env.VITE_BASE_URL + 'api/auth/logout/', {
        withCredentials: true,
      })
      .then(callback)
      .catch(errorCallback);
  }

  async getProfile(): Promise<User | null> {
    return await axios
      .get(import.meta.env.VITE_BASE_URL + 'api/users/profile/', {
        withCredentials: true,
      })
      .then(res => res.data)
      .catch(() => Promise.resolve(null));
  }
}

export default AuthService;
