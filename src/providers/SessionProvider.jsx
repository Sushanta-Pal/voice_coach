import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useUser } from '@clerk/clerk-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const SessionContext = createContext(null);

export const SessionProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [sessionType, setSessionType] = useState('Technical');
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useUser();

    useEffect(() => {
        if (user) {
            const userEmail = user.emailAddresses[0]?.emailAddress;

            if (userEmail) {
                setIsLoading(true);
                console.log(`%cFetching data for: ${userEmail}`, 'color: blue; font-weight: bold;'); // DEBUG LOG
                
                fetch(`${API_BASE_URL}/api/user/${userEmail}`)
                    .then(res => res.json())
                    .then(data => {
                        console.log('%cData received from backend:', 'color: green; font-weight: bold;', data); // DEBUG LOG
                        setUserData(data);
                        setIsLoading(false);
                    })
                    .catch(err => {
                        console.error('Failed to fetch user data:', err);
                        setIsLoading(false);
                    });
            }
        } else {
            setUserData(null);
            setIsLoading(false);
        }
    }, [user]);

    // ... (rest of the file is the same)
    const addSessionToHistory = useCallback(async (newSession) => {
        if (!user) {
            console.error("Cannot add session: No user is signed in.");
            return;
        }

        const sessionWithId = { ...newSession, id: Date.now().toString() };

        await fetch(`${API_BASE_URL}/api/session`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: user.fullName,
                email: user.emailAddresses[0].emailAddress,
                session: sessionWithId,
            }),
        });
        
        setUserData(prevData => ({
            ...prevData,
            all_sessions_details: [sessionWithId, ...(prevData?.all_sessions_details || [])]
        }));

        return sessionWithId;
    }, [user]);

    const getSessionById = useCallback((id) => {
        return (userData?.all_sessions_details || []).find(session => session.id === id);
    }, [userData]);

    const value = useMemo(() => {
        console.log('%cSessionContext value updated:', 'color: purple; font-weight: bold;', { userData, sessionHistory: userData?.all_sessions_details || [] }); // DEBUG LOG
        return {
            userData,
            sessionHistory: userData?.all_sessions_details || [],
            addSessionToHistory,
            getSessionById,
            sessionType,
            setSessionType,
            isLoading,
        };
    }, [userData, sessionType, isLoading, addSessionToHistory, getSessionById]);

    return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};