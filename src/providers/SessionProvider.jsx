import React, { createContext, useState, useMemo } from 'react';

export const SessionContext = createContext(null);

export const SessionProvider = ({ children }) => {
  const [sessionHistory, setSessionHistory] = useState([]);
  const [sessionType, setSessionType] = useState('Technical');

  const addSessionToHistory = (newSession) => {
    // Add a unique ID to each session for routing
    const sessionWithId = { ...newSession, id: Date.now().toString() };
    setSessionHistory(prevHistory => [sessionWithId, ...prevHistory]);
    return sessionWithId;
  };

  const getSessionById = (id) => {
    return sessionHistory.find(session => session.id === id);
  }

  // useMemo prevents the value object from being recreated on every render
  const value = useMemo(() => ({
    sessionHistory,
    addSessionToHistory,
    getSessionById,
    sessionType,
    setSessionType,
  }), [sessionHistory, sessionType]);


  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};