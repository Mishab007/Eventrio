import { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { api } from '../api/client';

const AuthContext = createContext();

// Session configuration
const SESSION_CONFIG = {
  TOKEN_KEY: 'auth_token',
  USER_KEY: 'user_data',
  SESSION_KEY: 'session_id',
  EXPIRY_KEY: 'token_expiry',
  REMEMBER_KEY: 'remember_me',
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes in milliseconds
  REMEMBER_DURATION: 7 * 24 * 60 * 60 * 1000, // 7 days
  ACTIVITY_CHECK_INTERVAL: 60 * 1000, // Check every minute
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const activityTimerRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  // Generate unique session ID
  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Store session data with expiry
  const storeSession = useCallback((token, userData, rememberMe = false) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    const expiry = Date.now() + (rememberMe ? SESSION_CONFIG.REMEMBER_DURATION : SESSION_CONFIG.SESSION_TIMEOUT);
    const newSessionId = generateSessionId();

    // Store in appropriate storage
    storage.setItem(SESSION_CONFIG.TOKEN_KEY, token);
    storage.setItem(SESSION_CONFIG.USER_KEY, JSON.stringify(userData));
    storage.setItem(SESSION_CONFIG.SESSION_KEY, newSessionId);
    storage.setItem(SESSION_CONFIG.EXPIRY_KEY, expiry.toString());
    storage.setItem(SESSION_CONFIG.REMEMBER_KEY, rememberMe.toString());

    // Also store in localStorage for cross-tab sync if remember me
    if (rememberMe) {
      localStorage.setItem('last_login', Date.now().toString());
    }

    setSessionId(newSessionId);
    lastActivityRef.current = Date.now();
  }, []);

  // Clear session data
  const clearSession = useCallback(() => {
    // Clear from both storages
    [localStorage, sessionStorage].forEach(storage => {
      storage.removeItem(SESSION_CONFIG.TOKEN_KEY);
      storage.removeItem(SESSION_CONFIG.USER_KEY);
      storage.removeItem(SESSION_CONFIG.SESSION_KEY);
      storage.removeItem(SESSION_CONFIG.EXPIRY_KEY);
      storage.removeItem(SESSION_CONFIG.REMEMBER_KEY);
    });
    
    setSessionId(null);
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  // Check if session is valid
  const isSessionValid = useCallback(() => {
    // Check both storages
    let token, expiry;
    
    // Try sessionStorage first
    token = sessionStorage.getItem(SESSION_CONFIG.TOKEN_KEY);
    expiry = sessionStorage.getItem(SESSION_CONFIG.EXPIRY_KEY);
    
    // If not in sessionStorage, try localStorage
    if (!token) {
      token = localStorage.getItem(SESSION_CONFIG.TOKEN_KEY);
      expiry = localStorage.getItem(SESSION_CONFIG.EXPIRY_KEY);
    }

    if (!token || !expiry) return false;

    const expiryTime = parseInt(expiry, 10);
    const now = Date.now();

    // Check if token has expired
    if (now > expiryTime) {
      clearSession();
      return false;
    }

    return true;
  }, [clearSession]);

  // Extend session on activity
  const extendSession = useCallback(() => {
    const storage = sessionStorage.getItem(SESSION_CONFIG.TOKEN_KEY) ? sessionStorage : localStorage;
    const rememberMe = storage.getItem(SESSION_CONFIG.REMEMBER_KEY) === 'true';
    const token = storage.getItem(SESSION_CONFIG.TOKEN_KEY);

    if (token && isSessionValid()) {
      const newExpiry = Date.now() + (rememberMe ? SESSION_CONFIG.REMEMBER_DURATION : SESSION_CONFIG.SESSION_TIMEOUT);
      storage.setItem(SESSION_CONFIG.EXPIRY_KEY, newExpiry.toString());
      lastActivityRef.current = Date.now();
    }
  }, [isSessionValid]);

  // Track user activity
  const trackActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    extendSession();
  }, [extendSession]);

  // Check for inactivity
  const checkInactivity = useCallback(() => {
    if (!isLoggedIn) return;

    const timeSinceLastActivity = Date.now() - lastActivityRef.current;
    const storage = sessionStorage.getItem(SESSION_CONFIG.TOKEN_KEY) ? sessionStorage : localStorage;
    const rememberMe = storage.getItem(SESSION_CONFIG.REMEMBER_KEY) === 'true';

    // If not "remember me" and inactive for too long, logout
    if (!rememberMe && timeSinceLastActivity > SESSION_CONFIG.SESSION_TIMEOUT) {
      console.log('Session expired due to inactivity');
      logout();
    }
  }, [isLoggedIn]);

  // Setup activity listeners
  useEffect(() => {
    if (!isLoggedIn) return;

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      window.addEventListener(event, trackActivity);
    });

    // Check inactivity periodically
    activityTimerRef.current = setInterval(checkInactivity, SESSION_CONFIG.ACTIVITY_CHECK_INTERVAL);

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, trackActivity);
      });
      if (activityTimerRef.current) {
        clearInterval(activityTimerRef.current);
      }
    };
  }, [isLoggedIn, trackActivity, checkInactivity]);

  // Restore session on app start
  useEffect(() => {
    const restoreSession = () => {
      try {
        if (!isSessionValid()) {
          setLoading(false);
          return;
        }

        // Try sessionStorage first, then localStorage
        let userData, token, storedSessionId;
        
        token = sessionStorage.getItem(SESSION_CONFIG.TOKEN_KEY);
        userData = sessionStorage.getItem(SESSION_CONFIG.USER_KEY);
        storedSessionId = sessionStorage.getItem(SESSION_CONFIG.SESSION_KEY);
        
        if (!token) {
          token = localStorage.getItem(SESSION_CONFIG.TOKEN_KEY);
          userData = localStorage.getItem(SESSION_CONFIG.USER_KEY);
          storedSessionId = localStorage.getItem(SESSION_CONFIG.SESSION_KEY);
        }

        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsLoggedIn(true);
          setSessionId(storedSessionId);
          lastActivityRef.current = Date.now();
          console.log('Session restored successfully');
        }
      } catch (error) {
        console.error('Error restoring session:', error);
        clearSession();
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, [isSessionValid, clearSession]);

  // Listen for storage changes (cross-tab sync)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === SESSION_CONFIG.TOKEN_KEY) {
        if (!e.newValue) {
          // Token removed in another tab - logout
          clearSession();
        } else if (!isLoggedIn) {
          // Token added in another tab - restore session
          window.location.reload();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isLoggedIn, clearSession]);

  const login = async (email, password, rememberMe = false) => {
    try {
      setLoading(true);
      const response = await api.login({ email, password });
      
      if (response.token) {
        storeSession(response.token, response, rememberMe);
        setUser(response);
        setIsLoggedIn(true);
        console.log(`Login successful. Session ID: ${sessionId}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password, role = 'customer', rememberMe = false) => {
    try {
      setLoading(true);
      const response = await api.register({ name, email, password, role });
      
      if (response.token) {
        storeSession(response.token, response, rememberMe);
        setUser(response);
        setIsLoggedIn(true);
        console.log(`Signup successful. Session ID: ${sessionId}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      alert(error.message || 'Signup failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const createAdmin = async (name, email, password, rememberMe = false) => {
    try {
      setLoading(true);
      const response = await api.createAdmin({ name, email, password });
      
      if (response.token) {
        storeSession(response.token, response, rememberMe);
        setUser(response);
        setIsLoggedIn(true);
        console.log(`Admin created. Session ID: ${sessionId}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Admin creation error:', error);
      alert(error.message || 'Admin creation failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    console.log('Logging out. Clearing session...');
    clearSession();
    // Redirect to home or login page
    window.location.href = '/';
  }, [clearSession]);

  const value = {
    isLoggedIn,
    user,
    loading,
    sessionId,
    isAdmin: !!user && user.role === 'admin',
    isPartner: !!user && user.role === 'partner',
    login,
    signup,
    createAdmin,
    logout,
    extendSession,
    isSessionValid,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
