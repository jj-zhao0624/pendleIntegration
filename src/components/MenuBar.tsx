import React from 'react';
import { usePrivy } from '@privy-io/react-auth';
import LoginButton from './LoginButton';
import WalletInfo from './WalletInfo';

const MenuBar: React.FC = () => {
    const { authenticated } = usePrivy();

    return (
        <nav className="menu-bar">
            <div className="menu-left">
                <h1>Pendle Integration</h1>
            </div>
            <div className="menu-right">
                {authenticated && (
                    <>
                        <WalletInfo />
                        <div className="divider" />
                    </>
                )}
                <LoginButton />
            </div>
        </nav>
    );
};

export default MenuBar;
