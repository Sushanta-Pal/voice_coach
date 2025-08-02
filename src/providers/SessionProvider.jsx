import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useUser } from '@clerk/clerk-react';
import { getSessions, addSession } from '../hooks/sessionService';

export const SessionContext = createContext(null);

export const SessionProvider = ({ children }) => {
    // --- State Management ---
    const [sessionHistory, setSessionHistory] = useState([]);
    const [sessionType, setSessionType] = useState('Technical');
    const [isLoading, setIsLoading] = useState(true); // To handle initial load

    // --- Clerk Integration ---
    const { user } = useUser(); // Get the current user from Clerk

    // This effect loads the user-specific session history when the user logs in or out.
    useEffect(() => {
        if (user) {
            // If a user is logged in, fetch their specific session history from localStorage.
            setIsLoading(true);
            const userSessions = getSessions(user.id);
            setSessionHistory(userSessions);
            setIsLoading(false);
        } else {
            // If no user is logged in, clear the history.
            setSessionHistory([]);
            setIsLoading(false);
        }
    }, [user]); // This runs whenever the user object changes.

    // --- Session Management Functions ---

    /**
     * Adds a new session to the history for the currently logged-in user.
     * It saves to localStorage and updates the local state.
     */
    const addSessionToHistory = useCallback((newSession) => {
        if (!user) {
            console.error("Cannot add session: No user is signed in.");
            return;
        }
        // Add a unique ID and save it to the user's history.
        const sessionWithId = { ...newSession, id: Date.now().toString() };
        addSession(user.id, sessionWithId);

        // Update the local state to reflect the change immediately in the UI.
        setSessionHistory(prevHistory => [sessionWithId, ...prevHistory]);
        return sessionWithId;
    }, [user]); // This function depends on the current user.

    /**
     * Finds a session by its ID from the currently loaded history.
     */
    const getSessionById = useCallback((id) => {
        return sessionHistory.find(session => session.id === id);
    }, [sessionHistory]); // This function depends on the session history.

    // --- Context Value ---

    // useMemo prevents the context value from being recreated on every render,
    // which can prevent unnecessary re-renders in consumer components.
    const value = useMemo(() => ({
        sessionHistory,
        addSessionToHistory,
        getSessionById,
        sessionType,
        setSessionType,
        isLoading, // Provide loading state to consumers if needed
    }), [sessionHistory, sessionType, isLoading, addSessionToHistory, getSessionById]);

    return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};
