import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('userEmail');
      
      if (token && email) {
        // Verify token is still valid and fetch profile
        const response = await fetch('http://localhost:3001/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);
          setUserEmail(email);
          setUserProfile(data.user);
          console.log('✅ Auth restored:', email);
        } else {
          // Token invalid, clear storage
          logout();
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userProfile', JSON.stringify(userData));
    
    setIsAuthenticated(true);
    setUserEmail(email);
    setUserProfile(userData);
    
    console.log('✅ User logged in:', email);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userProfile');
    
    setIsAuthenticated(false);
    setUserEmail('');
    setUserProfile(null);
    
    console.log('👋 User logged out');
  };

  const updateProfile = (updatedProfile) => {
    setUserProfile(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
  };

  return {
    isAuthenticated,
    userEmail,
    userProfile,
    loading,
    login,
    logout,
    updateProfile,
    checkAuthStatus
  };
};
