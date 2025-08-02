/**
 * Creates a unique key for storing a user's session history in localStorage.
 * @param {string} userId - The ID of the currently logged-in user.
 * @returns {string} The localStorage key specific to the user.
 */
const getSessionsKey = (userId) => `voicecoach-session-history-${userId}`;

/**
 * Retrieves all saved sessions for a specific user from localStorage.
 * @param {string} userId - The ID of the user whose sessions to retrieve.
 * @returns {Array} An array of session objects, or an empty array if none are found.
 */
export const getSessions = (userId) => {
    // If no user is logged in, there's no history to retrieve.
    if (!userId) {
        return [];
    }
    
    try {
        const key = getSessionsKey(userId);
        const sessions = localStorage.getItem(key);
        // Parse the stored JSON, or return an empty array if nothing is stored.
        return sessions ? JSON.parse(sessions) : [];
    } catch (error) {
        console.error("Error getting sessions from localStorage:", error);
        return [];
    }
};

/**
 * Adds a new session to the history for a specific user in localStorage.
 * @param {string} userId - The ID of the user to save the session for.
 * @param {object} newSession - The session object to add.
 */
export const addSession = (userId, newSession) => {
    // Do not save if there's no user ID.
    if (!userId) {
        console.error("Attempted to save a session without a user ID.");
        return;
    }

    try {
        const key = getSessionsKey(userId);
        // Get the existing sessions for this specific user.
        const sessions = getSessions(userId); 
        // Add the new session to the beginning of the list.
        const updatedSessions = [newSession, ...sessions];
        // Save the updated list back to localStorage.
        localStorage.setItem(key, JSON.stringify(updatedSessions));
    } catch (error) {
        console.error("Error saving session to localStorage:", error);
    }
};
