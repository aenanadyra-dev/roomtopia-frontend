import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Grid, Card, CardContent, TextField,
  Button, Chip, CircularProgress, Alert, FormControl, 
  InputLabel, Select, MenuItem, Avatar, Skeleton,
  Divider, Modal, IconButton, Badge, Fab, Drawer,
  List, ListItem, ListItemAvatar, ListItemText, ListItemSecondaryAction,
  Snackbar, Tooltip, LinearProgress, Paper, Dialog, DialogTitle,
  DialogContent, DialogActions, DialogContentText, Collapse
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Close as CloseIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  AutoAwesome as AIIcon,
  Info as InfoIcon,
  People as PeopleIcon,
  Groups as GroupsIcon,
  School as SchoolIcon,
  Smoking as SmokingIcon,
  SmokeFree as NoSmokingIcon,
  Edit as EditIcon,
  Analytics as AnalyticsIcon,
  Add as AddIcon,
  Update as UpdateIcon,
  Warning as WarningIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: `
    linear-gradient(135deg, 
      rgba(110, 142, 251, 0.1) 0%, 
      rgba(167, 119, 227, 0.1) 25%, 
      rgba(58, 134, 255, 0.1) 50%, 
      rgba(128, 237, 153, 0.1) 75%, 
      rgba(255, 217, 59, 0.1) 100%
    ),
    linear-gradient(45deg, #f8fafc 0%, #f1f5f9 25%, #e2e8f0 50%, #cbd5e1 75%, #94a3b8 100%)
  `,
  padding: theme.spacing(4),
  paddingTop: theme.spacing(12),
}));

const RoommateCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  borderRadius: '20px',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
  },
}));

const CollapsibleSectionHeader = styled(Box)(({ theme, isExpanded }) => ({
  background: 'linear-gradient(135deg, #e91e63 0%, #f06292 100%)',
  borderRadius: isExpanded ? '16px 16px 0 0' : '16px',
  padding: theme.spacing(3),
  marginBottom: isExpanded ? 0 : theme.spacing(3),
  color: 'white',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 40px rgba(233, 30, 99, 0.2)',
  }
}));

// ✅ TRACKING FUNCTIONS
const trackRoommateSearch = async (searchData) => {
  try {
    await fetch('http://localhost:3001/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'roommate_search',
        data: {
          location: searchData.location || 'Any',
          roommateGender: searchData.gender || 'Any',
          roommateAge: `${searchData.minAge}-${searchData.maxAge}`,
          studyHabits: searchData.studyHabits || 'Any',
          cleanliness: searchData.cleanliness || 'Any',
          socialLevel: searchData.socialLevel || 'Any',
          smokingPreference: searchData.smokingPreference || 'Any',
          searchType: searchData.searchName ? 'name_search' : 'filter_search',
          hasAICriteria: !!(searchData.gender || searchData.religion || searchData.studyHabits || 
                          searchData.cleanliness || searchData.socialLevel || searchData.smokingPreference),
          filtersUsed: Object.values(searchData).filter(value => 
            value !== '' && value !== null && value !== 18 && value !== 30
          ).length
        }
      })
    });
  } catch (error) {
    console.log('Analytics tracking failed:', error);
  }
};

const trackLocationSearch = async (location) => {
  try {
    await fetch('http://localhost:3001/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'location_search',
        data: {
          location: location,
          searchContext: 'roommate_search'
        }
      })
    });
  } catch (error) {
    console.log('Analytics tracking failed:', error);
  }
};

// ✅ TRACK ROOMMATE PREFERENCE SELECTIONS
const trackRoommatePreference = async (field, value) => {
  if (!value || value === '') return;
  
  try {
    await fetch('http://localhost:3001/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'roommate_preference',
        data: {
          preferenceType: field,
          gender: field === 'gender' ? value : undefined,
          religion: field === 'religion' ? value : undefined,
          studyHabits: field === 'studyHabits' ? value : undefined,
          cleanliness: field === 'cleanliness' ? value : undefined,
          socialLevel: field === 'socialLevel' ? value : undefined,
          smokingPreference: field === 'smokingPreference' ? value : undefined
        }
      })
    });
    console.log(`✅ Tracked preference: ${field} = ${value}`);
  } catch (error) {
    console.log('Analytics tracking failed:', error);
  }
};

const trackRoommateView = async (roommate) => {
  try {
    await fetch('http://localhost:3001/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'roommate_view',
        data: {
          roommateId: roommate._id,
          roommateAge: roommate.age,
          roommateGender: roommate.gender,
          university: roommate.university,
          aiMatchPercentage: roommate.aiMatchPercentage || null,
          viewSource: 'search_results'
        }
      })
    });
  } catch (error) {
    console.log('Analytics tracking failed:', error);
  }
};

const CollapsibleContent = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(233, 30, 99, 0.02) 0%, rgba(240, 98, 146, 0.02) 100%)',
  borderRadius: '0 0 16px 16px',
  border: '2px solid rgba(233, 30, 99, 0.1)',
  borderTop: 'none',
  marginBottom: theme.spacing(3),
  overflow: 'hidden'
}));

const SectionHeader = styled(Box)(({ theme, isOwner }) => ({
  background: isOwner 
    ? 'linear-gradient(135deg, #e91e63 0%, #f06292 100%)'
    : 'linear-gradient(135deg, #6e8efb 0%, #a777e3 100%)',
  borderRadius: '16px',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  color: 'white',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
}));

const PremiumMatchBar = styled(Box)(({ matchPercent }) => {
  const getGradient = () => {
    if (matchPercent >= 80) return 'linear-gradient(90deg, #4caf50 0%, #8bc34a 100%)';
    if (matchPercent >= 60) return 'linear-gradient(90deg, #ff9800 0%, #ffc107 100%)';
    return 'linear-gradient(90deg, #f44336 0%, #e91e63 100%)';
  };

  return {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
    zIndex: 10,
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: `${matchPercent}%`,
      background: getGradient(),
      transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: matchPercent >= 80 ? '0 0 10px rgba(76, 175, 80, 0.5)' : 
                 matchPercent >= 60 ? '0 0 10px rgba(255, 152, 0, 0.5)' :
                 '0 0 10px rgba(244, 67, 54, 0.5)'
    }
  };
});

const AnimatedPercentage = ({ targetPercent, matchPercent }) => {
  const [displayPercent, setDisplayPercent] = useState(0);

  useEffect(() => {
    if (targetPercent > 0) {
      let startTime = null;
      const duration = 1500;

      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(easeOutCubic * targetPercent);
        
        setDisplayPercent(current);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [targetPercent]);

  const getTextColor = () => {
    if (matchPercent >= 80) return '#4caf50';
    if (matchPercent >= 60) return '#ff9800';
    return '#f44336';
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 12,
        right: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '6px 12px',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        zIndex: 15,
        minWidth: '80px',
        justifyContent: 'center'
      }}
    >
      <AIIcon sx={{ fontSize: '0.9rem', color: getTextColor() }} />
      <Typography
        variant="caption"
        sx={{
          fontWeight: 700,
          fontSize: '0.8rem',
          color: getTextColor(),
          fontFamily: '"Poppins", sans-serif',
          letterSpacing: '0.5px'
        }}
      >
        {displayPercent}%
      </Typography>
    </Box>
  );
};

const AIExplanationCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  background: 'linear-gradient(135deg, rgba(110, 142, 251, 0.08) 0%, rgba(167, 119, 227, 0.08) 100%)',
  border: '2px solid rgba(110, 142, 251, 0.2)',
  marginBottom: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(110, 142, 251, 0.1)'
}));

const FavoritesFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  background: 'linear-gradient(135deg, #e91e63 0%, #f06292 100%)',
  color: 'white',
  zIndex: 1000,
  width: 70,
  height: 70,
  '&:hover': {
    background: 'linear-gradient(135deg, #c2185b 0%, #e91e63 100%)',
    transform: 'scale(1.1)',
  },
  boxShadow: '0 8px 25px rgba(233, 30, 99, 0.4)',
  transition: 'all 0.3s ease',
}));

const FavoritesButton = ({ roommateId, initialFavorite = false, onToggle }) => {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  useEffect(() => {
    setIsFavorite(initialFavorite);
  }, [initialFavorite]);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    
    if (onToggle) {
      onToggle(roommateId, newFavoriteState);
    }
  };

  return (
    <div
      onClick={handleToggle}
      style={{
        position: 'absolute',
        top: '54px',
        right: '12px',
        width: '48px',
        height: '48px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 999,
        border: '2px solid rgba(255, 255, 255, 0.8)',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.15)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }}
    >
      {isFavorite ? (
        <FavoriteIcon sx={{ fontSize: '1.5rem', color: '#e91e63' }} />
      ) : (
        <FavoriteBorderIcon sx={{ fontSize: '1.5rem', color: '#666' }} />
      )}
    </div>
  );
};

const ExpandableDescription = ({ description, maxLength = 150 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!description) return null;
  
  const shouldTruncate = description.length > maxLength;
  const displayText = isExpanded ? description : description.substring(0, maxLength);
  
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" sx={{ 
        lineHeight: 1.6,
        whiteSpace: 'pre-line',
        color: '#475569'
      }}>
        {displayText}
        {!isExpanded && shouldTruncate && '...'}
      </Typography>
      {shouldTruncate && (
        <Button
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          sx={{ 
            mt: 1,
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#6e8efb',
            textTransform: 'none',
            p: 0,
            minWidth: 'auto',
            '&:hover': {
              backgroundColor: 'transparent',
              textDecoration: 'underline'
            }
          }}
        >
          {isExpanded ? 'Show Less' : 'Read More'}
        </Button>
      )}
    </Box>
  );
};

const FavoritesDrawer = ({ open, onClose, favorites, onRemove, onViewRoommate }) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 400 },
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        }
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #e91e63 0%, #f06292 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'flex',
            alignItems: 'center'
          }}>
            <FavoriteIcon sx={{ mr: 1, color: '#e91e63' }} />
            My Favorites
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography variant="body2" sx={{ mb: 3, color: '#64748b' }}>
          {favorites.length} {favorites.length === 1 ? 'roommate' : 'roommates'} saved
        </Typography>

        {favorites.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 6,
            color: '#64748b'
          }}>
            <FavoriteIcon sx={{ fontSize: 48, mb: 2, opacity: 0.3 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              No Favorites Yet
            </Typography>
            <Typography variant="body2">
              Start adding potential roommates to your favorites!
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {favorites.map((roommate) => (
              <ListItem
                key={roommate._id}
                sx={{
                  mb: 2,
                  p: 2,
                  bgcolor: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '12px',
                      bgcolor: '#e91e63'
                    }}
                  >
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" sx={{ 
                      fontWeight: 600,
                      mb: 0.5,
                      color: '#1e293b'
                    }}>
                      {roommate.name}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5 }}>
                        🎓 {roommate.faculty || 'Faculty not specified'} • {roommate.gender || 'Gender not specified'} • {roommate.religion || 'Religion not specified'}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: '#e91e63', 
                        fontWeight: 600
                      }}>
                        {roommate.age} years old
                      </Typography>
                    </Box>
                  }
                />
                
                <ListItemSecondaryAction>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <IconButton
                      onClick={() => onViewRoommate(roommate)}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(110, 142, 251, 0.1)',
                        color: '#6e8efb',
                        '&:hover': {
                          bgcolor: 'rgba(110, 142, 251, 0.2)'
                        }
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => onRemove(roommate._id)}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        '&:hover': {
                          bgcolor: 'rgba(239, 68, 68, 0.2)'
                        }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Drawer>
  );
};

