import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

// Auth Context
const AuthContext = createContext();

// Auth Actions
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_TOKEN: 'SET_TOKEN',
  LOGOUT: 'LOGOUT',
  SET_ERROR: 'SET_ERROR',
};

// Auth Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload, error: null };
    
    case AUTH_ACTIONS.SET_USER:
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: true, 
        loading: false,
        error: null 
      };
    
    case AUTH_ACTIONS.SET_TOKEN:
      return { ...state, token: action.payload };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    
    case AUTH_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    default:
      return state;
  }
};

// Initial State
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      
      if (storedToken) {
        dispatch({ type: AUTH_ACTIONS.SET_TOKEN, payload: storedToken });
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
        
        try {
          const response = await authAPI.getProfile();
          dispatch({ type: AUTH_ACTIONS.SET_USER, payload: response.data });
        } catch (error) {
          console.error('Failed to get user profile:', error);
          // If token is invalid, remove it
          localStorage.removeItem('authToken');
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      }
    };

    initializeAuth();
  }, []);

  // Register user
  const register = async (phoneNumber) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const response = await authAPI.register(phoneNumber);
      toast.success('کد تأیید برای شما ارسال شد');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'خطا در ارسال کد تأیید';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  // Verify user and login
  const verify = async (phoneNumber, code) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const response = await authAPI.verify(phoneNumber, code);
      const { access: token, user } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('authToken', token);
      
      // Update state
      dispatch({ type: AUTH_ACTIONS.SET_TOKEN, payload: token });
      dispatch({ type: AUTH_ACTIONS.SET_USER, payload: user });
      
      toast.success('با موفقیت وارد شدید');
      return { token, user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'کد تأیید نامعتبر است';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const response = await authAPI.updateProfile(profileData);
      dispatch({ type: AUTH_ACTIONS.SET_USER, payload: response.data });
      toast.success('پروفایل با موفقیت بروزرسانی شد');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'خطا در بروزرسانی پروفایل';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('authToken');
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    toast.info('از حساب کاربری خارج شدید');
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: null });
  };

  const value = {
    ...state,
    register,
    verify,
    updateProfile,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};