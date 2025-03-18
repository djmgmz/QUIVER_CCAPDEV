import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { authModalState } from '@/model/atoms/authModalAtom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/model/firebase/clientApp';


export const useAuthModal = () => {
    const [modalState, setModalState] = useRecoilState(authModalState);
    const [user, loading, error] = useAuthState(auth);

    const handleClose = () => {
        setModalState(prev => ({
            ...prev,
            open: false,
        }));
    };

    useEffect(() => {
        if (user) handleClose();
        console.log('user', user);
    }, [user]);
        return { modalState, handleClose };
};