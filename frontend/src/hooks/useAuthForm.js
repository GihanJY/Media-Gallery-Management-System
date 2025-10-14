import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const useAuthForm = (initialState = {}) => {
  const [formData, setFormData] = useState(initialState);
  const [localError, setLocalError] = useState('');
  const { error: contextError, clearError } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (localError) setLocalError('');
    if (contextError) clearError();
  };

  const setError = (error) => {
    setLocalError(error);
  };

  const resetForm = () => {
    setFormData(initialState);
    setLocalError('');
    clearError();
  };

  return {
    formData,
    setFormData,
    handleChange,
    error: localError || contextError,
    setError,
    resetForm
  };
};