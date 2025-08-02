'use client';

import { createContext, useEffect, useState, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
    registerFirebaseToken,
    fetchFirebaseToken,
} from '@/redux/slices/firebaseSlice';
import {
    onFirebaseMessageListener,
    requestFirebaseNotificationPermission,
} from './notification';

interface FirebaseNotificationContextType {
    token: string | null;
    message: any;
}

export const FirebaseNotificationContext =
    createContext<FirebaseNotificationContextType>({
        token: null,
        message: null,
    });

export default function FirebaseNotificationProvider({
    children,
}: {
    children: ReactNode;
}) {
    const dispatch = useDispatch<AppDispatch>();
    const firebaseToken = useSelector(
        (state: RootState) => state.firebase.token
    );

    const [token, setToken] = useState<string | null>(null);
    const [message, setMessage] = useState<any>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return; // ⛔ skip on server

        const initialize = async () => {
            await dispatch(fetchFirebaseToken());

            if (!firebaseToken) {
                const fcmToken = await requestFirebaseNotificationPermission();
                if (fcmToken) {
                    setToken(fcmToken);
                    dispatch(registerFirebaseToken(fcmToken));
                }
            } else {
                setToken(firebaseToken);
            }
        };

        initialize();

        onFirebaseMessageListener().then((payload) => {
            setMessage(payload);
            console.log(payload);
        });
    }, [dispatch, firebaseToken]);

    return (
        <FirebaseNotificationContext.Provider value={{ token, message }}>
            {children}
        </FirebaseNotificationContext.Provider>
    );
}
