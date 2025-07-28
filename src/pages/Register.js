import { useState } from 'react';
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
  CircularProgress
} from '@mui/material';
import { ArrowBack, Person, Email, Lock, Close, Security } from '@mui/icons-material';

export default function Register({ setUserEmail }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    matricNumber: '',
    fullName: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    matric: '',
    password: ''
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Enhanced email validation - ONLY UiTM student emails allowed
  const validateEmail = (email) => {
  const trimmedEmail = email.trim().toLowerCase();
  const isUiTMEmail = trimmedEmail.endsWith('@student.uitm.edu.my');
  
  const bannedDomains = [
    '@gmail.com', '@yahoo.com', '@hotmail.com', '@outlook.com', 
    '@live.com', '@msn.com', '@icloud.com', '@protonmail.com',
    '@tutanota.com', '@yandex.com', '@aol.com', '@mail.com',
    '@zoho.com', '@gmx.com', '@fastmail.com', '@temp-mail.org',
    '@10minutemail.com', '@guerrillamail.com', '@mailinator.com',
    '@uitm.edu.my'
  ];

  const hasBannedDomain = bannedDomains.some(domain => trimmedEmail.endsWith(domain));

  if (!trimmedEmail) {
    setErrors(prev => ({ ...prev, email: 'Email is required' }));
    return false;
  }
  if (hasBannedDomain && !isUiTMEmail) {
    setErrors(prev => ({ ...prev, email: 'Only UiTM student emails are allowed' }));
    return false;
  }
  if (!isUiTMEmail) {
    setErrors(prev => ({ ...prev, email: 'Email must end with @student.uitm.edu.my' }));
    return false;
  }

  // ✅ Clear error
  setErrors(prev => ({ ...prev, email: '' }));
  return true;
};


  // Enhanced matric number validation for UiTM current students
  const validateMatric = (matric) => {
    const cleanMatric = matric.trim();
    const currentYear = new Date().getFullYear();
    
    // UiTM matric format: YYYYPPSSSS
    // YYYY = Year (20xx), PP = Program code, SSSS = Student number
    const matricPattern = /^20\d{8}$/;
    
    if (!cleanMatric) {
      setErrors(prev => ({
        ...prev,
        matric: 'Matric number is required'
      }));
      return false;
    }
    
    if (!matricPattern.test(cleanMatric)) {
      setErrors(prev => ({
        ...prev,
        matric: 'Invalid format. UiTM matric must be 10 digits starting with 20 (e.g., 2023123456)'
      }));
      return false;
    }
    
    // Extract year from matric number
    const matricYear = parseInt(cleanMatric.substring(0, 4));
    
    // Validate year range (current active students)
    // Assuming students can be enrolled for max 7 years (including foundation, diploma, degree, masters)
    const minValidYear = currentYear - 7;
    const maxValidYear = currentYear + 1; // Allow next year's intake
    
    if (matricYear < minValidYear || matricYear > maxValidYear) {
      setErrors(prev => ({
        ...prev,
        matric: `Invalid year in matric number. Active students should have matric years between ${minValidYear} and ${maxValidYear}`
      }));
      return false;
    }
    
    // Additional validation for program codes (PP part)
    const programCode = cleanMatric.substring(4, 6);
    
    // UiTM uses program codes from 01 to 99 (and potentially higher)
    // Check if program code is valid (should be 2 digits, 01-99)
    const programCodeNum = parseInt(programCode);
    if (isNaN(programCodeNum) || programCodeNum < 1 || programCodeNum > 99) {
      setErrors(prev => ({
        ...prev,
        matric: 'Invalid program code in matric number. Program code should be between 01-99'
      }));
      return false;
    }
    
    setErrors(prev => ({
      ...prev,
      matric: ''
    }));
    return true;
  };

  // 🎯 EXHIBITION MODE: Simplified password validation for easy demo
  const validatePassword = (password) => {
    if (password.length < 6) {
      setErrors(prev => ({
        ...prev,
        password: 'Password must be at least 6 characters long'
      }));
      return false;
    }

    // ✅ EXHIBITION: Allow simple passwords like 'pass123', 'demo123', etc.
    // No complex requirements for demo purposes

    setErrors(prev => ({
      ...prev,
      password: ''
    }));
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Prevent pasting of non-UiTM emails
    if (name === 'email') {
      const cleanValue = value.trim().toLowerCase();
      const bannedDomains = ['@gmail.com', '@yahoo.com', '@hotmail.com', '@outlook.com'];
      const hasBannedDomain = bannedDomains.some(domain => cleanValue.includes(domain));
      
      if (hasBannedDomain && !cleanValue.includes('@student.uitm.edu.my')) {
        setAlertMessage('Only UiTM student emails (@student.uitm.edu.my) are allowed');
        setShowAlert(true);
        return; // Don't update the field
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Real-time validation
    if (name === 'email') validateEmail(value);
    if (name === 'matricNumber') validateMatric(value);
    if (name === 'password') validatePassword(value);
  };

  const handleRegister = async (e) => {
    console.log("🛠️ handleRegister triggered!");

    e.preventDefault();
    
    // Comprehensive validation before submission
    const trimmedEmail = formData.email.trim();
const trimmedPassword = formData.password.trim();
const trimmedMatric = formData.matricNumber.trim();
const trimmedName = formData.fullName.trim();

const isEmailValid = validateEmail(trimmedEmail);
const isMatricValid = validateMatric(trimmedMatric);
const isPasswordValid = validatePassword(trimmedPassword);
const isNameValid = trimmedName.length >= 2;
console.log('Validation Check:', {
  trimmedEmail,
  trimmedPassword,
  trimmedMatric,
  trimmedName,
  isEmailValid,
  isMatricValid,
  isPasswordValid,
  isNameValid
});

    
    if (!isNameValid) {
      setAlertMessage('Please enter your full name (at least 2 characters)');
      setShowAlert(true);
      return;
    }
    
    if (!isEmailValid) {
  setAlertMessage('Invalid UiTM student email');
  setShowAlert(true);
  return;
}
if (!isMatricValid) {
  setAlertMessage('Invalid matric number');
  setShowAlert(true);
  return;
}
if (!isPasswordValid) {
  setAlertMessage('Invalid password');
  setShowAlert(true);
  return;
}


    // Double-check email domain to prevent bypass attempts
    if (!trimmedEmail.toLowerCase().endsWith('@student.uitm.edu.my'))
 {
      setAlertMessage('Security Alert: Only verified UiTM student emails are allowed');
      setShowAlert(true);
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('📦 Sending register request...', {
  fullName: trimmedName,
  email: trimmedEmail,
  password: trimmedPassword,
  matricNumber: trimmedMatric
});

      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
       body: JSON.stringify({
      fullName: trimmedName,
      email: trimmedEmail.toLowerCase(),
      password: trimmedPassword,
      matricNumber: trimmedMatric
      
})

      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setUserEmail(formData.email);
      navigate('/login');
    } catch (error) {
      setAlertMessage(error.message);
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{
      background: 'linear-gradient(135deg, #ffc3e1 0%, #c3d9ff 50%, #e1c3ff 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 20s ease infinite',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      '@keyframes gradientShift': {
        '0%': { backgroundPosition: '0% 50%' },
        '50%': { backgroundPosition: '100% 50%' },
        '100%': { backgroundPosition: '0% 50%' }
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(255, 195, 225, 0.2) 0%, rgba(195, 217, 255, 0.2) 50%, rgba(225, 195, 255, 0.2) 100%)',
        zIndex: 1
      }
    }}>
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
        <Fade in={true} timeout={1000}>
          <Box sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '24px',
            p: { xs: 3, md: 4 },
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.2)',
            maxWidth: '500px',
            mx: 'auto',
            position: 'relative'
          }}>
            {/* Security Alert */}
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
                {alertMessage}
              </Alert>
            </Collapse>

            {/* Back Button */}
            <IconButton 
              onClick={() => navigate('/')} 
              sx={{ 
                position: 'absolute',
                top: 16,
                left: 16,
                backgroundColor: 'rgba(195, 217, 255, 0.3)',
                color: 'primary.main',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(225, 195, 255, 0.4)',
                  transform: 'translateX(-3px)',
                  boxShadow: '0 8px 25px rgba(195, 217, 255, 0.4)'
                }
              }}
            >
              <ArrowBack />
            </IconButton>

            {/* Header Section */}
            <Box sx={{ textAlign: 'center', mt: 2, mb: 4 }}>
              <Typography variant="h3" sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #ffc3e1 0%, #c3d9ff 50%, #e1c3ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
                fontSize: { xs: '2.2rem', md: '2.8rem' }
              }}>
                Join RoomTopia!
              </Typography>
              
              <Typography variant="h6" sx={{
                color: 'text.secondary',
                fontWeight: 500,
                mb: 1
              }}>
                UiTM Student Registration
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                <Security color="primary" fontSize="small" />
                <Typography color="text.secondary" sx={{ 
                  fontSize: '0.85rem',
                  fontWeight: 500
                }}>
                  Student Community Platform
                </Typography>
              </Box>
              
              <Typography color="text.secondary" sx={{ 
                fontSize: '0.8rem',
                opacity: 0.8
              }}>
                Only @student.uitm.edu.my emails accepted
              </Typography>
            </Box>

            {/* Registration Form */}
            <Box component="form" onSubmit={handleRegister}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  label="Full Name"
                  name="fullName"
                  fullWidth
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 1, color: 'primary.main', display: 'flex', alignItems: 'center' }}>
                        <Person fontSize="small" />
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

              <Box sx={{ mb: 3 }}>
                <TextField
                  label="UiTM Student Email"
                  name="email"
                  type="email"
                  fullWidth
                  required
                  placeholder="xxxxxxxxxx@student.uitm.edu.my"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => validateEmail(formData.email)}
                  error={!!errors.email}
                  helperText={errors.email || "Must end with @student.uitm.edu.my"}
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 1, color: errors.email ? 'error.main' : 'primary.main', display: 'flex', alignItems: 'center' }}>
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

              <Box sx={{ mb: 3 }}>
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  fullWidth
                  required
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password || "Minimum 6 characters (e.g., pass123, demo123)"}
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 1, color: errors.password ? 'error.main' : 'primary.main', display: 'flex', alignItems: 'center' }}>
                        <Lock fontSize="small" />
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

              <Box sx={{ mb: 4 }}>
                <TextField
                  label="UiTM Matric Number"
                  name="matricNumber"
                  fullWidth
                  required
                  placeholder="2023123456"
                  value={formData.matricNumber}
                  onChange={handleChange}
                  onBlur={() => validateMatric(formData.matricNumber)}
                  error={!!errors.matric}
                  helperText={errors.matric || "10 digits starting with 20 (e.g., 2023123456)"}
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 1, color: errors.matric ? 'error.main' : 'primary.main', display: 'flex', alignItems: 'center' }}>
                        <Person fontSize="small" />
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
                  background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #4169e1 100%)',
                  boxShadow: '0 8px 32px rgba(65, 105, 225, 0.5)',
                  mb: 3,
                  transition: 'all 0.3s ease',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1a2f5f 0%, #1e4085 50%, #2952cc 100%)',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 16px 50px rgba(65, 105, 225, 0.7)',
                    border: '2px solid rgba(255, 255, 255, 0.4)',
                  },
                  '&:disabled': {
                    background: '#e0e0e0',
                    color: '#a0a0a0'
                  }
                }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Create Verified Account 🔐'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Already have an account?{' '}
                  <Link 
                    component="button" 
                    onClick={() => navigate('/login')} 
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
                    Login here
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
}
