import React from 'react';
import { usePrivy } from '@privy-io/react-auth';

const LoginButton: React.FC = () => {
    const { login, logout, authenticated } = usePrivy();

    return (
        <button onClick={authenticated ? logout : login}>
            {authenticated ? 'Logout' : 'Login'}
        </button>
    );
};

export default LoginButton;