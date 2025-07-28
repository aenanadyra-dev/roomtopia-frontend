import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, Box, Avatar, Button, 
  TextField, Grid, Divider, Alert, Snackbar, IconButton,
  CircularProgress, Card, CardContent, LinearProgress,
  Chip, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import {
  Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon, Person as PersonIcon,
  Email as EmailIcon, Phone as PhoneIcon, School as SchoolIcon,
  LocationOn as LocationIcon, CalendarToday as CalendarIcon,
  VerifiedUser as VerifiedIcon, TrendingUp as ProgressIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled components matching your Settings.js aesthetic
const ProfileContainer = styled(Container)(({ theme }) => ({
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

const ProfilePaper = styled(Paper)(({ theme }) => ({
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

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 150,
  height: 150,
  margin: '0 auto',
  border: '4px solid #8338EC',
  boxShadow: '0 15px 40px rgba(131, 56, 236, 0.3)',
  background: 'linear-gradient(45deg, #8338EC, #3A86FF)',
  fontSize: '4rem',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 20px 50px rgba(131, 56, 236, 0.4)',
  }
}));

const UploadButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  borderRadius: '50px',
  padding: '12px 30px',
  fontWeight: 700,
  background: 'linear-gradient(45deg, #8338EC 0%, #3A86FF 100%)',
  boxShadow: '0 8px 25px rgba(131, 56, 236, 0.3)',
  '&:hover': {
    background: 'linear-gradient(45deg, #5D2E8C 0%, #8338EC 100%)',
    transform: 'translateY(-3px)',
    boxShadow: '0 15px 35px rgba(131, 56, 236, 0.4)',
  }
}));

const CompletionCard = styled(Card)(({ theme }) => ({
  borderRadius: '20px',
  background: 'linear-gradient(135deg, rgba(131, 56, 236, 0.1) 0%, rgba(58, 134, 255, 0.1) 100%)',
  border: '2px solid rgba(131, 56, 236, 0.2)',
  marginBottom: theme.spacing(4),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 40px rgba(131, 56, 236, 0.2)',
  }
}));

// UiTM Faculties - SYNCHRONIZED with PostRoommateRequest.js
const uitm_faculties = [
  "Faculty of Computer and Mathematical Sciences",
  "Faculty of Engineering",
  "Faculty of Architecture, Planning and Surveying",
  "Faculty of Applied Sciences",
  "Faculty of Built Environment",
  "Faculty of Communication and Media Studies",
  "Faculty of Administrative Science and Policy Studies",
  "Faculty of Law",
  "Academy of Language Studies",
];

