import React from 'react';
import AuthContext from './auth-context';

const useAuth = () => React.useContext(AuthContext);

export default useAuth;
