import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Alert, 
  Box,
  Divider,
  Grid,
  Avatar,
  CircularProgress,
  Snackbar
} from '@mui/material';
import { 
  DeleteForever,
  Warning,
  Security,
  VerifiedUser,
  Email,
  CalendarToday,
  School,
  Phone,
  LocationOn,
  Person
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled components matching Profile.js aesthetic
const SettingsContainer = styled(Container)(({ theme }) => ({
  background: `
    linear-gradient(135deg, 
      rgba(248, 250, 252, 0.8) 0%, 
      rgba(241, 245, 249, 0.6) 100%
  `,
  backdropFilter: 'blur(10px)',
  borderRadius: '32px',
  padding: theme.spacing(8, 4),
  margin: theme.spacing(8, 0),
  border: '1px solid rgba(255, 255, 255, 0.3)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: `
      radial-gradient(circle, rgba(131, 56, 236, 0.05) 0%, transparent 70%),
      radial-gradient(circle at 70% 30%, rgba(58, 134, 255, 0.05) 0%, transparent 70%)
    `,
    animation: 'slowRotate 30s linear infinite',
    zIndex: 1,
  },
  '& > *': {
    position: 'relative',
    zIndex: 2,
  },
  '@keyframes slowRotate': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  }
}));

const SettingsPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  borderRadius: '24px',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 20px 60px rgba(131, 56, 236, 0.2)',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 30px 80px rgba(131, 56, 236, 0.3)',
  }
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  marginBottom: theme.spacing(4),
  background: 'linear-gradient(45deg, #5D2E8C 0%, #8338EC 50%, #3A86FF 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  display: 'flex',
  alignItems: 'center',
  '& svg': {
    marginRight: theme.spacing(2),
    fontSize: '2rem'
  }
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  borderRadius: '16px',
  backgroundColor: 'rgba(241, 245, 249, 0.6)',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(226, 232, 240, 0.8)',
    transform: 'translateX(5px)'
  },
  '& svg': {
    color: '#8338EC',
    fontSize: '1.8rem',
    marginRight: theme.spacing(2)
  }
}));

const DeleteButton = styled(Button)(({ theme }) => ({
  borderRadius: '50px',
  padding: '12px 30px',
  fontWeight: 700,
  background: 'linear-gradient(45deg, #FF6B6B 0%, #FF3D3D 100%)',
  color: 'white',
  boxShadow: '0 8px 25px rgba(255, 107, 107, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #FF3D3D 0%, #D32F2F 100%)',
    transform: 'translateY(-3px)',
    boxShadow: '0 15px 35px rgba(255, 61, 61, 0.4)',
  }
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 150,
  height: 150,
  fontSize: 64,
  marginBottom: theme.spacing(3),
  boxShadow: '0 15px 40px rgba(131, 56, 236, 0.3)',
  background: 'linear-gradient(45deg, #8338EC, #3A86FF)',
  border: '4px solid #8338EC',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 20px 50px rgba(131, 56, 236, 0.4)',
  }
}));

export default function Settings() {
  const [password, setPassword] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Function to get auth token
  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  // Get profile picture URL
  const getProfilePictureUrl = () => {
    if (userData?.profilePicture) {
      if (userData.profilePicture.startsWith('http')) {
        return userData.profilePicture;
      }
      return `http://localhost:3001${userData.profilePicture}`;
    }
    return null;
  };

  // ✅ FIXED: Enhanced fetchUserData with localStorage priority
  const fetchUserData = async () => {
    try {
      // 🔥 PRIORITY 1: Check localStorage first (most up-to-date)
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        try {
          const parsedProfile = JSON.parse(savedProfile);
          console.log('✅ Settings: Using localStorage profile:', parsedProfile);
          setUserData(parsedProfile);
          setLoading(false);
          return; // Exit early - localStorage has the most recent data
        } catch (error) {
          console.error('Error parsing saved profile:', error);
        }
      }

      // 🔥 PRIORITY 2: Fallback to API if no localStorage
      const token = getAuthToken();
      
      if (!token) {
        console.log('No auth token found');
        setLoading(false);
        return;
      }
      
      // Try multiple endpoints for compatibility
      const endpoints = [
        'http://localhost:3001/api/auth/profile',
        'http://localhost:3001/api/users/profile',
        'http://localhost:3001/api/user/profile'
      ];

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const result = await response.json();
            const user = result.user || result.data || result;
            
            console.log('✅ Settings: Using API profile:', user);
            setUserData(user);
            
            // Store in localStorage for next time
            localStorage.setItem('userProfile', JSON.stringify(user));
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error(`Error fetching from ${endpoint}:`, error);
        }
      }
      
      console.error('Failed to fetch profile from all endpoints');
      setLoading(false);
    } catch (error) {
      console.error('❌ Settings fetchUserData error:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // ✅ SYNC WITH LOCALSTORAGE CHANGES (like Profile.js)
  useEffect(() => {
    const handleStorageChange = () => {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        try {
          const parsedProfile = JSON.parse(savedProfile);
          console.log('🔄 Settings: localStorage updated, syncing:', parsedProfile);
          setUserData(parsedProfile);
        } catch (error) {
          console.error('Error parsing profile from storage:', error);
        }
      }
    };

    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events (in case profile is updated in same tab)
    const handleCustomProfileUpdate = (event) => {
      if (event.detail) {
        console.log('🔄 Settings: Profile updated via custom event:', event.detail);
        setUserData(event.detail);
      }
    };
    
    window.addEventListener('profileUpdated', handleCustomProfileUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileUpdated', handleCustomProfileUpdate);
    };
  }, []);

  const handleDelete = async () => {
    const token = getAuthToken();
    
    if (!token) {
      setSnackbar({
        open: true,
        message: 'Please log in to perform this action',
        severity: 'error'
      });
      return;
    }
    
    try {
      const response = await fetch('http://localhost:3001/api/auth/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password })
      });
      
      if (response.ok) {
        // Show success message
        setSnackbar({
          open: true,
          message: 'Account deleted successfully. Redirecting...',
          severity: 'success'
        });
        
        // Clear local storage and redirect after a short delay
        setTimeout(() => {
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userProfile');
          window.location.href = '/'; // Redirect to home page
        }, 2000);
      } else {
        const errorData = await response.json();
        setSnackbar({
          open: true,
          message: errorData.error || 'Failed to delete account',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      setSnackbar({
        open: true,
        message: 'Network error. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} thickness={4} sx={{ color: '#8338EC', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#64748B' }}>
            Loading your settings...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <SettingsContainer maxWidth="md">
      <SectionTitle variant="h3" gutterBottom>
        <Security sx={{ fontSize: '2.5rem' }} />
        ACCOUNT SETTINGS
      </SectionTitle>

      <SettingsPaper elevation={3}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* ✅ ENHANCED PROFILE AVATAR WITH PICTURE SUPPORT */}
              <ProfileAvatar 
                src={getProfilePictureUrl()}
                alt={userData?.fullName || 'Profile'}
              >
                {!getProfilePictureUrl() && (userData?.fullName ? 
                  userData.fullName.charAt(0).toUpperCase() : 
                  <Person sx={{ fontSize: '4rem' }} />
                )}
              </ProfileAvatar>
              
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 700, textAlign: 'center' }}>
                {userData?.fullName || 'User Name'}
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 3, color: '#64748b', textAlign: 'center' }}>
                {userData?.email || 'No email'}
              </Typography>
              
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Account Status
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                mb: 3,
                p: '8px 16px',
                borderRadius: '50px',
                background: 'rgba(128, 237, 153, 0.2)',
                color: '#1B5E20'
              }}>
                <VerifiedUser sx={{ mr: 1 }} />
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  Verified Account
                </Typography>
              </Box>

              {userData?.createdAt && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  p: '8px 16px',
                  borderRadius: '50px',
                  background: 'rgba(131, 56, 236, 0.1)',
                  color: '#8338EC'
                }}>
                  <CalendarToday sx={{ mr: 1, fontSize: '1.2rem' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Member since {new Date(userData.createdAt).getFullYear()}
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <SectionTitle variant="h4">
              ACCOUNT INFORMATION
            </SectionTitle>

            {userData && (
              <>
                <InfoItem>
                  <Email />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      EMAIL
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {userData.email || 'Not provided'}
                    </Typography>
                  </Box>
                </InfoItem>

                <InfoItem>
                  <Person />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      FULL NAME
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {userData.fullName || 'Not provided'}
                    </Typography>
                  </Box>
                </InfoItem>

                <InfoItem>
                  <Phone />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      PHONE NUMBER
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {/* ✅ FIXED: Check both phoneNumber and contactInfo */}
                      {userData.phoneNumber || userData.contactInfo || 'Not provided'}
                    </Typography>
                  </Box>
                </InfoItem>

                <InfoItem>
                  <CalendarToday />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      JOINED DATE
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'Not provided'}
                    </Typography>
                  </Box>
                </InfoItem>

                {userData.university && (
                  <InfoItem>
                    <School />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        UNIVERSITY
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {userData.university}
                      </Typography>
                    </Box>
                  </InfoItem>
                )}

                {userData.faculty && (
                  <InfoItem>
                    <School />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        FACULTY
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {userData.faculty}
                      </Typography>
                    </Box>
                  </InfoItem>
                )}

                {userData.year && (
                  <InfoItem>
                    <School />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        YEAR OF STUDY
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {userData.year}
                      </Typography>
                    </Box>
                  </InfoItem>
                )}
              </>
            )}

            <Divider sx={{ my: 4 }} />

            <SectionTitle variant="h4">
              <Warning sx={{ fontSize: '2rem', mr: 2 }} />
              DANGER ZONE
            </SectionTitle>

            <Alert 
              severity="warning" 
              sx={{ 
                mb: 3,
                borderRadius: '16px',
                '& .MuiAlert-icon': {
                  fontSize: '1.5rem'
                }
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Account deletion is permanent and cannot be undone.
              </Typography>
            </Alert>

            <TextField
              label="Enter Your Password to Confirm"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Type your password to enable deletion"
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '16px',
                  '&:hover fieldset': {
                    borderColor: '#FF6B6B !important',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FF6B6B !important',
                  }
                }
              }}
            />

            {showWarning && (
              <Alert 
                severity="error" 
                sx={{ 
                  my: 2,
                  borderRadius: '16px',
                  '& .MuiAlert-icon': {
                    fontSize: '2rem',
                    alignItems: 'center'
                  }
                }}
                icon={<Warning fontSize="inherit" />}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    ⚠️ WARNING: Permanent Account Deletion
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    Deleting your account will permanently remove:
                  </Typography>
                  <ul style={{ margin: '8px 0 0 20px' }}>
                    <li>All your personal information and profile data</li>
                    <li>Your profile picture and uploaded content</li>
                    <li>Your saved preferences and roommate matches</li>
                    <li>Any property listings you've created</li>
                    <li>Your verification status and account history</li>
                    <li>All favorites and bookmarked items</li>
                  </ul>
                  <Typography variant="body1" sx={{ mt: 2, fontWeight: 700, color: '#d32f2f' }}>
                    🚨 This action cannot be undone. Your data will be permanently lost.
                  </Typography>
                </Box>
              </Alert>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
              {!showWarning ? (
                <DeleteButton
                  variant="contained"
                  startIcon={<DeleteForever />}
                  onClick={() => setShowWarning(true)}
                  disabled={!password}
                >
                  Delete Account
                </DeleteButton>
              ) : (
                <>
                  <Button 
                    variant="outlined" 
                    onClick={() => {
                      setShowWarning(false);
                      setPassword('');
                    }}
                    sx={{ 
                      mr: 2, 
                      borderRadius: '50px',
                      fontWeight: 600,
                      padding: '12px 30px',
                      borderColor: '#8338EC',
                      color: '#8338EC',
                      '&:hover': {
                        borderColor: '#5D2E8C',
                        backgroundColor: 'rgba(131, 56, 236, 0.05)'
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <DeleteButton
                    variant="contained"
                    startIcon={<DeleteForever />}
                    onClick={handleDelete}
                    disabled={!password}
                  >
                    Confirm Deletion
                  </DeleteButton>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </SettingsPaper>

      {/* Success/Error Messages */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%', borderRadius: '16px' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SettingsContainer>
  );
}