export default function Profile({ userEmail, userProfile, onUpdateProfile }) {
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    university: 'UiTM Shah Alam',
    faculty: '',
    year: '',
    profilePicture: null,
    contactInfo: '',
    createdAt: null
  });
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Function to get auth token
  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  // Calculate profile completion percentage
  const calculateCompletionPercentage = () => {
    const fields = [
      profileData.fullName,
      profileData.email,
      profileData.phoneNumber,
      'UiTM Shah Alam', // University is always complete since it's fixed
      profileData.faculty,
      profileData.year,
      profileData.profilePicture
    ];

    const completedFields = fields.filter(field => field && field.toString().trim() !== '').length;
    return Math.round((completedFields / fields.length) * 100);
  };

  // Fetch user profile data
  const fetchUserProfile = async () => {
    const token = getAuthToken();
    
    // First check localStorage
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        setProfileData(prev => ({
          ...prev,
          ...parsedProfile,
          phoneNumber: parsedProfile.phoneNumber || parsedProfile.contactInfo || prev.phoneNumber,
          contactInfo: parsedProfile.contactInfo || parsedProfile.phoneNumber || prev.contactInfo
        }));
        setLoading(false);
        return;
      } catch (error) {
        console.error('Error parsing saved profile:', error);
      }
    }
    
    if (!token) {
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
          const userData = result.user || result.data || result;
          
          const newProfileData = {
            fullName: userData.fullName || '',
            email: userData.email || userEmail || '',
            phoneNumber: userData.phoneNumber || userData.contactInfo || '',
            university: userData.university || 'UiTM Shah Alam',
            faculty: userData.faculty || '',
            year: userData.year || '',
            profilePicture: userData.profilePicture || null,
            contactInfo: userData.contactInfo || userData.phoneNumber || '',
            createdAt: userData.createdAt || null
          };
          
          setProfileData(newProfileData);
          localStorage.setItem('userProfile', JSON.stringify(newProfileData));
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error(`Error fetching from ${endpoint}:`, error);
      }
    }
    
    // If all endpoints fail, use userProfile prop
    if (userProfile) {
      const newProfileData = {
        fullName: userProfile.fullName || '',
        email: userProfile.email || userEmail || '',
        phoneNumber: userProfile.phoneNumber || userProfile.contactInfo || '',
        university: userProfile.university || 'UiTM Shah Alam',
        faculty: userProfile.faculty || '',
        year: userProfile.year || '',
        profilePicture: userProfile.profilePicture || null,
        contactInfo: userProfile.contactInfo || userProfile.phoneNumber || '',
        createdAt: userProfile.createdAt || null
      };
      
      setProfileData(newProfileData);
      localStorage.setItem('userProfile', JSON.stringify(newProfileData));
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchUserProfile();
  }, [userEmail, userProfile]);

  // ✅ SYNC WITH LOCALSTORAGE CHANGES
  useEffect(() => {
    const handleStorageChange = () => {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        try {
          const parsedProfile = JSON.parse(savedProfile);
          setProfileData(prev => ({
            ...prev,
            ...parsedProfile,
            phoneNumber: parsedProfile.phoneNumber || parsedProfile.contactInfo || prev.phoneNumber,
            contactInfo: parsedProfile.contactInfo || parsedProfile.phoneNumber || prev.contactInfo
          }));
        } catch (error) {
          console.error('Error parsing profile from storage:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Handle profile picture upload
  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      formData.append('userEmail', userEmail || profileData.email);

      const response = await fetch('http://localhost:3001/api/users/upload-profile-picture', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        const updatedProfile = {
          ...profileData,
          profilePicture: data.profilePicture
        };
        
        setProfileData(updatedProfile);
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
        
        if (onUpdateProfile) {
          onUpdateProfile(updatedProfile);
        }
        
        setSnackbar({
          open: true,
          message: 'Profile picture updated successfully! 📸',
          severity: 'success'
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to upload profile picture: ' + error.message,
        severity: 'error'
      });
    } finally {
      setUploading(false);
    }
  };

  // Get profile picture URL
  const getProfilePictureUrl = () => {
    if (profileData.profilePicture) {
      if (profileData.profilePicture.startsWith('http')) {
        return profileData.profilePicture;
      }
      return `http://localhost:3001${profileData.profilePicture}`;
    }
    return null;
  };

  // ✅ FIXED HANDLE SAVE WITH FULL SYNC
  const handleSave = async () => {
    try {
      // Ensure contactInfo is synced with phoneNumber
      const updatedProfileData = {
        ...profileData,
        contactInfo: profileData.phoneNumber || profileData.contactInfo,
        phoneNumber: profileData.phoneNumber || profileData.contactInfo
      };

      const response = await fetch('http://localhost:3001/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail || profileData.email,
          ...updatedProfileData
        })
      });

      const data = await response.json();

      if (data.success) {
        // ✅ CRITICAL: Update localStorage immediately
        localStorage.setItem('userProfile', JSON.stringify(updatedProfileData));
        
        // ✅ CRITICAL: Update parent component via prop
        if (onUpdateProfile) {
          onUpdateProfile(updatedProfileData);
        }
        
        // ✅ CRITICAL: Update state
        setProfileData(updatedProfileData);
        
        setIsEditing(false);
        setSnackbar({
          open: true,
          message: 'Profile updated successfully! Data synced across all pages! ✨',
          severity: 'success'
        });
        
        console.log('✅ Profile saved and synced:', updatedProfileData);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update profile: ' + error.message,
        severity: 'error'
      });
    }
  };

  const completionPercentage = calculateCompletionPercentage();

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} thickness={4} sx={{ color: '#8338EC', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#64748B' }}>
            Loading your profile...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <ProfileContainer maxWidth="md">
      <SectionTitle variant="h3" gutterBottom>
        <PersonIcon sx={{ fontSize: '2.5rem' }} />
        MY PROFILE
      </SectionTitle>

      {/* Profile Completion Card */}
      <CompletionCard>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <ProgressIcon sx={{ fontSize: '2rem', color: '#8338EC', mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
              Profile Completion
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ width: '100%', mr: 1 }}>
              <LinearProgress 
                variant="determinate" 
                value={completionPercentage} 
                sx={{ 
                  height: 12, 
                  borderRadius: 6,
                  backgroundColor: 'rgba(131, 56, 236, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(45deg, #8338EC 0%, #3A86FF 100%)',
                    borderRadius: 6,
                  }
                }} 
              />
            </Box>
            <Box sx={{ minWidth: 35 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#8338EC' }}>
                {completionPercentage}%
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            {completionPercentage === 100 ? 
              '🎉 Your profile is complete!' : 
              `Complete your profile,now!`
            }
          </Typography>
        </CardContent>
      </CompletionCard>

      <ProfilePaper elevation={3}>
        <Grid container spacing={4}>
          {/* Profile Picture Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <ProfileAvatar
                src={getProfilePictureUrl()}
                alt={profileData.fullName}
              >
                {!getProfilePictureUrl() && (profileData.fullName ? 
                  profileData.fullName.charAt(0).toUpperCase() : '?')}
              </ProfileAvatar>
              
              <Typography variant="h5" sx={{ mt: 2, mb: 1, fontWeight: 700, textAlign: 'center' }}>
                {profileData.fullName || 'Your Name'}
              </Typography>
              
              <Typography variant="body1" sx={{ color: '#64748b', mb: 2, textAlign: 'center' }}>
                {profileData.email}
              </Typography>

              {profileData.createdAt && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  mb: 3,
                  p: '8px 16px',
                  borderRadius: '50px',
                  background: 'rgba(128, 237, 153, 0.2)',
                  color: '#1B5E20'
                }}>
                  <VerifiedIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Member since {new Date(profileData.createdAt).getFullYear()}
                  </Typography>
                </Box>
              )}

              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="profile-picture-upload"
                type="file"
                onChange={handleProfilePictureUpload}
              />
              <label htmlFor="profile-picture-upload">
                <UploadButton
                  variant="contained"
                  component="span"
                  startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <PhotoCameraIcon />}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Change Picture'}
                </UploadButton>
              </label>
            </Box>
          </Grid>

          {/* Profile Information Section */}
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <SectionTitle variant="h4">
                PROFILE INFORMATION
              </SectionTitle>
              <Button
                variant={isEditing ? "outlined" : "contained"}
                startIcon={isEditing ? <CancelIcon /> : <EditIcon />}
                onClick={() => setIsEditing(!isEditing)}
                sx={{ 
                  borderRadius: '50px',
                  padding: '12px 30px',
                  fontWeight: 700,
                  ...(isEditing ? {
                    borderColor: '#8338EC',
                    color: '#8338EC'
                  } : {
                    background: 'linear-gradient(45deg, #8338EC 0%, #3A86FF 100%)',
                    boxShadow: '0 8px 25px rgba(131, 56, 236, 0.3)',
                  })
                }}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <PersonIcon sx={{ mr: 1, color: '#8338EC' }} />,
                    sx: { borderRadius: '16px' }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={profileData.email}
                  disabled
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1, color: '#64748b' }} />,
                    sx: { borderRadius: '16px' }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={profileData.phoneNumber}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setProfileData({
                      ...profileData, 
                      phoneNumber: newValue,
                      contactInfo: newValue  // ✅ Keep both synced
                    });
                  }}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <PhoneIcon sx={{ mr: 1, color: '#8338EC' }} />,
                    sx: { borderRadius: '16px' }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="University"
                  value="UiTM Shah Alam"
                  disabled={true}
                  InputProps={{
                    startAdornment: <SchoolIcon sx={{ mr: 1, color: '#64748b' }} />,
                    sx: { borderRadius: '16px' }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth disabled={!isEditing}>
                  <InputLabel>Faculty</InputLabel>
                  <Select
                    value={profileData.faculty}
                    onChange={(e) => setProfileData({...profileData, faculty: e.target.value})}
                    sx={{ borderRadius: '16px' }}
                  >
                    {uitm_faculties.map((faculty) => (
                      <MenuItem key={faculty} value={faculty}>
                        {faculty}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth disabled={!isEditing}>
                  <InputLabel>Year of Study</InputLabel>
                  <Select
                    value={profileData.year}
                    onChange={(e) => setProfileData({...profileData, year: e.target.value})}
                    sx={{ borderRadius: '16px' }}
                  >
                    <MenuItem value="1st Year">1st Year</MenuItem>
                    <MenuItem value="2nd Year">2nd Year</MenuItem>
                    <MenuItem value="3rd Year">3rd Year</MenuItem>
                    <MenuItem value="4th Year">4th Year</MenuItem>
                    <MenuItem value="Graduate">Graduate</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {isEditing && (
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  sx={{
                    borderRadius: '50px',
                    padding: '15px 40px',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #4caf50 0%, #45a049 100%)',
                    boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #45a049 0%, #3d8b40 100%)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 15px 35px rgba(76, 175, 80, 0.4)',
                    }
                  }}
                >
                  Save Changes
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </ProfilePaper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ borderRadius: '16px' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ProfileContainer>
  );
}