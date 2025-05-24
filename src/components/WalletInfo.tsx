import React from 'react';
import { usePrivy } from '@privy-io/react-auth';

const WalletInfo: React.FC = () => {
    const { user } = usePrivy();

    if (!user) {
        return null;
    }

    // Get the user's email from their linked accounts
    const emailAccount = user.linkedAccounts?.find(account => account.type === 'email') as any;
    const email = user.email?.address || emailAccount?.address || 'No email';

    return (
        <div className="wallet-info">
            <p>{email}</p>
        </div>
    );
};

export default WalletInfo;