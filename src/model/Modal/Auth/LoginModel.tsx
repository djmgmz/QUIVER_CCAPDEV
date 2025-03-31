import { authModalState } from '@/model/atoms/authModalAtom';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { auth } from '@/model/firebase/clientApp'
import {
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
  } from "firebase/auth";


export const useLoginModel = () => {
    const setAuthModalState = useSetRecoilState(authModalState);
    const [loginForm, setLoginForm] = useState({
        email: "",
        password: "",
        rememberMe: false,
      });
      

    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
      ] = useSignInWithEmailAndPassword(auth);

      console.log(error);

    //Firebase logic
    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
      
        const persistence = loginForm.rememberMe
          ? browserLocalPersistence
          : browserSessionPersistence;
      
        try {
          await setPersistence(auth, persistence);
          await signInWithEmailAndPassword(loginForm.email, loginForm.password);
      
          if (loginForm.rememberMe) {
            const THREE_WEEKS = 1000 * 60 * 60 * 24 * 21;
            document.cookie = `rememberMe=true; max-age=${THREE_WEEKS / 1000}; path=/`;
          }
        } catch (error) {
          console.error("Login failed:", error);
        }
      };      

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = event.target;
      
        setLoginForm((prev) => ({
          ...prev,
          [name]: type === "checkbox" ? checked : value,
        }));
      };
      

    return { loginForm, onSubmit, onChange, loading, error, setAuthModalState };

};