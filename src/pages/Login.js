import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Fade,
  IconButton,
  Alert,
  Collapse,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { ArrowBack, Email, Lock, Close, Visibility, VisibilityOff } from '@mui/icons-material';

export default function Login({ onLogin, setIsAuthenticated, setUserEmail, setIsAdmin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const navigate = useNavigate();

  // Load remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const isRemembered = localStorage.getItem('rememberMe') === 'true';

    if (isRemembered && rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setShowAlert(true);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setShowAlert(true);
      return;
    }

    setIsLoading(true);
    setError('');
    setShowAlert(false);
    
    try {
      // Make API call to your backend
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Login successful');
        
        // Fetch profile data immediately
        const profileResponse = await fetch('http://localhost:3001/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${data.token}`,
            'Content-Type': 'application/json'
          }
        });

        let profileData = data.user;
        if (profileResponse.ok) {
          const profile = await profileResponse.json();
          profileData = profile.user;
        }

        // Handle Remember Me functionality
        if (rememberMe) {
          // Store login info for longer period (30 days)
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('rememberedEmail', email);
          // Set token expiry for 30 days
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + 30);
          localStorage.setItem('tokenExpiry', expiryDate.toISOString());
        } else {
          // Clear remember me data
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('rememberedEmail');
          // Set token expiry for 1 day (default)
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + 1);
          localStorage.setItem('tokenExpiry', expiryDate.toISOString());
        }

        // Use the onLogin prop from App.js (if available) or fallback to old method
        if (onLogin) {
          await onLogin(email, data.token, profileData);
        } else {
          // Fallback for old prop system
          localStorage.setItem('token', data.token);
          localStorage.setItem('userEmail', email);
          localStorage.setItem('userRole', data.user.role);
          localStorage.setItem('userProfile', JSON.stringify(profileData));

          if (setUserEmail) setUserEmail(email);
          if (setIsAuthenticated) setIsAuthenticated(true);
          if (setIsAdmin) setIsAdmin(data.user.role === 'admin');
        }
        
        // Navigate based on role
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/home');
        }
        
      } else {
        setError(data.error || 'Invalid credentials');
        setShowAlert(true);
      }
      
    } catch (err) {
      console.error('Login error:', err);
      
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Cannot connect to server. Please make sure the backend is running on port 3001.');
      } else {
        setError('Network error. Please check your connection and try again.');
      }
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    setResetMessage('');
    setResetEmail('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handlePasswordReset = async () => {
    if (!resetEmail || !newPassword || !confirmPassword) {
      setResetMessage('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetMessage('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setResetMessage('Password must be at least 6 characters');
      return;
    }

    setResetLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: resetEmail.trim().toLowerCase(),
          newPassword: newPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResetMessage('Password reset successful! You can now login with your new password.');
        setResetEmail('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setResetMessage(data.error || 'Failed to reset password');
      }
    } catch (error) {
      setResetMessage('Error resetting password. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes wave {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(20deg); }
            75% { transform: rotate(-10deg); }
          }
        `}
      </style>
      <Box sx={{
        background: 'linear-gradient(135deg, #FFE5E5 0%, #E5E5FF 25%, #E5FFE5 50%, #FFFFE5 75%, #FFE5FF 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(255, 182, 193, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(147, 112, 219, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(135, 206, 235, 0.2) 0%, transparent 50%)
        `
      }}>
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
        <Fade in={true} timeout={1000}>
          <Box sx={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 229, 229, 0.6) 100%)',
            borderRadius: '24px',
            p: { xs: 3, md: 4 },
            boxShadow: '0 20px 60px rgba(255, 192, 203, 0.2)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            maxWidth: '500px',
            mx: 'auto',
            position: 'relative'
          }}>
            {/* Validation Alert */}
            <Collapse in={showAlert}>
              <Alert
                severity="error"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => setShowAlert(false)}
                  >
                    <Close fontSize="inherit" />
                  </IconButton>
                }
                sx={{ mb: 2 }}
              >
                {error}
              </Alert>
            </Collapse>

            {/* Admin Login Hint */}
            {email.includes('admin') && (
              <Alert severity="info" sx={{ mb: 2 }}>
                🔐Admin login detected
              </Alert>
            )}

            {/* Back Button */}
            <IconButton 
              onClick={() => navigate('/')} 
              sx={{ 
                position: 'absolute',
                top: 16,
                left: 16,
                backgroundColor: 'rgba(110, 142, 251, 0.1)',
                color: 'primary.main',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(110, 142, 251, 0.2)',
                  transform: 'translateX(-3px)',
                  boxShadow: '0 8px 25px rgba(110, 142, 251, 0.2)'
                }
              }}
            >
              <ArrowBack />
            </IconButton>

            {/* Header Section */}
            <Box sx={{ textAlign: 'center', mt: 2, mb: 4 }}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mb: 1
              }}>
                <Typography variant="h3" sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #FF69B4 0%, #9370DB 50%, #4169E1 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '2.2rem', md: '2.8rem' },
                  textAlign: 'center',
                  display: 'inline-block',
                  mr: 1
                }}>
                  Welcome Back!
                </Typography>
                <span style={{
                  fontSize: '2.2rem',
                  filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
                  animation: 'wave 2s ease-in-out infinite',
                  display: 'inline-block'
                }}>
                  👋
                </span>
              </Box>
              
              <Typography variant="h6" sx={{
                color: 'text.secondary',
                fontWeight: 500,
                mb: 1
              }}>
                Login to Your Account
              </Typography>
              
              <Typography color="text.secondary" sx={{ 
                fontSize: '0.95rem',
                opacity: 0.8
              }}>
                Ready to continue your journey?
              </Typography>
            </Box>

            {/* User Types Info */}
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                👤 <strong>Student Login</strong><br/>
                🔐 <strong>Admin Login</strong>
              </Typography>
            </Alert>

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 1, color: 'primary.main', display: 'flex', alignItems: 'center' }}>
                        <Email fontSize="small" />
                      </Box>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                    }
                  }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 1, color: 'primary.main', display: 'flex', alignItems: 'center' }}>
                        <Lock fontSize="small" />
                      </Box>
                    ),
                    endAdornment: (
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
                        sx={{ color: 'primary.main' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                    }
                  }}
                />
              </Box>

              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 3
              }}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      color="primary"
                      sx={{
                        '&.Mui-checked': {
                          color: '#6e8efb',
                        },
                      }}
                    />
                  }
                  label="Remember me"
                  sx={{ color: 'text.secondary' }}
                />
                
                <Link
                  component="button"
                  type="button"
                  onClick={handleForgotPassword}
                  underline="hover"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    '&:hover': {
                      color: 'primary.dark',
                      transform: 'scale(1.05)'
                    }
                  }}
                >
                  Forgot password?
                </Link>
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={isLoading}
                sx={{
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #6e8efb 0%, #a777e3 100%)',
                  boxShadow: '0 8px 32px rgba(110, 142, 251, 0.3)',
                  mb: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a7bf8 0%, #9566df 100%)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 40px rgba(110, 142, 251, 0.4)',
                  },
                  '&:disabled': {
                    background: '#e0e0e0',
                    color: '#a0a0a0'
                  }
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Login Now 🚀'
                )}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Don't have an account?{' '}
                  <Link 
                    component="button" 
                    onClick={() => navigate('/register')} 
                    sx={{
                      color: 'primary.main',
                      fontWeight: 600,
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: 'primary.dark',
                        textDecoration: 'underline',
                        transform: 'scale(1.05)'
                      }
                    }}
                  >
                    Register here
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Container>

      {/* Forgot Password Dialog */}
      <Dialog
        open={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{
          textAlign: 'center',
          background: 'linear-gradient(135deg, #FF69B4 0%, #9370DB 50%, #4169E1 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 700
        }}>
          Reset Your Password 🔐”
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {!resetMessage ? (
            <>
              <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                Enter your email address and create a new password.
              </Typography>
              <TextField
                label="Email Address"
                type="email"
                fullWidth
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  }
                }}
              />
              <TextField
                label="New Password"
                type="password"
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  }
                }}
              />
              <TextField
                label="Confirm New Password"
                type="password"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  }
                }}
              />
            </>
          ) : (
            <Alert severity={resetMessage.includes('successful') ? 'success' : 'error'}>
              {resetMessage}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setShowForgotPassword(false)}
            sx={{ borderRadius: '12px' }}
          >
            Close
          </Button>
          {!resetMessage && (
            <Button
              onClick={handlePasswordReset}
              variant="contained"
              disabled={resetLoading}
              sx={{
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #FF69B4 0%, #9370DB 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #E55A9A 0%, #8A5FD6 100%)',
                }
              }}
            >
              {resetLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
    </>
  );
}
