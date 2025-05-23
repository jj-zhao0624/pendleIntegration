import { usePrivy as usePrivyAuth } from '@privy-io/react-auth';

const usePrivy = () => {
    const privy = usePrivyAuth();
    
    return {
        ...privy,
        isAuthenticated: privy.authenticated
    };
};

export default usePrivy;