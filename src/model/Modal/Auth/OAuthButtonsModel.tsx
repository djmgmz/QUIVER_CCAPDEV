import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth } from '@/model/firebase/clientApp';

export const useOAuthButtons = () => {
    const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
    return { signInWithGoogle, user, loading, error };
};
