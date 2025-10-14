import { createContext, useContext, useReducer, useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import api from "../utils/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Auth reducer to manage state
const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    loading: true, // Start with loading true
    error: null,
  });

  // Check authentication status on app load
  const checkAuthStatus = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      dispatch({ type: "SET_LOADING", payload: false });
      return;
    }

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await api.get("/auth/me");

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: response.data.user,
      });
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("token");
      dispatch({ type: "LOGIN_FAILURE", payload: "Session expired" });
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });
      console.log("Credentials: ",credentials);

      const response = await api.post("/auth/login", credentials);
      const { token, user } = response.data;

      // Store token in localStorage
      localStorage.setItem("token", token);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: user,
      });

      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      dispatch({
        type: "LOGIN_FAILURE",
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      const response = await api.post("/auth/register", userData);

      dispatch({ type: "SET_LOADING", payload: false });
      return {
        success: true,
        message: response.data.message,
        userId: response.data.userId,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      dispatch({
        type: "SET_ERROR",
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  // Verify OTP function
  const verifyOTP = async (otpData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      const response = await api.post("/auth/verify-otp", otpData);
      const { token, user } = response.data;

      localStorage.setItem("token", token);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: user,
      });

      return { success: true, user };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "OTP verification failed";
      dispatch({
        type: "LOGIN_FAILURE",
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  // Google Auth function
  const googleAuth = async (tokenId) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      const response = await api.post("/auth/google", { tokenId });
      const { token, user } = response.data;

      localStorage.setItem("token", token);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: user,
      });

      return { success: true, user };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Google authentication failed";
      dispatch({
        type: "LOGIN_FAILURE",
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  // Forgot password function
  const forgotPassword = async (email) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      const response = await api.post("/auth/forgot-password", { email });

      dispatch({ type: "SET_LOADING", payload: false });
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to send reset email";
      dispatch({
        type: "SET_ERROR",
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  // Reset password function
  const resetPassword = async (resetData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      const response = await api.post("/auth/reset-password", resetData);

      dispatch({ type: "SET_LOADING", payload: false });
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Password reset failed";
      dispatch({
        type: "SET_ERROR",
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
  };

  // Update user profile
  const updateUser = async (userData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      const response = await api.put("/auth/profile", userData);

      dispatch({
        type: "UPDATE_USER",
        payload: response.data.user,
      });

      dispatch({ type: "SET_LOADING", payload: false });
      return { success: true, user: response.data.user };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Profile update failed";
      dispatch({
        type: "SET_ERROR",
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return state.user?.role === role;
  };

  // Check if user is admin
  const isAdmin = () => {
    return state.user?.role === "admin";
  };

  // Auto-login check on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Context value
  const contextValue = {
    // State
    ...state,

    // Auth functions
    login,
    register,
    verifyOTP,
    googleAuth,
    forgotPassword,
    resetPassword,
    logout,
    updateUser,
    clearError,
    checkAuthStatus,

    // Utility functions
    hasRole,
    isAdmin,

    // API instance for other components
    api,
  };

  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthContext.Provider value={contextValue}>
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
};