const RoommateDetailsModal = ({ open, onClose, roommate }) => {
  if (!roommate) return null;

  return (
    <Modal 
      open={open} 
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Box sx={{
        position: 'relative',
        maxWidth: '90vw',
        maxHeight: '90vh',
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: '20px',
        overflow: 'hidden',
        outline: 'none'
      }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 3,
            color: 'white',
            bgcolor: 'rgba(0,0,0,0.6)',
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.8)'
            }
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{ maxHeight: '90vh', overflow: 'auto' }}>
          <Box sx={{
            background: 'linear-gradient(135deg, #6e8efb 0%, #a777e3 100%)',
            color: 'white',
            p: 4
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                src={roommate.profilePicture ? `http://localhost:3001${roommate.profilePicture}` : undefined}
                sx={{
                  width: 80,
                  height: 80,
                  mr: 3,
                  border: '3px solid rgba(255,255,255,0.3)'
                }}
              >
                {!roommate.profilePicture && (
                  roommate.name ? roommate.name.charAt(0).toUpperCase() : '?'
                )}
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {roommate.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PersonIcon sx={{ fontSize: '1.2rem', mr: 1 }} />
                  <Typography variant="h6">
                    {roommate.age} years old • {roommate.gender} • {roommate.religion || 'Religion not specified'}
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {roommate.university} - {roommate.faculty}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ p: 4 }}>
            {roommate.aboutMe?.description && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  📝 About Me
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.7, color: '#475569' }}>
                  {roommate.aboutMe.description}
                </Typography>
              </Box>
            )}

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#4caf50' }}>
                🏡 My Lifestyle
              </Typography>
              <Grid container spacing={2}>
                {roommate.aboutMe?.studyHabits && (
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#4caf50' }}>
                      Study Habits:
                    </Typography>
                    <Typography variant="body1">
                      {roommate.aboutMe.studyHabits}
                    </Typography>
                  </Grid>
                )}
                {roommate.aboutMe?.cleanliness && (
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#4caf50' }}>
                      Cleanliness:
                    </Typography>
                    <Typography variant="body1">
                      {roommate.aboutMe.cleanliness}
                    </Typography>
                  </Grid>
                )}
                {roommate.aboutMe?.socialLevel && (
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#4caf50' }}>
                      Social Level:
                    </Typography>
                    <Typography variant="body1">
                      {roommate.aboutMe.socialLevel}
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#4caf50' }}>
                    Smoking:
                  </Typography>
                  <Typography variant="body1">
                    {roommate.aboutMe?.smoker ? 'Smoker' : 'Non-Smoker'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            {roommate.preferences && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#e91e63' }}>
                  🎯 What I'm Looking For in a Roommate
                </Typography>
                <Grid container spacing={2}>
                  {roommate.preferences.gender && (
                    <Grid item xs={6} md={3}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#e91e63' }}>
                        Gender:
                      </Typography>
                      <Typography variant="body1">
                        {roommate.preferences.gender}
                      </Typography>
                    </Grid>
                  )}
                  {roommate.preferences.religion && (
                    <Grid item xs={6} md={3}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#e91e63' }}>
                        Religion:
                      </Typography>
                      <Typography variant="body1">
                        {roommate.preferences.religion}
                      </Typography>
                    </Grid>
                  )}
                  {roommate.preferences.cleanliness && (
                    <Grid item xs={6} md={3}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#e91e63' }}>
                        Cleanliness:
                      </Typography>
                      <Typography variant="body1">
                        {roommate.preferences.cleanliness}
                      </Typography>
                    </Grid>
                  )}
                  {roommate.preferences.socialLevel && (
                    <Grid item xs={6} md={3}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#e91e63' }}>
                        Social Level:
                      </Typography>
                      <Typography variant="body1">
                        {roommate.preferences.socialLevel}
                      </Typography>
                    </Grid>
                  )}
                  {roommate.preferences.studyHabits && (
                    <Grid item xs={6} md={3}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#e91e63' }}>
                        Study Habits:
                      </Typography>
                      <Typography variant="body1">
                        {roommate.preferences.studyHabits}
                      </Typography>
                    </Grid>
                  )}
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#e91e63' }}>
                      Smoking:
                    </Typography>
                    <Typography variant="body1">
                      {roommate.preferences.smoker ? 'Accepts Smokers' : 'Non-Smoker Only'}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}

            {roommate.interests && roommate.interests.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#ff9800' }}>
                  🎯 Interests & Hobbies
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {roommate.interests.map((interest, index) => (
                    <Chip
                      key={index}
                      label={interest}
                      sx={{
                        bgcolor: 'rgba(255, 152, 0, 0.1)',
                        color: '#ff9800'
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

  

{roommate.contact && (
  <Alert severity="info" icon={false} sx={{ mb: 3 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography variant="body1">
        <strong>📞 Contact:</strong> {roommate.contact}
      </Typography>
      <Tooltip 
        title="Platform provides contact sharing only. Users are responsible for their own communications and safety. Use caution when sharing personal information."
        arrow
        placement="top"
        sx={{
          '& .MuiTooltip-tooltip': {
            maxWidth: 250,
            fontSize: '0.75rem',
            padding: '8px 12px'
          }
        }}
      >
        <InfoIcon 
          sx={{ 
            fontSize: '1.2rem', 
            color: '#64748b', 
            cursor: 'help',
            '&:hover': {
              color: '#3b82f6'
            }
          }} 
        />
      </Tooltip>
    </Box>
  </Alert>
)}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default function FindRoomie({ userEmail: propUserEmail, userProfile }) {
  const [roommates, setRoommates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [myRequestExpanded, setMyRequestExpanded] = useState(() => {
    const saved = localStorage.getItem('myRequestExpanded');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const [filters, setFilters] = useState({
    searchName: '',
    gender: '',
    religion: '',
    minAge: 18,
    maxAge: 30,
    studyHabits: '',
    cleanliness: '',
    socialLevel: '',
    smokingPreference: ''
  });
  
  const [selectedRoommate, setSelectedRoommate] = useState(null);
  const [roommateDetailsOpen, setRoommateDetailsOpen] = useState(false);
  const [aiMatching, setAiMatching] = useState(false);
  const [showAIExplanation, setShowAIExplanation] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roommateToDelete, setRoommateToDelete] = useState(null);

  const navigate = useNavigate();
  const userEmail = propUserEmail || localStorage.getItem('userEmail');
  
  const toggleMyRequestExpanded = () => {
    const newExpanded = !myRequestExpanded;
    setMyRequestExpanded(newExpanded);
    localStorage.setItem('myRequestExpanded', JSON.stringify(newExpanded));
  };
  
  const handleEdit = (roommate) => {
    console.log('🔧 Editing roommate request:', roommate._id);
    navigate('/post-roommate', { state: { editData: roommate } });
  };

  const handleDeleteRoommate = async (roommateId) => {
    if (!userEmail) {
      setSnackbar({
        open: true,
        message: 'User email not available. Please log in again.',
        severity: 'error'
      });
      return;
    }
    
    try {
      await axios.delete(`http://localhost:3001/api/roommate-requests/${roommateId}`, {
        data: { userEmail }
      });
      
      setSnackbar({ 
        open: true, 
        message: 'Roommate request deleted successfully! 🎉', 
        severity: 'success' 
      });
      
      setRoommates(roommates.filter(roommate => roommate._id !== roommateId));
      setDeleteDialogOpen(false);
      setRoommateToDelete(null);
      
    } catch (error) {
      console.error('Delete error:', error);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.error || 'Failed to delete roommate request', 
        severity: 'error' 
      });
    }
  };

  const loadFavorites = () => {
    if (!userEmail) return;
    const userSpecificKey = `roommateFavorites_${userEmail}`;
    const savedFavorites = localStorage.getItem(userSpecificKey);

    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    } else {
      // ✅ MIGRATION: Check for old global favorites and migrate them
      const oldGlobalFavorites = localStorage.getItem('roommateFavorites');
      if (oldGlobalFavorites) {
        const parsedOldFavorites = JSON.parse(oldGlobalFavorites);
        setFavorites(parsedOldFavorites);
        localStorage.setItem(userSpecificKey, oldGlobalFavorites);
        localStorage.removeItem('roommateFavorites'); // Clean up old global key
        console.log('✅ Migrated roommate favorites to user-specific storage');
      }
    }
  };

  const saveFavorites = (newFavorites) => {
    if (!userEmail) return;
    setFavorites(newFavorites);
    const userSpecificKey = `roommateFavorites_${userEmail}`;
    localStorage.setItem(userSpecificKey, JSON.stringify(newFavorites));
  };

  const toggleFavorite = (roommateId, isFavorite) => {
    const roommate = roommates.find(r => r._id === roommateId);
    if (!roommate) return;

    let newFavorites;
    if (isFavorite) {
      newFavorites = [...favorites, roommate];
      setSnackbar({
        open: true,
        message: 'Added to favorites! 💖',
        severity: 'success'
      });
    } else {
      newFavorites = favorites.filter(fav => fav._id !== roommateId);
      setSnackbar({
        open: true,
        message: 'Removed from favorites',
        severity: 'info'
      });
    }
    
    saveFavorites(newFavorites);
  };

  const isFavorited = (roommateId) => {
    return favorites.some(fav => fav._id === roommateId);
  };

  const fetchRoommates = async () => {
    try {
      setLoading(true);

      const response = await axios.get('http://localhost:3001/api/roommate-requests');

      if (response.data.success) {
        setRoommates(response.data.data);
      } else {
        setRoommates([]);
      }
    } catch (error) {
      console.error('Network error:', error);
      setSnackbar({
        open: true,
        message: 'Error fetching roommate requests',
        severity: 'error'
      });
      setRoommates([]);
    } finally {
      setLoading(false);
    }
  };



  const myRequest = roommates.filter(roommate => roommate.userEmail === userEmail);
  const otherRequests = roommates.filter(roommate => roommate.userEmail !== userEmail);

  const nameFilteredRequests = otherRequests.filter(roommate => {
    if (filters.searchName) {
      const searchTerm = filters.searchName.toLowerCase();
      return roommate.name?.toLowerCase().includes(searchTerm) ||
             roommate.faculty?.toLowerCase().includes(searchTerm);
    }
    return true;
  });

  const filteredOtherRequests = filters.searchName ? nameFilteredRequests :
    otherRequests.filter(roommate => {
      return (
        (!filters.gender || filters.gender === 'Any Gender' || roommate.gender === filters.gender) &&
        (!filters.religion || filters.religion === 'Any Religion' || roommate.religion === filters.religion) &&
        (roommate.age >= filters.minAge && roommate.age <= filters.maxAge) &&
        (!filters.studyHabits || filters.studyHabits === 'Any Study Style' || roommate.aboutMe?.studyHabits === filters.studyHabits) &&
        (!filters.cleanliness || filters.cleanliness === 'Any Level' || roommate.aboutMe?.cleanliness === filters.cleanliness) &&
        (!filters.socialLevel || filters.socialLevel === 'Any Social Style' || roommate.aboutMe?.socialLevel === filters.socialLevel) &&
        (!filters.smokingPreference || filters.smokingPreference === 'Any Preference' ||
          (filters.smokingPreference === 'Non-Smoker' && !roommate.aboutMe?.smoker) ||
          (filters.smokingPreference === 'Smoker' && roommate.aboutMe?.smoker))
      );
    });

  const filteredMyRequest = myRequest.filter(roommate => {
    return (
      (roommate.age >= filters.minAge && roommate.age <= filters.maxAge)
    );
  });

  // 🤖 AI MATCHING: Determine what to display
  // If AI matching has been performed (posts have aiMatchPercentage), show all AI results
  // Otherwise, use regular filtering
  const hasAIResults = otherRequests.some(roommate => roommate.aiMatchPercentage);
  const displayRequests = hasAIResults ? otherRequests : filteredOtherRequests;

  const calculateRoommateCompatibility = (roommate) => {
    let score = 0;
    let matchReasons = [];
    let differentReasons = [];

    // 🎯 PRIORITY SYSTEM: Gender compatibility (25 points max)
    if (filters.gender && filters.gender !== 'Any Gender') {
      if (roommate.gender === filters.gender) {
        score += 25; // Perfect match - same gender
        matchReasons.push(`Same gender (${roommate.gender})`);
      } else {
        score += 5; // Different gender - low priority
        differentReasons.push(`Different gender (${roommate.gender})`);
      }
    } else {
      score += 15; // No gender preference set
      matchReasons.push('No gender preference');
    }

    // Religion compatibility (15 points max)
    if (filters.religion && filters.religion !== 'Any Religion') {
      if (roommate.religion === filters.religion) {
        score += 15; // Perfect match
        matchReasons.push(`Same religion (${roommate.religion})`);
      } else {
        score += 3; // Different religion but still show with low score
        differentReasons.push(`Different religion (${roommate.religion || 'Not specified'})`);
      }
    } else {
      score += 10; // No preference set
      matchReasons.push('No religion preference');
    }

    // Study habits compatibility (15 points max)
    if (filters.studyHabits && filters.studyHabits !== 'Any Study Style' && roommate.aboutMe?.studyHabits) {
      if (roommate.aboutMe.studyHabits === filters.studyHabits) {
        score += 15; // Perfect match
        matchReasons.push(`Same study style (${roommate.aboutMe.studyHabits})`);
      } else if (roommate.aboutMe.studyHabits === 'Flexible' || filters.studyHabits === 'Flexible') {
        score += 10; // Flexible compatibility
        matchReasons.push('Flexible study style');
      } else {
        score += 5; // Different but still compatible
        differentReasons.push(`Different study style (${roommate.aboutMe.studyHabits})`);
      }
    } else {
      score += 8; // Missing data or no preference
      if (!roommate.aboutMe?.studyHabits) matchReasons.push('Study style not specified');
      else matchReasons.push('No study style preference');
    }

    // Cleanliness compatibility (15 points max)
    if (filters.cleanliness && filters.cleanliness !== 'Any Level' && roommate.aboutMe?.cleanliness) {
      if (roommate.aboutMe.cleanliness === filters.cleanliness) {
        score += 15; // Perfect match
        matchReasons.push(`Same cleanliness (${roommate.aboutMe.cleanliness})`);
      } else {
        const cleanlinessLevels = ['Relaxed', 'Moderate', 'Very Clean'];
        const userLevel = cleanlinessLevels.indexOf(filters.cleanliness);
        const roommateLevel = cleanlinessLevels.indexOf(roommate.aboutMe.cleanliness);
        const difference = Math.abs(userLevel - roommateLevel);
        const points = Math.max(3, 15 - difference * 5);
        score += points;
        if (points > 8) matchReasons.push(`Similar cleanliness (${roommate.aboutMe.cleanliness})`);
        else differentReasons.push(`Different cleanliness (${roommate.aboutMe.cleanliness})`);
      }
    } else {
      score += 8; // Missing data or no preference
      if (!roommate.aboutMe?.cleanliness) matchReasons.push('Cleanliness not specified');
      else matchReasons.push('No cleanliness preference');
    }

    // Social level compatibility (15 points max)
    if (filters.socialLevel && filters.socialLevel !== 'Any Social Style' && roommate.aboutMe?.socialLevel) {
      if (roommate.aboutMe.socialLevel === filters.socialLevel) {
        score += 15; // Perfect match
        matchReasons.push(`Same social style (${roommate.aboutMe.socialLevel})`);
      } else if (roommate.aboutMe.socialLevel === 'Balanced' || filters.socialLevel === 'Balanced') {
        score += 10; // Balanced compatibility
        matchReasons.push('Balanced social style');
      } else {
        score += 5; // Different but still compatible
        differentReasons.push(`Different social style (${roommate.aboutMe.socialLevel})`);
      }
    } else {
      score += 8; // Missing data or no preference
      if (!roommate.aboutMe?.socialLevel) matchReasons.push('Social style not specified');
      else matchReasons.push('No social style preference');
    }

    // Smoking preference compatibility (10 points max)
    if (filters.smokingPreference && filters.smokingPreference !== 'Any Preference') {
      const userSmoker = filters.smokingPreference === 'Smoker';
      const roommateSmoker = roommate.aboutMe?.smoker;
      if (userSmoker === roommateSmoker) {
        score += 10; // Perfect match
        matchReasons.push(`Same smoking preference (${filters.smokingPreference})`);
      } else {
        score += 3; // Different preference but still compatible
        differentReasons.push(`Different smoking preference`);
      }
    } else {
      score += 5; // No preference set
      matchReasons.push('No smoking preference');
    }

    const userMinAge = filters.minAge;
    const userMaxAge = filters.maxAge;
    const roommateAge = roommate.age || 25;
    
    if (roommateAge >= userMinAge && roommateAge <= userMaxAge) {
      score += 10;
    } else {
      const ageDiff = Math.min(
        Math.abs(roommateAge - userMinAge),
        Math.abs(roommateAge - userMaxAge)
      );
      score += Math.max(0, 10 - ageDiff);
    }

    const finalScore = Math.round(Math.min(score, 100));

    // Create simple tooltip explanation
    let tooltip = '';
    if (matchReasons.length > 0) {
      tooltip += `✅ Matches: ${matchReasons.slice(0, 2).join(', ')}`;
    }
    if (differentReasons.length > 0) {
      if (tooltip) tooltip += ' | ';
      tooltip += `❌ Different: ${differentReasons.slice(0, 2).join(', ')}`;
    }

    return { score: finalScore, tooltip };
  };

  const handleSearch = async () => {
    await trackRoommateSearch(filters);

    if (filters.searchName) {
      setSnackbar({ 
        open: true, 
        message: `Found ${nameFilteredRequests.length} roommates matching "${filters.searchName}"`, 
        severity: 'info' 
      });
      return;
    }

    const hasAICriteria = filters.gender || filters.religion || filters.studyHabits || 
                         filters.cleanliness || filters.socialLevel || filters.smokingPreference;
    
    if (hasAICriteria) {
      setAiMatching(true);
      
      try {
        // 🚀 AI MATCHING: Show ALL posts with compatibility scores
        // No filtering - let the AI scoring system handle everything
        const aiFilteredRequests = otherRequests;

        const matchedRoommates = aiFilteredRequests.map(roommate => {
          const compatibility = calculateRoommateCompatibility(roommate);
          return {
            ...roommate,
            aiMatchPercentage: compatibility.score,
            aiTooltip: compatibility.tooltip
          };
        });

        matchedRoommates.sort((a, b) => (b.aiMatchPercentage || 0) - (a.aiMatchPercentage || 0));
        
        const updatedRoommates = [
          ...myRequest,
          ...matchedRoommates
        ];
        setRoommates(updatedRoommates);
        
        setSnackbar({
          open: true,
          message: `🤖 AI analyzed ${matchedRoommates.length} roommates! Showing all with compatibility scores.`,
          severity: 'success'
        });
        
        setShowAIExplanation(true);
      } catch (error) {
        console.error('Smart search error:', error);
        setSnackbar({ 
          open: true, 
          message: 'Search completed with basic filtering', 
          severity: 'info' 
        });
      } finally {
        setAiMatching(false);
      }
    } else {
      setSnackbar({ 
        open: true, 
        message: `Found ${filteredMyRequest.length + filteredOtherRequests.length} roommate requests matching your criteria`, 
        severity: 'info' 
      });
    }
  };

  const handleViewRoommateDetails = (roommate) => {
    trackRoommateView(roommate);
    setSelectedRoommate(roommate);
    setRoommateDetailsOpen(true);
  };

  const handleRemoveFromFavorites = (roommateId) => {
    const newFavorites = favorites.filter(fav => fav._id !== roommateId);
    saveFavorites(newFavorites);
    
    setSnackbar({
      open: true,
      message: 'Removed from favorites',
      severity: 'info'
    });
  };

  const handleViewRoommateFromDrawer = (roommate) => {
    setSelectedRoommate(roommate);
    setRoommateDetailsOpen(true);
    setFavoritesOpen(false);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));

    // ✅ TRACK ROOMMATE PREFERENCE SELECTIONS
    trackRoommatePreference(field, value);

    if (field === 'location' && value && value.length > 2) {
      trackLocationSearch(value);
    }
  };

  const handleRefresh = () => {
    fetchRoommates();
    loadFavorites();
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      value !== '' && value !== null && value !== 18 && value !== 30 &&
      (Array.isArray(value) ? value.length > 0 : true)
    ).length;
  };

  const userFavorites = favorites.map(fav => fav._id);

  useEffect(() => {
    fetchRoommates();
  }, []);

  // ✅ LOAD USER-SPECIFIC FAVORITES WHEN USER EMAIL IS AVAILABLE
  useEffect(() => {
    if (userEmail) {
      loadFavorites();
    }
  }, [userEmail]);

  return (
    <PageContainer>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h2" sx={{ 
          fontWeight: 800,
          background: 'linear-gradient(135deg, #6e8efb 0%, #a777e3 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 2
        }}>
          👥 Find Your Perfect Roommate
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 3 }}>
          Connect with compatible roommates using our AI-powered matching system
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          <Chip 
            label={`${myRequest.length + otherRequests.length} total requests`} 
            color="primary" 
            sx={{ fontSize: '1rem', py: 1, px: 2 }}
          />
          <Chip 
            label={`${myRequest.length} your request`} 
            color="secondary" 
            sx={{ fontSize: '1rem', py: 1, px: 2 }}
          />
          {favorites.length > 0 && (
            <Chip 
              icon={<FavoriteIcon />}
              label={`${favorites.length} favorites`} 
              sx={{ 
                fontSize: '1rem', 
                py: 1, 
                px: 2,
                bgcolor: 'rgba(233, 30, 99, 0.1)',
                color: '#e91e63'
              }}
            />
          )}
        </Box>
      </Box>

      <Card sx={{ 
        p: 4, 
        mb: 3, 
        borderRadius: '20px',
        maxWidth: '1400px',
        mx: 'auto',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h5" sx={{ 
            fontWeight: 700,
            color: '#6e8efb',
            display: 'flex',
            alignItems: 'center'
          }}>
            🔍 Find Your Perfect Roommate
            {getActiveFiltersCount() > 0 && (
              <Chip 
                label={`${getActiveFiltersCount()} filters active`} 
                size="small" 
                color="primary" 
                sx={{ ml: 2 }}
              />
            )}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              sx={{ borderRadius: '12px' }}
            >
              Refresh
            </Button>
            <Button
              variant="outlined"
              onClick={() => setFilters({
                searchName: '', gender: '', religion: '', minAge: 18, maxAge: 30,
                studyHabits: '', cleanliness: '', socialLevel: '', smokingPreference: ''
              })}
              sx={{ borderRadius: '12px', color: '#ef4444', borderColor: '#ef4444' }}
            >
              Reset All
            </Button>
          </Box>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#2196f3', fontWeight: 600 }}>
            🔍 Search by Name or Faculty
          </Typography>
          <TextField
            fullWidth
            placeholder="Search for specific roommate by name or faculty..."
            value={filters.searchName}
            onChange={(e) => handleFilterChange('searchName', e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: '#2196f3' }} />
            }}
            sx={{ 
              maxWidth: '500px',
              '& .MuiOutlinedInput-root': { 
                borderRadius: '16px',
                bgcolor: 'rgba(33, 150, 243, 0.05)',
                '&:hover': {
                  bgcolor: 'rgba(33, 150, 243, 0.1)'
                }
              }
            }}
          />
          <Typography variant="body2" sx={{ mt: 1, color: '#64748b', fontStyle: 'italic' }}>
            💡 Name search shows exact matches only (no AI compatibility calculation)
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="h6" sx={{ mb: 3, color: '#6e8efb', fontWeight: 600 }}>
            🤖 AI Smart Matching - What You Want in Your Roommate
          </Typography>
          
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 3,
            mb: 3
          }}>
            <Box sx={{
              p: 3,
              borderRadius: '16px',
              border: '2px solid rgba(110, 142, 251, 0.2)',
              bgcolor: 'rgba(110, 142, 251, 0.05)',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'rgba(110, 142, 251, 0.4)',
                bgcolor: 'rgba(110, 142, 251, 0.08)'
              }
            }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#6e8efb' }}>
                👤 Gender Preference
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={filters.gender}
                  onChange={(e) => handleFilterChange('gender', e.target.value)}
                  displayEmpty
                  sx={{ borderRadius: '12px', bgcolor: 'white' }}
                >
                  <MenuItem value="">Any Gender</MenuItem>
                  <MenuItem value="Male">👨 Male</MenuItem>
                  <MenuItem value="Female">👩 Female</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{
              p: 3,
              borderRadius: '16px',
              border: '2px solid rgba(156, 39, 176, 0.2)',
              bgcolor: 'rgba(156, 39, 176, 0.05)',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'rgba(156, 39, 176, 0.4)',
                bgcolor: 'rgba(156, 39, 176, 0.08)'
              }
            }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#9c27b0' }}>
                🕌 Religion Preference
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={filters.religion}
                  onChange={(e) => handleFilterChange('religion', e.target.value)}
                  displayEmpty
                  sx={{ borderRadius: '12px', bgcolor: 'white' }}
                >
                  <MenuItem value="">Any Religion</MenuItem>
                  <MenuItem value="Islam">🕌 Islam</MenuItem>
                  <MenuItem value="Christianity">⛪ Christian</MenuItem>
                  <MenuItem value="Buddhism">🏛️ Buddhism</MenuItem>
                  <MenuItem value="Hinduism">🕉️ Hinduism</MenuItem>
                  <MenuItem value="Other">🏛️ Other Religion</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{
              p: 3,
              borderRadius: '16px',
              border: '2px solid rgba(255, 152, 0, 0.2)',
              bgcolor: 'rgba(255, 152, 0, 0.05)',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'rgba(255, 152, 0, 0.4)',
                bgcolor: 'rgba(255, 152, 0, 0.08)'
              }
            }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#ff9800' }}>
                📅 Age Range (18-30)
              </Typography>
              <Box sx={{ px: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {filters.minAge} years
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {filters.maxAge} years
                  </Typography>
                </Box>
                <Box sx={{ position: 'relative', height: '20px' }}>
                  <input
                    type="range"
                    min="18"
                    max="30"
                    value={filters.minAge}
                    onChange={(e) => {
                      const newMin = parseInt(e.target.value);
                      if (newMin <= filters.maxAge) {
                        handleFilterChange('minAge', newMin);
                      }
                    }}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '8px',
                      borderRadius: '4px',
                      background: 'linear-gradient(90deg, #ff9800 0%, #ffc107 100%)',
                      outline: 'none',
                      WebkitAppearance: 'none',
                      zIndex: 1
                    }}
                  />
                  <input
                    type="range"
                    min="18"
                    max="30"
                    value={filters.maxAge}
                    onChange={(e) => {
                      const newMax = parseInt(e.target.value);
                      if (newMax >= filters.minAge) {
                        handleFilterChange('maxAge', newMax);
                      }
                    }}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '8px',
                      borderRadius: '4px',
                      background: 'transparent',
                      outline: 'none',
                      WebkitAppearance: 'none',
                      zIndex: 2
                    }}
                  />
                </Box>
              </Box>
            </Box>

            <Box sx={{
              p: 3,
              borderRadius: '16px',
              border: '2px solid rgba(76, 175, 80, 0.2)',
              bgcolor: 'rgba(76, 175, 80, 0.05)',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'rgba(76, 175, 80, 0.4)',
                bgcolor: 'rgba(76, 175, 80, 0.08)'
              }
            }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#4caf50' }}>
                📚 Study Habits
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={filters.studyHabits}
                  onChange={(e) => handleFilterChange('studyHabits', e.target.value)}
                  displayEmpty
                  sx={{ borderRadius: '12px', bgcolor: 'white' }}
                >
                  <MenuItem value="">Any Study Style</MenuItem>
                  <MenuItem value="Morning Person">🌅 Morning Person</MenuItem>
                  <MenuItem value="Night Owl">🦉 Night Owl</MenuItem>
                  <MenuItem value="Flexible">🔄 Flexible</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{
              p: 3,
              borderRadius: '16px',
              border: '2px solid rgba(233, 30, 99, 0.2)',
              bgcolor: 'rgba(233, 30, 99, 0.05)',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'rgba(233, 30, 99, 0.4)',
                bgcolor: 'rgba(233, 30, 99, 0.08)'
              }
            }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#e91e63' }}>
                🧹 Cleanliness Level
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={filters.cleanliness}
                  onChange={(e) => handleFilterChange('cleanliness', e.target.value)}
                  displayEmpty
                  sx={{ borderRadius: '12px', bgcolor: 'white' }}
                >
                  <MenuItem value="">Any Level</MenuItem>
                  <MenuItem value="Very Clean">✨ Very Clean</MenuItem>
                  <MenuItem value="Moderate">🧹 Moderate</MenuItem>
                  <MenuItem value="Relaxed">😅 Relaxed</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{
              p: 3,
              borderRadius: '16px',
              border: '2px solid rgba(63, 81, 181, 0.2)',
              bgcolor: 'rgba(63, 81, 181, 0.05)',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'rgba(63, 81, 181, 0.4)',
                bgcolor: 'rgba(63, 81, 181, 0.08)'
              }
            }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#3f51b5' }}>
                🎉 Social Level
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={filters.socialLevel}
                  onChange={(e) => handleFilterChange('socialLevel', e.target.value)}
                  displayEmpty
                  sx={{ borderRadius: '12px', bgcolor: 'white' }}
                >
                  <MenuItem value="">Any Social Style</MenuItem>
                  <MenuItem value="Introvert">🤐 Introvert</MenuItem>
                  <MenuItem value="Extrovert">🎉 Extrovert</MenuItem>
                  <MenuItem value="Balanced">⚖️ Balanced</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{
              p: 3,
              borderRadius: '16px',
              border: '2px solid rgba(255, 87, 34, 0.2)',
              bgcolor: 'rgba(255, 87, 34, 0.05)',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'rgba(255, 87, 34, 0.4)',
                bgcolor: 'rgba(255, 87, 34, 0.08)'
              }
            }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#ff5722' }}>
                🚬 Smoking Preference
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={filters.smokingPreference}
                  onChange={(e) => handleFilterChange('smokingPreference', e.target.value)}
                  displayEmpty
                  sx={{ borderRadius: '12px', bgcolor: 'white' }}
                >
                  <MenuItem value="">Any Preference</MenuItem>
                  <MenuItem value="Non-Smoker">🚭 Non-Smoker Only</MenuItem>
                  <MenuItem value="Smoker">🚬 Smoker Friendly</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{
              p: 3,
              borderRadius: '16px',
              border: '2px solid rgba(110, 142, 251, 0.3)',
              bgcolor: 'linear-gradient(135deg, rgba(110, 142, 251, 0.1) 0%, rgba(167, 119, 227, 0.1) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSearch}
                disabled={aiMatching}
                startIcon={aiMatching ? <CircularProgress size={20} color="inherit" /> : <AIIcon />}
                sx={{ 
                  height: '60px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #6e8efb 0%, #a777e3 100%)',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  boxShadow: '0 8px 25px rgba(110, 142, 251, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5c7cfa 0%, #9775fa 100%)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 35px rgba(110, 142, 251, 0.5)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {aiMatching ? 'AI Calculating...' : '🤖 Find Compatible Roommates'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Card>

      {showAIExplanation && (
        <AIExplanationCard sx={{ maxWidth: '1400px', mx: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AIIcon sx={{ fontSize: '2rem', color: '#6e8efb', mr: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
              🤖 AI Roommate Matching Active
            </Typography>
            <Button
              onClick={() => setShowAIExplanation(false)}
              size="small"
              sx={{ ml: 'auto', color: '#6e8efb' }}
            >
              <CloseIcon />
            </Button>
          </Box>
          <Typography variant="body1" sx={{ color: '#475569', mb: 2 }}>
            Our AI has analyzed compatibility based on lifestyle preferences, demographics, and mutual compatibility. 
            Higher percentages indicate better roommate matches.
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ 
                width: 20, 
                height: 8, 
                background: 'linear-gradient(90deg, #4caf50 0%, #8bc34a 100%)',
                borderRadius: 1,
                mr: 1
              }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#4caf50' }}>
                80-100% Excellent Match
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ 
                width: 20, 
                height: 8, 
                background: 'linear-gradient(90deg, #ff9800 0%, #ffc107 100%)',
                borderRadius: 1,
                mr: 1
              }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#ff9800' }}>
                60-79% Good Match
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ 
                width: 20, 
                height: 8, 
                background: 'linear-gradient(90deg, #f44336 0%, #e91e63 100%)',
                borderRadius: 1,
                mr: 1
              }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#f44336' }}>
                Below 60% Lower Match
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Chip label="👤 Demographics" size="small" sx={{ bgcolor: 'rgba(110, 142, 251, 0.1)' }} />
            <Chip label="🏡 Lifestyle Compatibility" size="small" sx={{ bgcolor: 'rgba(110, 142, 251, 0.1)' }} />
            <Chip label="🎯 Personal Preferences" size="small" sx={{ bgcolor: 'rgba(110, 142, 251, 0.1)' }} />
            <Chip label="📊 Age Compatibility" size="small" sx={{ bgcolor: 'rgba(110, 142, 251, 0.1)' }} />
          </Box>
        </AIExplanationCard>
      )}

      {loading ? (
        <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
          <Grid container spacing={3}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card sx={{ borderRadius: '20px' }}>
                  <Box sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Skeleton variant="circular" width={60} height={60} />
                      <Box sx={{ ml: 2, flex: 1 }}>
                        <Skeleton variant="text" height={24} width="60%" />
                        <Skeleton variant="text" height={20} width="40%" />
                      </Box>
                    </Box>
                    <Skeleton variant="text" height={20} width="80%" />
                    <Skeleton variant="text" height={20} width="60%" />
                    <Skeleton variant="rectangular" height={40} sx={{ mt: 2, borderRadius: '12px' }} />
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        <>
          <Box sx={{ maxWidth: '1400px', mx: 'auto', mb: 6 }}>
            <CollapsibleSectionHeader 
              isExpanded={myRequestExpanded}
              onClick={toggleMyRequestExpanded}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonIcon sx={{ fontSize: '2rem', mr: 2 }} />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                      🧍 My Roommate Request
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                      {myRequest.length > 0 ? (
                        !myRequestExpanded ? (
                          <>Active • {myRequest[0]?.name} • <Chip label="Click to expand" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', ml: 1 }} /></>
                        ) : (
                          'Your active roommate request'
                        )
                      ) : (
                        'Create your roommate request'
                      )}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {myRequest.length > 0 && !myRequestExpanded && (
                    <>
                      <Tooltip title="Edit Request">
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(myRequest[0]);
                          }}
                          sx={{ 
                            color: 'white',
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            '&:hover': {
                              bgcolor: 'rgba(255, 255, 255, 0.3)'
                            }
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Request">
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            setRoommateToDelete(myRequest[0]);
                            setDeleteDialogOpen(true);
                          }}
                          sx={{ 
                            color: 'white',
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            '&:hover': {
                              bgcolor: 'rgba(255, 255, 255, 0.3)'
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AnalyticsIcon sx={{ fontSize: '1.5rem' }} />
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      {myRequest.length > 0 ? 'Active' : 'None'}
                    </Typography>
                    {myRequestExpanded ? (
                      <ExpandLessIcon sx={{ fontSize: '2rem', ml: 1 }} />
                    ) : (
                      <ExpandMoreIcon sx={{ fontSize: '2rem', ml: 1 }} />
                    )}
                  </Box>
                </Box>
              </Box>
            </CollapsibleSectionHeader>

            <Collapse in={myRequestExpanded} timeout={400}>
              <CollapsibleContent sx={{ p: 3 }}>
                {myRequest.length === 0 ? (
                  <Card sx={{ 
                    p: 6, 
                    textAlign: 'center', 
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, rgba(233, 30, 99, 0.05) 0%, rgba(240, 98, 146, 0.05) 100%)',
                    border: '2px dashed rgba(233, 30, 99, 0.2)'
                  }}>
                    <PersonIcon sx={{ fontSize: 64, color: '#e91e63', mb: 2, opacity: 0.5 }} />
                    <Typography variant="h5" sx={{ color: '#e91e63', mb: 1, fontWeight: 600 }}>
                      No roommate request yet
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#94a3b8', mb: 3 }}>
                      Create your roommate request to start finding compatible roommates!
                    </Typography>
                    <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
                      <Typography variant="body2">
                        💡 <strong>One Request Policy:</strong> You can have one active roommate request to keep your search focused and prevent confusion for potential roommates.
                      </Typography>
                    </Alert>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      sx={{
                        background: 'linear-gradient(135deg, #e91e63 0%, #f06292 100%)',
                        borderRadius: '12px',
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #c2185b 0%, #e91e63 100%)',
                        }
                      }}
                      onClick={() => {
                        navigate('/post-roommate');
                      }}
                    >
                      Create My Request
                    </Button>
                  </Card>
                ) : (
                  <Grid container spacing={3}>
                    {myRequest.map((roommate) => (
                      <Grid item xs={12} md={6} lg={4} key={roommate._id}>
                        <RoommateCard onClick={() => handleViewRoommateDetails(roommate)}>
                          <Box sx={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            zIndex: 15,
                            bgcolor: 'rgba(233, 30, 99, 0.9)',
                            color: 'white',
                            px: 2,
                            py: 0.5,
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            backdropFilter: 'blur(10px)'
                          }}>
                            👑 Your Request
                          </Box>
                          
                          <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                              <Avatar
                                src={roommate.profilePicture ? `http://localhost:3001${roommate.profilePicture}` : undefined}
                                sx={{
                                  width: 60,
                                  height: 60,
                                  bgcolor: '#e91e63',
                                  mr: 2
                                }}
                              >
                                {!roommate.profilePicture && (
                                  roommate.name ? roommate.name.charAt(0).toUpperCase() : <PersonIcon sx={{ fontSize: '2rem' }} />
                                )}
                              </Avatar>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                  {roommate.name}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                                  {roommate.age} years old • {roommate.gender} • {roommate.religion || 'Religion not specified'}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#e91e63', fontWeight: 600 }}>
                                  {roommate.university}
                                </Typography>
                              </Box>
                              
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(roommate);
                                  }}
                                  sx={{ 
                                    color: '#6e8efb',
                                    bgcolor: 'rgba(110, 142, 251, 0.1)',
                                    '&:hover': {
                                      bgcolor: 'rgba(110, 142, 251, 0.2)'
                                    }
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setRoommateToDelete(roommate);
                                    setDeleteDialogOpen(true);
                                  }}
                                  sx={{ 
                                    color: '#ef4444',
                                    bgcolor: 'rgba(239, 68, 68, 0.1)',
                                    '&:hover': {
                                      bgcolor: 'rgba(239, 68, 68, 0.2)'
                                    }
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Box>
                            
                            <ExpandableDescription description={roommate.aboutMe?.description} />
                            
                            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                              <Button
                                fullWidth
                                variant="contained"
                                startIcon={<EditIcon />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(roommate);
                                }}
                                sx={{
                                  background: 'linear-gradient(135deg, #e91e63 0%, #f06292 100%)',
                                  borderRadius: '12px',
                                  '&:hover': {
                                    background: 'linear-gradient(135deg, #c2185b 0%, #e91e63 100%)',
                                  }
                                }}
                              >
                                Edit Request
                              </Button>
                            </Box>
                          </CardContent>
                        </RoommateCard>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CollapsibleContent>
            </Collapse>
          </Box>

          <Divider sx={{ maxWidth: '1400px', mx: 'auto', my: 6 }} />

          <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
            <SectionHeader isOwner={false}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <GroupsIcon sx={{ fontSize: '2rem', mr: 2 }} />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                      🌍 Browse Potential Roommates
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                      {displayRequests.length} {displayRequests.length === 1 ? 'roommate' : 'roommates'} {hasAIResults ? 'ranked by compatibility' : 'looking for accommodation'}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <SearchIcon sx={{ fontSize: '1.5rem' }} />
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Available: {otherRequests.length}
                  </Typography>
                </Box>
              </Box>
            </SectionHeader>

            {displayRequests.length === 0 ? (
              <Card sx={{ 
                p: 6, 
                textAlign: 'center', 
                borderRadius: '20px',
                background: 'linear-gradient(135deg, rgba(110, 142, 251, 0.05) 0%, rgba(167, 119, 227, 0.05) 100%)',
                border: '2px dashed rgba(110, 142, 251, 0.2)'
              }}>
                <SearchIcon sx={{ fontSize: 64, color: '#6e8efb', mb: 2, opacity: 0.5 }} />
                <Typography variant="h5" sx={{ color: '#6e8efb', mb: 1, fontWeight: 600 }}>
                  No roommates found
                </Typography>
                <Typography variant="body1" sx={{ color: '#94a3b8', mb: 3 }}>
                  Try adjusting your search filters to find more potential roommates
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => {
                    // Clear filters and AI results
                    setFilters({
                      searchName: '', gender: '', religion: '', minAge: 18, maxAge: 30,
                      studyHabits: '', cleanliness: '', socialLevel: '', smokingPreference: ''
                    });
                    // Reset roommates to original data without AI percentages
                    fetchRoommates();
                    setShowAIExplanation(false);
                  }}
                  sx={{
                    borderColor: '#6e8efb',
                    color: '#6e8efb',
                    borderRadius: '12px',
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: '#5c7cfa',
                      bgcolor: 'rgba(110, 142, 251, 0.1)'
                    }
                  }}
                >
                  Clear All Filters
                </Button>
              </Card>
            ) : (
              <Grid container spacing={3}>
                {displayRequests.map((roommate) => (
                  <Grid item xs={12} md={6} lg={4} key={roommate._id}>
                    <RoommateCard onClick={() => handleViewRoommateDetails(roommate)}>
                      {roommate.aiMatchPercentage && (
                        <PremiumMatchBar matchPercent={roommate.aiMatchPercentage} />
                      )}
                      
                      {roommate.aiMatchPercentage && (
                        <Tooltip
                          title={roommate.aiTooltip || `${roommate.aiMatchPercentage}% compatible`}
                          arrow
                          placement="top"
                        >
                          <Box>
                            <AnimatedPercentage
                              targetPercent={roommate.aiMatchPercentage}
                              matchPercent={roommate.aiMatchPercentage}
                            />
                          </Box>
                        </Tooltip>
                      )}
                      
                      <FavoritesButton 
                        roommateId={roommate._id} 
                        initialFavorite={isFavorited(roommate._id)}
                        onToggle={toggleFavorite}
                      />
                      
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <Avatar
                            src={roommate.profilePicture ? `http://localhost:3001${roommate.profilePicture}` : undefined}
                            sx={{
                              width: 60,
                              height: 60,
                              bgcolor: '#6e8efb',
                              mr: 2
                            }}
                          >
                            {!roommate.profilePicture && (
                              roommate.name ? roommate.name.charAt(0).toUpperCase() : <PersonIcon sx={{ fontSize: '2rem' }} />
                            )}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                              {roommate.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                              {roommate.age} years old • {roommate.gender} • {roommate.religion || 'Religion not specified'}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#6e8efb', fontWeight: 600 }}>
                              {roommate.university}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <ExpandableDescription description={roommate.aboutMe?.description} />
                        
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                          {roommate.aboutMe?.studyHabits && (
                            <Chip 
                              label={roommate.aboutMe.studyHabits} 
                              size="small" 
                              sx={{ bgcolor: 'rgba(110, 142, 251, 0.1)', color: '#6e8efb' }}
                            />
                          )}
                          {roommate.aboutMe?.cleanliness && (
                            <Chip 
                              label={roommate.aboutMe.cleanliness} 
                              size="small" 
                              sx={{ bgcolor: 'rgba(233, 30, 99, 0.1)', color: '#e91e63' }}
                            />
                          )}
                          {roommate.aboutMe?.socialLevel && (
                            <Chip 
                              label={roommate.aboutMe.socialLevel} 
                              size="small" 
                              sx={{ bgcolor: 'rgba(156, 39, 176, 0.1)', color: '#9c27b0' }}
                            />
                          )}
                          <Chip 
                            label={roommate.aboutMe?.smoker ? 'Smoker' : 'Non-Smoker'} 
                            size="small" 
                            sx={{ 
                              bgcolor: roommate.aboutMe?.smoker ? 'rgba(255, 87, 34, 0.1)' : 'rgba(76, 175, 80, 0.1)',
                              color: roommate.aboutMe?.smoker ? '#ff5722' : '#4caf50'
                            }}
                          />
                        </Box>

                        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                          <Button
                            fullWidth
                            variant="contained"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewRoommateDetails(roommate);
                            }}
                            sx={{
                              background: 'linear-gradient(135deg, #6e8efb 0%, #a777e3 100%)',
                              borderRadius: '12px',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #5c7cfa 0%, #9775fa 100%)',
                              }
                            }}
                          >
                            View Details & Contact
                          </Button>
                        </Box>
                      </CardContent>
                    </RoommateCard>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </>
      )}

      <FavoritesFab onClick={() => setFavoritesOpen(true)}>
        <Badge badgeContent={favorites.length} color="error">
          <FavoriteIcon />
        </Badge>
      </FavoritesFab>

      <FavoritesDrawer
        open={favoritesOpen}
        onClose={() => setFavoritesOpen(false)}
        favorites={favorites}
        onRemove={handleRemoveFromFavorites}
        onViewRoommate={handleViewRoommateFromDrawer}
      />

      <RoommateDetailsModal
        open={roommateDetailsOpen}
        onClose={() => setRoommateDetailsOpen(false)}
        roommate={selectedRoommate}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: '16px' }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center',
          color: '#ef4444'
        }}>
          <WarningIcon sx={{ mr: 1 }} />
          Delete Roommate Request?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your roommate request? This action cannot be undone.
            You'll need to create a new request if you want to find roommates again.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ borderRadius: '12px' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => handleDeleteRoommate(roommateToDelete?._id)}
            variant="contained"
            color="error"
            sx={{ borderRadius: '12px' }}
          >
            Delete Request
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ borderRadius: '12px' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};