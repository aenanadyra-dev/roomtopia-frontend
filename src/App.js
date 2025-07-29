import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import API_BASE_URL from './api';

// Import your pages
import AdminDashboard from './pages/AdminDashboard';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import FindRoomie from './pages/FindRoomie';
import PostRoommateRequest from './pages/PostRoommateRequest';
import PropertyListings from './pages/PropertyListings';
import PostProperty from './pages/PostProperty';

// Import your main navigation bar
import MuiToolBar from './components/MuiToolBar';

// Floating animations matching Home.js
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-20px) rotate(90deg); }
  50% { transform: translateY(-10px) rotate(180deg); }
  75% { transform: translateY(-30px) rotate(270deg); }
`;

// Styled components matching Home.js aesthetic
const AppContainer = styled(Box)(() => ({
  background: 'linear-gradient(135deg, #FFE5E5 0%, #E5E5FF 25%, #E5FFE5 50%, #FFFFE5 75%, #FFE5FF 100%)',
  minHeight: '100vh',
  position: 'relative',
  overflow: 'hidden',
}));

const FloatingShape = styled(Box)(({ delay = 0, size = 60, color = '#FFB6C1' }) => ({
  position: 'fixed',
  width: size,
  height: size,
  borderRadius: '50%',
  background: `linear-gradient(135deg, ${color}40, ${color}20)`,
  animation: `${float} ${4 + delay}s ease-in-out infinite`,
  animationDelay: `${delay}s`,
  zIndex: 0,
  pointerEvents: 'none',
}));

// Enhanced theme matching Home.js colors and styling
const theme = createTheme({
  palette: {
    primary: { 
      main: '#FF69B4', 
      light: '#FFB6C1', 
      dark: '#C71585',
      contrastText: '#ffffff' 
    },
    secondary: { 
      main: '#9370DB',
      light: '#DDA0DD',
      dark: '#8B008B',
      contrastText: '#ffffff'
    },
    background: { 
      default: 'linear-gradient(135deg, #FFE5E5 0%, #E5E5FF 25%, #E5FFE5 50%, #FFFFE5 75%, #FFE5FF 100%)', 
      paper: 'rgba(255, 255, 255, 0.9)' 
    },
    info: {
      main: '#87CEEB',
      light: '#B0E0E6',
      dark: '#4682B4'
    },
    warning: {
      main: '#F0E68C',
      light: '#FFFFE0',
      dark: '#DAA520'
    }
  },
  typography: {
    fontFamily: '"Poppins", "Inter", "Roboto", sans-serif',
    h1: { 
      fontWeight: 800,
      background: 'linear-gradient(135deg, #FF69B4 0%, #9370DB 50%, #4169E1 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: { 
      fontWeight: 700,
      background: 'linear-gradient(135deg, #FF69B4 0%, #9370DB 50%, #4169E1 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h3: { 
      fontWeight: 700,
      color: '#9370DB'
    },
    h4: { 
      fontWeight: 700,
      color: '#FF69B4'
    },
    h5: { 
      fontWeight: 600,
      color: '#9370DB'
    },
    h6: { 
      fontWeight: 600,
      color: '#FF69B4'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { 
          borderRadius: '25px', 
          textTransform: 'none', 
          fontWeight: 700,
          padding: '12px 30px',
          boxShadow: '0 8px 25px rgba(255, 182, 193, 0.4)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-3px) scale(1.05)',
            boxShadow: '0 15px 35px rgba(255, 182, 193, 0.6)',
          }
        },
        contained: {
          background: 'linear-gradient(135deg, #FFB6C1 0%, #DDA0DD 50%, #87CEEB 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #FF69B4 0%, #DA70D6 50%, #4169E1 100%)',
          }
        }
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(255, 192, 203, 0.2)',
          background: 'linear-gradient(135deg, rgba(255, 229, 229, 0.8) 0%, rgba(229, 229, 255, 0.8) 100%)',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 229, 229, 0.6) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-5px) scale(1.02)',
            boxShadow: '0 25px 60px rgba(255, 192, 203, 0.4)',
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '15px',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.9)',
            },
            '&.Mui-focused': {
              background: 'rgba(255, 255, 255, 0.95)',
              boxShadow: '0 8px 25px rgba(255, 105, 180, 0.3)',
            }
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          fontWeight: 600,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #FFE5E5 0%, #E5E5FF 25%, #E5FFE5 50%, #FFFFE5 75%, #FFE5FF 100%)',
          boxShadow: '0 8px 32px rgba(255, 192, 203, 0.3)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }
      }
    }
  },
});

// 🔧 ENHANCED: AppWrapper with FIXED authentication
function AppWrapper() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();

  // 🔥 FIXED: Enhanced authentication check
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('userEmail');
      const adminStatus = localStorage.getItem('isAdmin') === 'true';
      const storedProfile = localStorage.getItem('userProfile');
      
      console.log('🔍 Auth Check:', { 
        hasToken: !!token, 
        email, 
        adminStatus, 
        hasProfile: !!storedProfile 
      });
      
      if (token && email) {
        try {
          // ✅ Try to verify token with backend
          const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            
            // ✅ Auth is valid, restore state
            setIsAuthenticated(true);
            setUserEmail(email);
            setIsAdmin(adminStatus);
            setUserProfile(data.user || (storedProfile ? JSON.parse(storedProfile) : null));
            
            console.log('✅ Authentication restored successfully');
          } else {
            console.log('❌ Token expired/invalid, clearing auth');
            clearAuth();
          }
        } catch (error) {
          // ✅ Network error, but keep local auth if data exists
          console.log('⚠️ Network error, using stored auth:', error.message);
          
          setIsAuthenticated(true);
          setUserEmail(email);
          setIsAdmin(adminStatus);
          setUserProfile(storedProfile ? JSON.parse(storedProfile) : null);
        }
      } else {
        console.log('ℹ️ No stored credentials found');
      }
    } catch (error) {
      console.error('❌ Auth initialization error:', error);
      clearAuth();
    } finally {
      setLoading(false);
    }
  };

  // 🔥 ENHANCED: Clear all auth data
  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userProfile');
    
    setIsAuthenticated(false);
    setUserEmail('');
    setIsAdmin(false);
    setUserProfile(null);
  };

  // 🔥 ENHANCED: Login handler with better error handling
  const handleLogin = async (email, token, userData) => {
    try {
      console.log('🔐 Processing login for:', email);
      
      // Store all auth data
      localStorage.setItem('token', token);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('isAdmin', userData.role === 'admin' ? 'true' : 'false');
      
      // Try to fetch complete profile
      let profileData = userData;
      try {
const profileResponse = await fetch(`${API_BASE_URL}/api/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (profileResponse.ok) {
          const profile = await profileResponse.json();
          profileData = profile.user;
        }
      } catch (profileError) {
        console.log('⚠️ Profile fetch failed, using login data');
      }
      
      localStorage.setItem('userProfile', JSON.stringify(profileData));

      // Update app state
      setIsAuthenticated(true);
      setUserEmail(email);
      setIsAdmin(userData.role === 'admin');
      setUserProfile(profileData);
      
      console.log('✅ Login completed successfully');
      return true;
    } catch (error) {
      console.error('❌ Login error:', error);
      return false;
    }
  };

  // 🔥 ENHANCED: Logout handler
  const handleLogout = () => {
    console.log('👋 Logging out user:', userEmail);
    clearAuth();
  };

  // 🔥 ENHANCED: Profile update handler
  const handleProfileUpdate = (updatedProfile) => {
    setUserProfile(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    console.log('✅ Profile updated');
  };

  // 🎨 Loading screen
  if (loading) {
    return (
      <AppContainer>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column'
        }}>
          <Box sx={{ 
            fontSize: '3rem', 
            mb: 2,
            background: 'linear-gradient(135deg, #FF69B4 0%, #9370DB 50%, #4169E1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 800
          }}>
            🏠 RoomTopia
          </Box>
          <Box sx={{ 
            color: '#9370DB', 
            fontSize: '1.2rem',
            background: 'rgba(255, 255, 255, 0.8)',
            padding: '12px 24px',
            borderRadius: '25px',
            backdropFilter: 'blur(10px)'
          }}>
            Initializing your session...
          </Box>
        </Box>
      </AppContainer>
    );
  }

  // 🔥 SIMPLE AUTH CHECK FUNCTION
  const isUserAuthenticated = () => {
    const hasToken = !!localStorage.getItem('token');
    const hasEmail = !!localStorage.getItem('userEmail');
    const hasAuth = isAuthenticated && userEmail;
    
    console.log('🔍 Auth Check:', { hasToken, hasEmail, hasAuth, isAuthenticated, userEmail });
    
    return hasToken && hasEmail && hasAuth;
  };
  
  return (
    <AppContainer>
      {/* Animated Background Elements */}
      <FloatingShape sx={{ top: '10%', left: '5%' }} delay={0} size={80} color="#FFB6C1" />
      <FloatingShape sx={{ top: '20%', right: '10%' }} delay={1} size={60} color="#DDA0DD" />
      <FloatingShape sx={{ top: '60%', left: '8%' }} delay={2} size={70} color="#87CEEB" />
      <FloatingShape sx={{ top: '70%', right: '15%' }} delay={3} size={50} color="#F0E68C" />
      <FloatingShape sx={{ top: '40%', left: '50%' }} delay={1.5} size={40} color="#FFB6C1" />
      <FloatingShape sx={{ top: '80%', left: '70%' }} delay={2.5} size={90} color="#E6E6FA" />
      <FloatingShape sx={{ top: '15%', left: '75%' }} delay={0.5} size={35} color="#98FB98" />
      <FloatingShape sx={{ top: '85%', left: '25%' }} delay={3.5} size={65} color="#F0E68C" />
      
      {/* 🔥 FIXED: Navigation bar logic */}
      {isUserAuthenticated() && 
       location.pathname !== '/' && 
       location.pathname !== '/login' && 
       location.pathname !== '/register' && 
       location.pathname !== '/admin' && (
        <MuiToolBar 
          isAuthenticated={isAuthenticated} 
          setIsAuthenticated={handleLogout}
          userEmail={userEmail}
        />
      )}
      
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Routes>
          {/* 🏠 Landing Page */}
          <Route 
            path="/" 
            element={<Landing setIsAuthenticated={setIsAuthenticated} />} 
          />
          
          {/* 🔐 Authentication Routes */}
          <Route 
            path="/login" 
            element={
              isUserAuthenticated() ? 
              <Navigate to={isAdmin ? "/admin" : "/home"} replace /> :
              <Login 
                onLogin={handleLogin}
                setIsAuthenticated={setIsAuthenticated} 
                setUserEmail={setUserEmail}
                setIsAdmin={setIsAdmin}
              />
            } 
          />
          <Route 
            path="/register" 
            element={
              isUserAuthenticated() ? 
              <Navigate to="/home" replace /> :
              <Register 
                setIsAuthenticated={setIsAuthenticated} 
                setUserEmail={setUserEmail}
              />
            } 
          />
          
          {/* 🏠 Main App Routes - ALL PROTECTED */}
          <Route
            path="/home"
            element={
              isUserAuthenticated() ?
              <Home userEmail={userEmail} userProfile={userProfile} /> :
              <Navigate to="/login" replace />
            }
          />
          <Route 
            path="/find-roomie" 
            element={
              isUserAuthenticated() ? 
              <FindRoomie userEmail={userEmail} /> : 
              <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/post-roommate" 
            element={
              isUserAuthenticated() ? 
              <PostRoommateRequest userEmail={userEmail} /> : 
              <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/property-listings" 
            element={
              isUserAuthenticated() ? 
              <PropertyListings 
                userEmail={userEmail} 
                userProfile={userProfile}
              /> : 
              <Navigate to="/login" replace />
            } 
          />
          
          {/* 🔥 FIXED: Post Property Route */}
          <Route 
            path="/post-property" 
            element={
              isUserAuthenticated() ? 
              <PostProperty userEmail={userEmail} /> : 
              <Navigate to="/login" replace />
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              isUserAuthenticated() ? 
              <Profile 
                userEmail={userEmail} 
                userProfile={userProfile}
                onUpdateProfile={handleProfileUpdate}
              /> : 
              <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/settings" 
            element={
              isUserAuthenticated() ? 
              <Settings 
                userEmail={userEmail} 
                onLogout={handleLogout}
              /> : 
              <Navigate to="/login" replace />
            } 
          />
          
          {/* 👑 Admin Route */}
          <Route 
            path="/admin" 
            element={
              isUserAuthenticated() && isAdmin ? 
              <AdminDashboard userEmail={userEmail} onLogout={handleLogout} /> : 
              <Navigate to="/login" replace />
            } 
          />
          
          {/* 🔄 Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </AppContainer>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppWrapper />
      </Router>
    </ThemeProvider>
  );
}

export default App;