import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { trackPropertySearch } from '../utils/analytics';
import {
  Box, Typography, Grid, Card, CardContent, TextField,
  Button, Chip, CircularProgress, Alert, FormControl, 
  InputLabel, Select, MenuItem, CardMedia, Skeleton,
  Divider, Modal, IconButton, Badge, Fab, Drawer,
  List, ListItem, ListItemAvatar, ListItemText, ListItemSecondaryAction,
  Avatar, Snackbar, Tooltip, LinearProgress, Paper, Collapse
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Image as ImageIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  MeetingRoom as RoomIcon,
  LocalParking as ParkingIcon,
  Close as CloseIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  ZoomIn as ZoomInIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Business as BusinessIcon,
  Schedule as ScheduleIcon,
  Description as DescriptionIcon,
  AttachMoney as MoneyIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Bookmark as BookmarkIcon,
  AutoAwesome as AIIcon,
  Info as InfoIcon,
  Wifi as WifiIcon,
  Chair as FurnishedIcon,
  ShoppingCart as ShoppingIcon,
  People as PeopleIcon,
  Groups as GroupsIcon,
  School as SchoolIcon,
  Smoking as SmokingIcon,
  SmokeFree as NoSmokingIcon,
  Edit as EditIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// FIXED IMAGE URL FUNCTION
const getImageUrl = (photo) => {
  if (!photo) return null;
  
  if (photo.startsWith('http')) {
    return photo;
  }
  
  if (photo.startsWith('/uploads/')) {
    return `http://localhost:3001${photo}`;
  }
  
  if (photo.startsWith('uploads/')) {
    return `http://localhost:3001/${photo}`;
  }
  
  return `http://localhost:3001/uploads/properties/${photo}`;
};

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

const PropertyCard = styled(Card)(({ theme }) => ({
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

// 🎨 ENHANCED COLLAPSIBLE SECTION HEADER
const CollapsibleSectionHeader = styled(Box)(({ theme, isOwner, isCollapsed }) => ({
  background: isOwner 
    ? 'linear-gradient(135deg, #e91e63 0%, #f06292 100%)'
    : 'linear-gradient(135deg, #6e8efb 0%, #a777e3 100%)',
  borderRadius: isCollapsed ? '16px' : '16px 16px 0 0',
  padding: theme.spacing(3),
  marginBottom: isCollapsed ? theme.spacing(3) : 0,
  color: 'white',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    transition: 'left 0.5s',
  },
  '&:hover::before': {
    left: '100%',
  }
}));

// 🎨 COLLAPSIBLE CONTENT CONTAINER
const CollapsibleContent = styled(Box)(({ theme }) => ({
  background: 'white',
  borderRadius: '0 0 16px 16px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  overflow: 'hidden',
  marginBottom: theme.spacing(3),
}));
 //tracking

// 🎨 PREMIUM PROGRESS BAR COMPONENT
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

// 🎯 ANIMATED PERCENTAGE COUNTER
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

const DreamHomesFab = styled(Fab)(({ theme }) => ({
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

// DREAM HOMES BUTTON COMPONENT
const DreamHomesButton = ({ propertyId, initialFavorite = false, onToggle }) => {
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
      onToggle(propertyId, newFavoriteState);
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
        <BookmarkIcon sx={{ fontSize: '1.5rem', color: '#e91e63' }} />
      ) : (
        <BookmarkBorderIcon sx={{ fontSize: '1.5rem', color: '#666' }} />
      )}
    </div>
  );
};

// EXPANDABLE DESCRIPTION COMPONENT
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

// PROPERTY IMAGE COMPONENT
const PropertyImage = ({ listing, title, onClick, userFavorites = [], onFavoriteToggle }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const photos = listing.photos || listing.images || [];
  const isFavorite = userFavorites.includes(listing._id);

  const handleImageClick = (e) => {
    const heartButton = e.target.closest('[data-heart-button]');
    if (heartButton) {
      return;
    }
    onClick();
  };

  if (!photos || photos.length === 0) {
    return (
      <Box sx={{ 
        height: 250,
        bgcolor: 'rgba(110, 142, 251, 0.1)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column',
        position: 'relative'
      }}>
        <Box data-heart-button>
          <DreamHomesButton 
            propertyId={listing._id} 
            initialFavorite={isFavorite}
            onToggle={onFavoriteToggle}
          />
        </Box>
        <ImageIcon sx={{ fontSize: 48, color: '#6e8efb', mb: 1 }} />
        <Typography variant="body2" color="text.secondary">
          No photos available
        </Typography>
      </Box>
    );
  }

  const imageUrl = getImageUrl(photos[0]);

  return (
    <Box 
      onClick={handleImageClick}
      sx={{ 
        position: 'relative', 
        height: 250, 
        cursor: 'pointer',
        '&:hover .zoom-overlay': {
          opacity: 1
        },
        '&:hover .main-image': {
          transform: 'scale(1.05)'
        }
      }}
    >
      <Box data-heart-button>
        <DreamHomesButton 
          propertyId={listing._id} 
          initialFavorite={isFavorite}
          onToggle={onFavoriteToggle}
        />
      </Box>
      
      {imageLoading && (
        <Skeleton variant="rectangular" width="100%" height={250} />
      )}
      <CardMedia
        className="main-image"
        component="img"
        height="250"
        image={imageUrl}
        alt={title}
        onLoad={() => setImageLoading(false)}
        onError={(e) => {
          setImageError(true);
          setImageLoading(false);
        }}
        sx={{ 
          objectFit: 'cover',
          display: imageError ? 'none' : 'block',
          transition: 'transform 0.3s ease'
        }}
      />
      
      <Box 
        className="zoom-overlay"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none'
        }}
      >
        <ZoomInIcon sx={{ fontSize: 48, color: 'white' }} />
        <Typography variant="h6" sx={{ color: 'white', ml: 1 }}>
          Click to view
        </Typography>
      </Box>
      
      {imageError && !imageLoading && (
        <Box sx={{ 
          height: 250, 
          bgcolor: 'rgba(255, 193, 7, 0.1)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexDirection: 'column'
        }}>
          <ImageIcon sx={{ fontSize: 48, color: '#ffc107', mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Image failed to load
          </Typography>
        </Box>
      )}
      
      {photos.length > 1 && (
        <Badge
          badgeContent={`${photos.length} photos`}
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            '& .MuiBadge-badge': {
              bgcolor: 'rgba(0,0,0,0.7)',
              color: 'white',
              fontSize: '0.75rem',
              borderRadius: '12px',
              px: 1,
              fontWeight: 600
            }
          }}
        />
      )}
    </Box>
  );
};

// DREAM HOMES DRAWER COMPONENT
const DreamHomesDrawer = ({ open, onClose, dreamHomes, onRemove, onViewProperty }) => {
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
            <BookmarkIcon sx={{ mr: 1, color: '#e91e63' }} />
            My Dream Homes
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography variant="body2" sx={{ mb: 3, color: '#64748b' }}>
          {dreamHomes.length} {dreamHomes.length === 1 ? 'property' : 'properties'} saved
        </Typography>

        {dreamHomes.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 6,
            color: '#64748b'
          }}>
            <BookmarkIcon sx={{ fontSize: 48, mb: 2, opacity: 0.3 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              No Dream Homes Yet
            </Typography>
            <Typography variant="body2">
              Start adding properties to your dream homes collection!
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {dreamHomes.map((property) => {
              const photos = property.photos || property.images || [];
              const imageUrl = photos.length > 0 
                ? getImageUrl(photos[0])
                : null;

              return (
                <ListItem
                  key={property._id}
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
                      src={imageUrl}
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '12px',
                        bgcolor: '#e91e63'
                      }}
                    >
                      <HomeIcon />
                    </Avatar>
                  </ListItemAvatar>
                  
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" sx={{ 
                        fontWeight: 600,
                        mb: 0.5,
                        color: '#1e293b'
                      }}>
                        {property.title}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5 }}>
                          📍 {property.location}
                        </Typography>
                        <Typography variant="h6" sx={{ 
                          color: '#e91e63', 
                          fontWeight: 700,
                          fontSize: '1rem'
                        }}>
                          RM {property.price}/month
                        </Typography>
                      </Box>
                    }
                  />
                  
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <IconButton
                        onClick={() => onViewProperty(property)}
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
                        onClick={() => onRemove(property._id)}
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
              );
            })}
          </List>
        )}
      </Box>
    </Drawer>
  );
};

// PROPERTY DETAILS MODAL COMPONENT - FIXED WITH TENANT PREFERENCES
const PropertyDetailsModal = ({ open, onClose, property }) => {
  if (!property) return null;

  const photos = property.photos || property.images || [];

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
          {photos.length > 0 && (
            <Box sx={{ height: 300, position: 'relative' }}>
              <CardMedia
                component="img"
                height="300"
                image={getImageUrl(photos[0])}
                alt={property.title}
                sx={{ objectFit: 'cover' }}
              />
            </Box>
          )}

          <Box sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 3 }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {property.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationIcon sx={{ fontSize: '1.2rem', color: '#a777e3', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: '#64748b' }}>
                    {property.location}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Chip 
                  label={property.type || 'Property'} 
                  color="primary"
                  sx={{ mb: 1 }}
                />
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#6e8efb' }}>
                  RM {property.price}/month
                </Typography>
              </Box>
            </Box>

            {property.description && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  📝 Description
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.7, color: '#475569' }}>
                  {property.description}
                </Typography>
              </Box>
            )}

            {(property.numberOfRooms || property.rentalType || property.furnishing || property.parkingAvailability) && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#4caf50' }}>
                  🏠 Property Details
                </Typography>
                <Grid container spacing={2}>
                  {property.numberOfRooms && (
                    <Grid item xs={6} md={3}>
                      <Typography variant="body1">
                        <strong>Rooms:</strong> {property.numberOfRooms}
                      </Typography>
                    </Grid>
                  )}
                  {property.rentalType && (
                    <Grid item xs={6} md={3}>
                      <Typography variant="body1">
                        <strong>Type:</strong> {property.rentalType}
                      </Typography>
                    </Grid>
                  )}
                  {property.furnishing && (
                    <Grid item xs={6} md={3}>
                      <Typography variant="body1">
                        <strong>Furnishing:</strong> {property.furnishing}
                      </Typography>
                    </Grid>
                  )}
                  {property.parkingAvailability && (
                    <Grid item xs={6} md={3}>
                      <Typography variant="body1">
                        <strong>Parking:</strong> {property.parkingAvailability}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}

            {/* 🆕 TENANT PREFERENCES SECTION - THIS WAS MISSING! */}
            {(property.preferredGender || property.religiousPreference || property.studentYearPreference || 
              property.lifestylePreference || property.smokingPreference || property.studyHabitsPreference) && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#ff9800' }}>
                  👥 Tenant Preferences
                </Typography>
                <Grid container spacing={2}>
                  {property.preferredGender && (
                    <Grid item xs={12} md={6}>
                      <Box sx={{ p: 2, bgcolor: 'rgba(255, 152, 0, 0.05)', borderRadius: '8px' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#ff9800', mb: 0.5 }}>
                          👤 Gender Preference:
                        </Typography>
                        <Chip 
                          label={property.preferredGender}
                          size="small"
                          sx={{ 
                            bgcolor: property.preferredGender === 'Female Only' ? 'rgba(233, 30, 99, 0.1)' :
                                   property.preferredGender === 'Male Only' ? 'rgba(33, 150, 243, 0.1)' :
                                   'rgba(76, 175, 80, 0.1)',
                            color: property.preferredGender === 'Female Only' ? '#e91e63' :
                                   property.preferredGender === 'Male Only' ? '#2196f3' :
                                   '#4caf50'
                          }}
                        />
                      </Box>
                    </Grid>
                  )}
                  
                  {property.religiousPreference && (
                    <Grid item xs={12} md={6}>
                      <Box sx={{ p: 2, bgcolor: 'rgba(255, 152, 0, 0.05)', borderRadius: '8px' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#ff9800', mb: 0.5 }}>
                          🕌 Religious Preference:
                        </Typography>
                        <Chip 
                          label={property.religiousPreference}
                          size="small"
                          sx={{ 
                            bgcolor: 'rgba(156, 39, 176, 0.1)',
                            color: '#9c27b0'
                          }}
                        />
                      </Box>
                    </Grid>
                  )}
                  
                  {property.studentYearPreference && (
                    <Grid item xs={12} md={6}>
                      <Box sx={{ p: 2, bgcolor: 'rgba(255, 152, 0, 0.05)', borderRadius: '8px' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#ff9800', mb: 0.5 }}>
                          🎓 Student Year:
                        </Typography>
                        <Chip 
                          label={property.studentYearPreference}
                          size="small"
                          sx={{ 
                            bgcolor: 'rgba(110, 142, 251, 0.1)',
                            color: '#6e8efb'
                          }}
                        />
                      </Box>
                    </Grid>
                  )}
                  
                  {property.lifestylePreference && (
                    <Grid item xs={12} md={6}>
                      <Box sx={{ p: 2, bgcolor: 'rgba(255, 152, 0, 0.05)', borderRadius: '8px' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#ff9800', mb: 0.5 }}>
                          🌟 Lifestyle:
                        </Typography>
                        <Chip 
                          label={property.lifestylePreference}
                          size="small"
                          sx={{ 
                            bgcolor: 'rgba(255, 193, 7, 0.1)',
                            color: '#ffc107'
                          }}
                        />
                      </Box>
                    </Grid>
                  )}
                  
                  {property.smokingPreference && (
                    <Grid item xs={12} md={6}>
                      <Box sx={{ p: 2, bgcolor: 'rgba(255, 152, 0, 0.05)', borderRadius: '8px' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#ff9800', mb: 0.5 }}>
                          🚬 Smoking Policy:
                        </Typography>
                        <Chip 
                          label={property.smokingPreference}
                          size="small"
                          sx={{ 
                            bgcolor: property.smokingPreference === 'Non-Smoker Only' ? 'rgba(76, 175, 80, 0.1)' :
                                   property.smokingPreference === 'Smoker Friendly' ? 'rgba(255, 87, 34, 0.1)' :
                                   'rgba(158, 158, 158, 0.1)',
                            color: property.smokingPreference === 'Non-Smoker Only' ? '#4caf50' :
                                   property.smokingPreference === 'Smoker Friendly' ? '#ff5722' :
                                   '#9e9e9e'
                          }}
                        />
                      </Box>
                    </Grid>
                  )}
                  
                  {property.studyHabitsPreference && (
                    <Grid item xs={12} md={6}>
                      <Box sx={{ p: 2, bgcolor: 'rgba(255, 152, 0, 0.05)', borderRadius: '8px' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#ff9800', mb: 0.5 }}>
                          📚 Study Environment:
                        </Typography>
                        <Chip 
                          label={property.studyHabitsPreference}
                          size="small"
                          sx={{ 
                            bgcolor: 'rgba(63, 81, 181, 0.1)',
                            color: '#3f51b5'
                          }}
                        />
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}

            {property.amenities && property.amenities.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#e91e63' }}>
                  🏠 Amenities
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {property.amenities.map((amenity, index) => (
                    <Chip
                      key={index}
                      label={amenity}
                      sx={{
                        bgcolor: 'rgba(233, 30, 99, 0.1)',
                        color: '#e91e63'
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* 🆕 OWNER INFORMATION SECTION */}
            {(property.shareholderName || property.phoneNumber || property.shareholderAddress) && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#a777e3' }}>
                  👤 Property Owner
                </Typography>
                {property.shareholderName && (
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Name:</strong> {property.shareholderName}
                  </Typography>
                )}
                {property.phoneNumber && (
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Phone:</strong> {property.phoneNumber}
                  </Typography>
                )}
                {property.shareholderAddress && (
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Address:</strong> {property.shareholderAddress}
                  </Typography>
                )}
              </Box>
            )}

            {property.contact && (
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body1">
                  <strong>📞 Contact:</strong> {property.contact}
                </Typography>
              </Alert>
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

const ImageModal = ({ open, onClose, photos, initialIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
  };

  if (!photos || photos.length === 0) return null;

  const currentImageUrl = getImageUrl(photos[currentIndex]);

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
        maxWidth: '95vw',
        maxHeight: '95vh',
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: '16px',
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
        
        <Box sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 3,
          color: 'white',
          bgcolor: 'rgba(0,0,0,0.6)',
          px: 2,
          py: 1,
          borderRadius: '20px',
          fontSize: '0.9rem',
          fontWeight: 600
        }}>
          {currentIndex + 1} / {photos.length}
        </Box>

        {photos.length > 1 && (
          <>
            <IconButton
              onClick={handlePrev}
              sx={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 3,
                color: 'white',
                bgcolor: 'rgba(0,0,0,0.6)',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.8)'
                }
              }}
            >
              <NavigateBeforeIcon fontSize="large" />
            </IconButton>
            <IconButton
              onClick={handleNext}
              sx={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 3,
                color: 'white',
                bgcolor: 'rgba(0,0,0,0.6)',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.8)'
                }
              }}
            >
              <NavigateNextIcon fontSize="large" />
            </IconButton>
          </>
        )}
        
        <CardMedia
          component="img"
          image={currentImageUrl}
          alt={`Property image ${currentIndex + 1}`}
          sx={{
            width: '100%',
            height: 'auto',
            maxHeight: '85vh',
            objectFit: 'contain',
            backgroundColor: 'rgba(0,0,0,0.05)'
          }}
        />
      </Box>
    </Modal>
  );
};

// ✅ MAIN COMPONENT STARTS HERE
export default function PropertyListings({ userEmail: propUserEmail, userProfile }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [dreamHomesOpen, setDreamHomesOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    type: '',
    parkingRequired: '',
    wifiRequired: '',
    furnishingPreference: '',
    nearAmenities: '',
    genderPreference: '',
    religiousPreference: '',
    smokingPreference: ''
  });
  const [selectedListing, setSelectedListing] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [propertyDetailsOpen, setPropertyDetailsOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [aiMatching, setAiMatching] = useState(false);
  const [showAIExplanation, setShowAIExplanation] = useState(false);

  // 🔥 NEW STATE FOR COLLAPSIBLE SECTIONS
  const [myPropertiesCollapsed, setMyPropertiesCollapsed] = useState(() => {
    const saved = localStorage.getItem('myPropertiesCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [browsePropertiesCollapsed, setBrowsePropertiesCollapsed] = useState(() => {
    const saved = localStorage.getItem('browsePropertiesCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  // 🔥 SAVE COLLAPSE STATE TO LOCALSTORAGE
  useEffect(() => {
    localStorage.setItem('myPropertiesCollapsed', JSON.stringify(myPropertiesCollapsed));
  }, [myPropertiesCollapsed]);

  useEffect(() => {
    localStorage.setItem('browsePropertiesCollapsed', JSON.stringify(browsePropertiesCollapsed));
  }, [browsePropertiesCollapsed]);

  // 🔥 GET USER EMAIL FROM PROPS OR LOCALSTORAGE
  const userEmail = propUserEmail || localStorage.getItem('userEmail');

  // ✅ NAVIGATION HOOK FOR EDIT FUNCTIONALITY
  const navigate = useNavigate();

  // ✅ NEW: EDIT HANDLER FUNCTION
  const handleEdit = (property) => {
    console.log('🔧 Editing property:', property._id);
    navigate('/post-property', { state: { editData: property } });
  };

  // ✅ ENHANCED DELETE FUNCTION WITH AXIOS
  const handleDeleteProperty = async (propertyId) => {
    if (!userEmail) {
      setSnackbar({
        open: true,
        message: 'User email not available. Please log in again.',
        severity: 'error'
      });
      return;
    }

    if (!window.confirm('Are you sure you want to delete this property?')) return;
    
    try {
      await axios.delete(`http://localhost:3001/api/properties/${propertyId}`, {
        data: { userEmail }
      });
      
      setSnackbar({ 
        open: true, 
        message: 'Property deleted successfully! 🎉', 
        severity: 'success' 
      });
      
      // Remove from local state
      setListings(listings.filter(listing => listing._id !== propertyId));
      
    } catch (error) {
      console.error('Delete error:', error);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.error || 'Failed to delete property', 
        severity: 'error' 
      });
    }
  };

  // LocalStorage functions
  const loadFavorites = () => {
    if (!userEmail) return;
    const userSpecificKey = `propertyFavorites_${userEmail}`;
    const savedFavorites = localStorage.getItem(userSpecificKey);

    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    } else {
      // ✅ MIGRATION: Check for old global favorites and migrate them
      const oldGlobalFavorites = localStorage.getItem('propertyFavorites');
      if (oldGlobalFavorites) {
        const parsedOldFavorites = JSON.parse(oldGlobalFavorites);
        setFavorites(parsedOldFavorites);
        localStorage.setItem(userSpecificKey, oldGlobalFavorites);
        localStorage.removeItem('propertyFavorites'); // Clean up old global key
        console.log('✅ Migrated property favorites to user-specific storage');
      }
    }
  };

  const saveFavorites = (newFavorites) => {
    if (!userEmail) return;
    setFavorites(newFavorites);
    const userSpecificKey = `propertyFavorites_${userEmail}`;
    localStorage.setItem(userSpecificKey, JSON.stringify(newFavorites));
  };

const toggleFavorite = async (propertyId, isFavorite) => {
  const property = listings.find(p => p._id === propertyId);
  if (!property) return;

  // ✅ TRACK BOOKMARK ANALYTICS 
  if (isFavorite) {
    try {
      await fetch('http://localhost:3001/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'property_bookmark',
          data: {
            propertyId: propertyId,
            location: property.location,
            price: property.price,
            propertyType: property.type || 'Unknown'
          }
        })
      });
    } catch (error) {
      console.log('Analytics tracking failed:', error);
    }
  }

  let newFavorites;
  if (isFavorite) {
    newFavorites = [...favorites, property];
    setSnackbar({
      open: true,
      message: 'Added to favorites! 💖',
      severity: 'success'
    });
  } else {
    newFavorites = favorites.filter(fav => fav._id !== propertyId);
    setSnackbar({
      open: true,
      message: 'Removed from favorites',
      severity: 'info'
    });
  }
  
  saveFavorites(newFavorites);
};

  const isFavorited = (propertyId) => {
    return favorites.some(fav => fav._id === propertyId);
  };

  // ✅ ENHANCED FETCH FUNCTION WITH AXIOS
  const fetchProperties = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get('http://localhost:3001/api/properties');
      
      if (response.data.success) {
        setListings(response.data.data);
      } else {
        setListings([]);
      }
    } catch (error) {
      console.error('Network error:', error);
      setSnackbar({
        open: true,
        message: 'Error fetching properties',
        severity: 'error'
      });
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  // 🎯 SMART SEPARATION LOGIC
  const myListings = listings.filter(listing => listing.userEmail === userEmail);
  const otherListings = listings.filter(listing => listing.userEmail !== userEmail);

  // Filter listings based on current filters
  const filteredMyListings = myListings.filter(listing => {
    return (
      (!filters.location || listing.location?.toLowerCase().includes(filters.location.toLowerCase())) &&
      (!filters.type || listing.type === filters.type) &&
      (!filters.minPrice || listing.price >= parseInt(filters.minPrice)) &&
      (!filters.maxPrice || listing.price <= parseInt(filters.maxPrice))
    );
  });

  const filteredOtherListings = otherListings.filter(listing => {
    return (
      (!filters.location || listing.location?.toLowerCase().includes(filters.location.toLowerCase())) &&
      (!filters.type || listing.type === filters.type) &&
      (!filters.minPrice || listing.price >= parseInt(filters.minPrice)) &&
      (!filters.maxPrice || listing.price <= parseInt(filters.maxPrice)) &&
      (!filters.genderPreference || listing.preferredGender === filters.genderPreference ||
       listing.preferredGender === 'Any Gender' || !listing.preferredGender) &&
      (!filters.religiousPreference || listing.religiousPreference === filters.religiousPreference ||
       listing.religiousPreference === 'Any Religion' || !listing.religiousPreference) &&
      (!filters.smokingPreference || listing.smokingPreference === filters.smokingPreference ||
       listing.smokingPreference === 'Any' || !listing.smokingPreference) &&
      (!filters.furnishingPreference || listing.furnishing === filters.furnishingPreference || !listing.furnishing)
    );
  });

  // 🤖 AI MATCHING: Determine what to display
  // If AI matching has been performed (properties have aiMatchPercentage), show all AI results
  // Otherwise, use regular filtering
  const hasAIResults = otherListings.some(listing => listing.aiMatchPercentage);
  const displayListings = hasAIResults ? otherListings : filteredOtherListings;

  // 🚀 AI MATCHING FUNCTIONS WITH TOOLTIPS
  const calculatePropertyCompatibility = (property) => {
    let score = 0;
    let matchReasons = [];
    let differentReasons = [];

    // 🎯 PRIORITY SYSTEM: Property Type Match (20 points)
    if (filters.type && filters.type !== '') {
      if (property.type === filters.type) {
        score += 20;
        matchReasons.push(`Same property type (${property.type})`);
      } else {
        // Partial compatibility for similar types
        const typeCompatibility = getTypeCompatibility(filters.type, property.type);
        score += typeCompatibility;
        if (typeCompatibility > 10) {
          matchReasons.push(`Similar property type (${property.type})`);
        } else {
          differentReasons.push(`Different property type (${property.type})`);
        }
      }
    } else {
      score += 15; // No preference specified
      matchReasons.push('No property type preference');
    }

    // 🎯 PRIORITY SYSTEM: Gender Preference (25 points) - High Priority!
    if (filters.genderPreference && filters.genderPreference !== '') {
      if (property.preferredGender === filters.genderPreference) {
        score += 25; // Perfect match - same gender preference
        matchReasons.push(`Prefers ${property.preferredGender} tenants`);
      } else if (property.preferredGender === 'Any Gender' || !property.preferredGender) {
        score += 15; // Accepts any gender
        matchReasons.push('Accepts any gender');
      } else {
        score += 5; // Different gender preference - low priority
        differentReasons.push(`Prefers ${property.preferredGender} tenants`);
      }
    } else {
      score += 15; // No preference set
      matchReasons.push('No gender preference');
    }

    // 🎯 PRIORITY SYSTEM: Religious Preference (20 points)
    if (filters.religiousPreference && filters.religiousPreference !== '') {
      if (property.religiousPreference === filters.religiousPreference) {
        score += 20; // Perfect match
        matchReasons.push(`Prefers ${property.religiousPreference} tenants`);
      } else if (property.religiousPreference === 'Any Religion' || !property.religiousPreference) {
        score += 15; // Accepts any religion
        matchReasons.push('Accepts any religion');
      } else {
        score += 3; // Different religious preference
        differentReasons.push(`Prefers ${property.religiousPreference} tenants`);
      }
    } else {
      score += 15; // No preference set
      matchReasons.push('No religious preference');
    }

    // Budget Compatibility (20 points)
    const userMinPrice = parseInt(filters.minPrice) || 0;
    const userMaxPrice = parseInt(filters.maxPrice) || 10000;
    const propertyPrice = property.price || 0;

    if (propertyPrice >= userMinPrice && propertyPrice <= userMaxPrice) {
      score += 20; // Perfect budget match
      matchReasons.push(`Within budget (RM${propertyPrice})`);
    } else if (propertyPrice < userMinPrice) {
      score += 15; // Below budget - good deal
      matchReasons.push(`Below budget (RM${propertyPrice})`);
    } else {
      const overage = (propertyPrice - userMaxPrice) / userMaxPrice;
      const points = Math.max(3, 20 - overage * 20);
      score += points;
      if (points > 10) {
        matchReasons.push(`Slightly over budget (RM${propertyPrice})`);
      } else {
        differentReasons.push(`Over budget (RM${propertyPrice})`);
      }
    }

    // Smoking Preference (10 points)
    if (filters.smokingPreference && filters.smokingPreference !== '') {
      if (property.smokingPreference === filters.smokingPreference) {
        score += 10; // Perfect match
        matchReasons.push(`${property.smokingPreference} smoking policy`);
      } else if (property.smokingPreference === 'Any' || !property.smokingPreference) {
        score += 8; // Flexible policy
        matchReasons.push('Flexible smoking policy');
      } else {
        score += 3; // Different policy
        differentReasons.push(`${property.smokingPreference} smoking policy`);
      }
    } else {
      score += 8; // No preference set
      matchReasons.push('No smoking preference');
    }

    // Location Match (10 points)
    if (filters.location && filters.location !== '' && property.location) {
      if (property.location.toLowerCase().includes(filters.location.toLowerCase())) {
        score += 10; // Location match
        matchReasons.push(`Located in ${property.location}`);
      } else {
        score += 5; // Different location
        differentReasons.push(`Located in ${property.location}`);
      }
    } else {
      score += 8; // No location preference or missing data
      if (!property.location) matchReasons.push('Location not specified');
      else matchReasons.push('No location preference');
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

  // Helper function for property type compatibility
  const getTypeCompatibility = (userType, propertyType) => {
    const compatibilityMatrix = {
      'Single Room': {
        'Single Room': 20,
        'Shared Room': 8,
        'Studio': 5,
        'Apartment': 3,
        'House': 2
      },
      'Shared Room': {
        'Shared Room': 20,
        'Single Room': 8,
        'House': 6,
        'Apartment': 5,
        'Studio': 3
      },
      'Studio': {
        'Studio': 20,
        'Single Room': 6,
        'Apartment': 8,
        'Shared Room': 3,
        'House': 4
      },
      'Apartment': {
        'Apartment': 20,
        'Studio': 8,
        'House': 6,
        'Single Room': 4,
        'Shared Room': 3
      },
      'House': {
        'House': 20,
        'Apartment': 6,
        'Shared Room': 8,
        'Studio': 4,
        'Single Room': 3
      }
    };

    return compatibilityMatrix[userType]?.[propertyType] || 2;
  };

  const handleSearch = async () => {
    trackPropertySearch(filters);   // ← NEW LINE
    const hasAICriteria = filters.type || filters.genderPreference || filters.religiousPreference || filters.smokingPreference;
        // ✅ ADD THIS LINE TO TRACK LOCATION SEARCHES
  if (filters.location) {
    try {
      await fetch('http://localhost:3001/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'location_search',
          data: {
            location: filters.location,
            searchContext: 'property_search'
          }
        })
      });
    } catch (error) {
      console.log('Analytics tracking failed:', error);
    }
  }

  // ✅ TRACK PROPERTY SEARCH
  try {
    await fetch('http://localhost:3001/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'property_search',
        data: {
          location: filters.location || 'Any',
          minPrice: filters.minPrice || 0,
          maxPrice: filters.maxPrice || 10000,
          propertyType: filters.type || 'Any',
          genderPreference: filters.genderPreference || 'Any',
          religiousPreference: filters.religiousPreference || 'Any',
          smokingPreference: filters.smokingPreference || 'Any',
          hasAICriteria: !!(filters.genderPreference || filters.religiousPreference || filters.smokingPreference),
          filtersUsed: Object.values(filters).filter(value => 
            value !== '' && value !== null
          ).length
        }
      })
    });
  } catch (error) {
    console.log('Analytics tracking failed:', error);
  }


    if (hasAICriteria) {
      setAiMatching(true);
      
      try {
        // 🚀 AI MATCHING: Show ALL properties with compatibility scores
        // No filtering - let the AI scoring system handle everything
        const aiFilteredProperties = otherListings;

        const matchedProperties = aiFilteredProperties.map(property => {
          const compatibility = calculatePropertyCompatibility(property);
          return {
            ...property,
            aiMatchPercentage: compatibility.score,
            aiTooltip: compatibility.tooltip
          };
        });

        matchedProperties.sort((a, b) => (b.aiMatchPercentage || 0) - (a.aiMatchPercentage || 0));

        // Update only other listings with AI scores
        const updatedListings = [
          ...myListings,
          ...matchedProperties
        ];
        setListings(updatedListings);

        setSnackbar({
          open: true,
          message: `🤖 AI analyzed ${matchedProperties.length} properties! Showing all with compatibility scores.`,
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
        message: `Found ${filteredMyListings.length + displayListings.length} properties matching your criteria`,
        severity: 'info' 
      });
    }
  };

  const handleViewPropertyDetails = (property) => {
    setSelectedProperty(property);
    setPropertyDetailsOpen(true);
  };

  const handleRemoveFromDreamHomes = (propertyId) => {
    const newFavorites = favorites.filter(fav => fav._id !== propertyId);
    saveFavorites(newFavorites);
    
    setSnackbar({
      open: true,
      message: 'Removed from favorites',
      severity: 'info'
    });
  };

  const handleViewPropertyFromDrawer = (property) => {
    setSelectedProperty(property);
    setPropertyDetailsOpen(true);
    setDreamHomesOpen(false);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleRefresh = () => {
    fetchProperties();
    loadFavorites();
  };

  const handleImageClick = (listing) => {
    const photos = listing.photos || listing.images || [];
    if (photos.length > 0) {
      setSelectedListing(listing);
      setSelectedImageIndex(0);
    }
  };

  const handleCloseModal = () => {
    setSelectedListing(null);
    setSelectedImageIndex(0);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // 🔄 CLEAR ALL FILTERS AND AI RESULTS
  const handleClearFilters = () => {
    setFilters({
      location: '', minPrice: '', maxPrice: '', type: '',
      parkingRequired: '', wifiRequired: '', furnishingPreference: '', nearAmenities: '',
      genderPreference: '', religiousPreference: '', smokingPreference: ''
    });

    // Clear AI results by fetching fresh data
    fetchProperties();

    setSnackbar({
      open: true,
      message: 'All filters cleared! 🔄',
      severity: 'info'
    });
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      value !== '' && value !== null && 
      (Array.isArray(value) ? value.length > 0 : true)
    ).length;
  };

  const userFavorites = favorites.map(fav => fav._id);

  // Load favorites and fetch properties on component mount
  useEffect(() => {
    fetchProperties();
  }, []);

  // ✅ LOAD USER-SPECIFIC FAVORITES WHEN USER EMAIL IS AVAILABLE
  useEffect(() => {
    if (userEmail) {
      loadFavorites();
    }
  }, [userEmail]);

  return (
    <PageContainer>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h2" sx={{ 
          fontWeight: 800,
          background: 'linear-gradient(135deg, #6e8efb 0%, #a777e3 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 2
        }}>
          🏠 Property Listings
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 3 }}>
          Find your perfect student accommodation in Shah Alam
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          <Chip 
            label={`${myListings.length + otherListings.length} total properties`} 
            color="primary" 
            sx={{ fontSize: '1rem', py: 1, px: 2 }}
          />
          <Chip 
            label={`${myListings.length} your properties`} 
            color="secondary" 
            sx={{ fontSize: '1rem', py: 1, px: 2 }}
          />
          {favorites.length > 0 && (
            <Chip 
              icon={<BookmarkIcon />}
              label={`${favorites.length} in Dream Homes`} 
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

      {/* Filter section */}
      <Card sx={{ 
        p: 3, 
        mb: 3, 
        borderRadius: '20px',
        maxWidth: '1400px',
        mx: 'auto',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ 
            textAlign: 'center', 
            fontWeight: 600,
            color: '#6e8efb'
          }}>
            🔍 Search & AI Matching
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
              onClick={handleClearFilters}
              sx={{ borderRadius: '12px', color: '#ef4444', borderColor: '#ef4444' }}
            >
              Reset Filters
            </Button>
          </Box>
        </Box>
        
        {/* First row - Basic filters + Search button */}
        <Grid container spacing={2} sx={{ mb: 2, display: 'flex', alignItems: 'stretch' }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <FormControl fullWidth size="medium">
              <InputLabel>Location</InputLabel>
              <Select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                startAdornment={<LocationIcon sx={{ mr: 1, color: '#6e8efb' }} />}
                sx={{ 
                  borderRadius: '12px',
                  height: '56px',
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center'
                  }
                }}
              >
                <MenuItem value="">All Locations</MenuItem>
                <MenuItem value="Seksyen 1">Seksyen 1</MenuItem>
                <MenuItem value="Seksyen 2">Seksyen 2</MenuItem>
                <MenuItem value="Seksyen 6">Seksyen 6</MenuItem>
                <MenuItem value="Seksyen 7">Seksyen 7</MenuItem>
                <MenuItem value="Seksyen 8">Seksyen 8</MenuItem>
                <MenuItem value="Seksyen 9">Seksyen 9</MenuItem>
                <MenuItem value="Seksyen 10">Seksyen 10</MenuItem>
                <MenuItem value="Seksyen 13">Seksyen 13</MenuItem>
                <MenuItem value="Seksyen 24">Seksyen 24</MenuItem>
                <MenuItem value="Seksyen 25">Seksyen 25</MenuItem>
                <MenuItem value="Ken Rimba">Ken Rimba</MenuItem>
                <MenuItem value="i-City">i-City</MenuItem>
                <MenuItem value="Setia Alam">Setia Alam</MenuItem>
                <MenuItem value="Kota Kemuning">Kota Kemuning</MenuItem>
                <MenuItem value="Seksyen U1">Seksyen U1</MenuItem>
                <MenuItem value="Seksyen U2">Seksyen U2</MenuItem>
                <MenuItem value="Seksyen U16">Seksyen U16</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2.4}>
            <TextField
              fullWidth
              label="Min Price (RM)"
              type="number"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              placeholder="e.g., 300"
              InputProps={{
                startAdornment: <MoneyIcon sx={{ mr: 1, color: '#4caf50' }} />
              }}
              sx={{ 
                '& .MuiOutlinedInput-root': { 
                  borderRadius: '12px',
                  height: '56px'
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={2.4}>
            <TextField
              fullWidth
              label="Max Price (RM)"
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              placeholder="e.g., 1500"
              InputProps={{
                startAdornment: <MoneyIcon sx={{ mr: 1, color: '#f44336' }} />
              }}
              sx={{ 
                '& .MuiOutlinedInput-root': { 
                  borderRadius: '12px',
                  height: '56px'
                }
              }}
            />
          </Grid>
          
          {/* Property Type moved to AI Smart Matching Filters section */}
          {/* <Grid item xs={12} sm={6} md={2.4}>
            <FormControl fullWidth size="medium">
              <InputLabel>Property Type</InputLabel>
              <Select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                startAdornment={<HomeIcon sx={{ mr: 1, color: '#ff9800' }} />}
                sx={{ 
                  borderRadius: '12px',
                  height: '56px',
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center'
                  }
                }}
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="House">� House</MenuItem>
                <MenuItem value="Apartment">🏠 Apartment</MenuItem>
                <MenuItem value="Studio">🏢 Studio</MenuItem>
                <MenuItem value="Shared Room">👥 Shared Room</MenuItem>
                <MenuItem value="Single Room">🏠 Single Room</MenuItem>
              </Select>
            </FormControl>
          </Grid> */}
          
          <Grid item xs={12} sm={6} md={2.4}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSearch}
              disabled={aiMatching}
              startIcon={aiMatching ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
              sx={{ 
                height: '56px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6e8efb 0%, #a777e3 100%)',
                fontSize: '1rem',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #5c7cfa 0%, #9775fa 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(110, 142, 251, 0.4)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              {aiMatching ? 'AI Matching...' : 'Smart Search'}
            </Button>
          </Grid>
        </Grid>

        {/* Second row - Advanced AI filters */}
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle2" sx={{ mb: 2, color: '#6e8efb', fontWeight: 600 }}>
          🤖 AI Smart Matching Filters
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={2.4}>
            <FormControl fullWidth size="medium">
              <InputLabel>Property Type</InputLabel>
              <Select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                startAdornment={<HomeIcon sx={{ mr: 1, color: '#ff9800' }} />}
                sx={{
                  borderRadius: '12px',
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center'
                  }
                }}
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="House">🏠 House</MenuItem>
                <MenuItem value="Apartment">🏢 Apartment</MenuItem>
                <MenuItem value="Studio">🏠 Studio</MenuItem>
                <MenuItem value="Shared Room">👥 Shared Room</MenuItem>
                <MenuItem value="Single Room">🛏️ Single Room</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <FormControl fullWidth size="medium">
              <InputLabel>Gender Preference</InputLabel>
              <Select
                value={filters.genderPreference}
                onChange={(e) => handleFilterChange('genderPreference', e.target.value)}
                startAdornment={<PeopleIcon sx={{ mr: 1, color: '#e91e63' }} />}
                sx={{ 
                  borderRadius: '12px',
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center'
                  }
                }}
              >
                <MenuItem value="">Any Gender</MenuItem>
                <MenuItem value="Male Only">👨 Male Only</MenuItem>
                <MenuItem value="Female Only">👩 Female Only</MenuItem>
                <MenuItem value="Any Gender">👫 Any Gender</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2.4}>
            <FormControl fullWidth size="medium">
              <InputLabel>Religious Preference</InputLabel>
              <Select
                value={filters.religiousPreference}
                onChange={(e) => handleFilterChange('religiousPreference', e.target.value)}
                startAdornment={<GroupsIcon sx={{ mr: 1, color: '#9c27b0' }} />}
                sx={{ 
                  borderRadius: '12px',
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center'
                  }
                }}
              >
                <MenuItem value="">Any Religion</MenuItem>
                <MenuItem value="Muslim Only">🕌 Muslim Only</MenuItem>
                <MenuItem value="Non-Muslim Only">⛪ Non-Muslim Only</MenuItem>
                <MenuItem value="Any Religion">🌍 Any Religion</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2.4}>
            <FormControl fullWidth size="medium">
              <InputLabel>Smoking Policy</InputLabel>
              <Select
                value={filters.smokingPreference}
                onChange={(e) => handleFilterChange('smokingPreference', e.target.value)}
                startAdornment={<NoSmokingIcon sx={{ mr: 1, color: '#4caf50' }} />}
                sx={{ 
                  borderRadius: '12px',
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center'
                  }
                }}
              >
                <MenuItem value="">Any</MenuItem>
                <MenuItem value="Non-Smoker Only">🚭 Non-Smoker Only</MenuItem>
                <MenuItem value="Smoker Friendly">🚬 Smoker Friendly</MenuItem>
                <MenuItem value="Any">🌬️ Any</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2.4}>
            <FormControl fullWidth size="medium">
              <InputLabel>Furnishing</InputLabel>
              <Select
                value={filters.furnishingPreference}
                onChange={(e) => handleFilterChange('furnishingPreference', e.target.value)}
                startAdornment={<FurnishedIcon sx={{ mr: 1, color: '#ff9800' }} />}
                sx={{ 
                  borderRadius: '12px',
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center'
                  }
                }}
              >
                <MenuItem value="">Any Furnishing</MenuItem>
                <MenuItem value="Fully Furnished">🛋️ Fully Furnished</MenuItem>
                <MenuItem value="Partially Furnished">🪑 Partially Furnished</MenuItem>
                <MenuItem value="Unfurnished">📦 Unfurnished</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      {/* AI Explanation Card */}
      {showAIExplanation && (
        <AIExplanationCard sx={{ maxWidth: '1400px', mx: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AIIcon sx={{ fontSize: '2rem', color: '#6e8efb', mr: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
              🤖 AI Smart Matching Active
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
            Our AI has analyzed your preferences and ranked properties by compatibility.
            The percentage shows how well each property matches your criteria including:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Chip label="🏠 Property Type" size="small" sx={{ bgcolor: 'rgba(110, 142, 251, 0.1)' }} />
            <Chip label="👥 Tenant Preferences" size="small" sx={{ bgcolor: 'rgba(110, 142, 251, 0.1)' }} />
            <Chip label="💰 Budget Compatibility" size="small" sx={{ bgcolor: 'rgba(110, 142, 251, 0.1)' }} />
            <Chip label="📍 Location Match" size="small" sx={{ bgcolor: 'rgba(110, 142, 251, 0.1)' }} />
            <Chip label="🛋️ Property Features" size="small" sx={{ bgcolor: 'rgba(110, 142, 251, 0.1)' }} />
          </Box>
        </AIExplanationCard>
      )}

      {/* Loading State */}
      {loading ? (
        <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
          <Grid container spacing={3}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card sx={{ borderRadius: '20px' }}>
                  <Skeleton variant="rectangular" height={250} />
                  <CardContent>
                    <Skeleton variant="text" height={32} width="80%" />
                    <Skeleton variant="text" height={24} width="60%" />
                    <Skeleton variant="text" height={20} width="40%" />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        <>
          {/* 🔥 MY LISTINGS SECTION - NOW COLLAPSIBLE! */}
          <Box sx={{ maxWidth: '1400px', mx: 'auto', mb: 6 }}>
            <CollapsibleSectionHeader 
              isOwner={true}
              isCollapsed={myPropertiesCollapsed}
              onClick={() => setMyPropertiesCollapsed(!myPropertiesCollapsed)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonIcon sx={{ fontSize: '2rem', mr: 2 }} />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                      🧍 My Properties
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                      {filteredMyListings.length} {filteredMyListings.length === 1 ? 'property' : 'properties'} posted by you
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <AnalyticsIcon sx={{ fontSize: '1.5rem' }} />
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Total: {myListings.length}
                  </Typography>
                  {myPropertiesCollapsed ? <ExpandMoreIcon sx={{ fontSize: '2rem' }} /> : <ExpandLessIcon sx={{ fontSize: '2rem' }} />}
                </Box>
              </Box>
            </CollapsibleSectionHeader>

            <Collapse in={!myPropertiesCollapsed} timeout={800}>
              <CollapsibleContent sx={{ p: 3 }}>
                {filteredMyListings.length === 0 ? (
                  <Card sx={{ 
                    p: 6, 
                    textAlign: 'center', 
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, rgba(233, 30, 99, 0.05) 0%, rgba(240, 98, 146, 0.05) 100%)',
                    border: '2px dashed rgba(233, 30, 99, 0.2)'
                  }}>
                    <HomeIcon sx={{ fontSize: 64, color: '#e91e63', mb: 2, opacity: 0.5 }} />
                    <Typography variant="h5" sx={{ color: '#e91e63', mb: 1, fontWeight: 600 }}>
                      No properties posted yet
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#94a3b8', mb: 3 }}>
                      Start building your property portfolio by posting your first listing!
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => navigate('/post-property')}
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
                    >
                      Post Your First Property
                    </Button>
                  </Card>
                ) : (
                  <Grid container spacing={3}>
                    {filteredMyListings.map((listing) => (
                      <Grid item xs={12} md={6} lg={4} key={listing._id}>
                        <PropertyCard onClick={() => handleViewPropertyDetails(listing)}>
                          {/* Owner Badge */}
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
                             Your Property
                          </Box>
                          
                          {/* Property Image */}
                          <PropertyImage
                            listing={listing}
                            title={listing.title}
                            onClick={() => handleImageClick(listing)}
                            userFavorites={userFavorites}
                            onFavoriteToggle={toggleFavorite}
                          />
                          
                          <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                  {listing.title}
                                </Typography>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                  <LocationIcon sx={{ fontSize: '1rem', color: '#a777e3', mr: 0.5 }} />
                                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                                    {listing.location}
                                  </Typography>
                                </Box>
                              </Box>
                              
                              {/* ✅ EDIT/DELETE BUTTONS FOR OWN PROPERTIES */}
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(listing);
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
                                    handleDeleteProperty(listing._id);
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
                            
                            <ExpandableDescription description={listing.description} />
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                              <Typography variant="h5" sx={{ fontWeight: 700, color: '#e91e63' }}>
                                RM {listing.price}/month
                              </Typography>
                              
                              {listing.numberOfRooms && (
                                <Chip 
                                  icon={<RoomIcon />}
                                  label={`${listing.numberOfRooms} rooms`}
                                  size="small"
                                  sx={{ bgcolor: 'rgba(233, 30, 99, 0.1)', color: '#e91e63' }}
                                />
                              )}
                            </Box>
                            
                            {/* Property Features */}
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 2 }}>
                              {listing.furnishing && (
                                <Chip 
                                  label={listing.furnishing} 
                                  size="small" 
                                  sx={{ bgcolor: 'rgba(76, 175, 80, 0.1)', color: '#4caf50' }}
                                />
                              )}
                              {listing.parkingAvailability && (
                                <Chip 
                                  icon={<ParkingIcon />}
                                  label="Parking" 
                                  size="small" 
                                  sx={{ bgcolor: 'rgba(255, 152, 0, 0.1)', color: '#ff9800' }}
                                />
                              )}
                              {listing.preferredGender && (
                                <Chip 
                                  label={listing.preferredGender} 
                                  size="small" 
                                  sx={{ bgcolor: 'rgba(233, 30, 99, 0.1)', color: '#e91e63' }}
                                />
                              )}
                            </Box>

                            {/* Management Actions */}
                            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                  fullWidth
                                  variant="contained"
                                  startIcon={<EditIcon />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(listing);
                                  }}
                                  sx={{
                                    background: 'linear-gradient(135deg, #e91e63 0%, #f06292 100%)',
                                    borderRadius: '12px',
                                    '&:hover': {
                                      background: 'linear-gradient(135deg, #c2185b 0%, #e91e63 100%)',
                                    }
                                  }}
                                >
                                  Edit Property
                                </Button>
                              </Box>
                            </Box>
                          </CardContent>
                        </PropertyCard>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CollapsibleContent>
            </Collapse>
          </Box>

          {/* Divider */}
          <Divider sx={{ maxWidth: '1400px', mx: 'auto', my: 6 }} />

          {/* 🌍 OTHER USERS' LISTINGS SECTION - NOW COLLAPSIBLE! */}
          <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
            <CollapsibleSectionHeader 
              isOwner={false}
              isCollapsed={browsePropertiesCollapsed}
              onClick={() => setBrowsePropertiesCollapsed(!browsePropertiesCollapsed)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <GroupsIcon sx={{ fontSize: '2rem', mr: 2 }} />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                      🌍 Browse Properties
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                      {displayListings.length} {displayListings.length === 1 ? 'property' : 'properties'} {hasAIResults ? 'ranked by compatibility' : 'from other users'}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <SearchIcon sx={{ fontSize: '1.5rem' }} />
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Available: {otherListings.length}
                  </Typography>
                  {browsePropertiesCollapsed ? <ExpandMoreIcon sx={{ fontSize: '2rem' }} /> : <ExpandLessIcon sx={{ fontSize: '2rem' }} />}
                </Box>
              </Box>
            </CollapsibleSectionHeader>

            <Collapse in={!browsePropertiesCollapsed} timeout={800}>
              <CollapsibleContent sx={{ p: 3 }}>
                {displayListings.length === 0 ? (
                  <Card sx={{ 
                    p: 6, 
                    textAlign: 'center', 
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, rgba(110, 142, 251, 0.05) 0%, rgba(167, 119, 227, 0.05) 100%)',
                    border: '2px dashed rgba(110, 142, 251, 0.2)'
                  }}>
                    <SearchIcon sx={{ fontSize: 64, color: '#6e8efb', mb: 2, opacity: 0.5 }} />
                    <Typography variant="h5" sx={{ color: '#6e8efb', mb: 1, fontWeight: 600 }}>
                      No properties found
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#94a3b8', mb: 3 }}>
                      Try adjusting your search filters to find more properties
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={handleClearFilters}
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
                    {displayListings.map((listing) => (
                      <Grid item xs={12} md={6} lg={4} key={listing._id}>
                        <PropertyCard onClick={() => handleViewPropertyDetails(listing)}>
                          {/* AI Match Progress Bar */}
                          {listing.aiMatchPercentage && (
                            <PremiumMatchBar matchPercent={listing.aiMatchPercentage} />
                          )}
                          
                          {/* AI Match Percentage with Tooltip */}
                          {listing.aiMatchPercentage && (
                            <Tooltip
                              title={listing.aiTooltip || `${listing.aiMatchPercentage}% compatible`}
                              arrow
                              placement="top"
                            >
                              <Box>
                                <AnimatedPercentage
                                  targetPercent={listing.aiMatchPercentage}
                                  matchPercent={listing.aiMatchPercentage}
                                />
                              </Box>
                            </Tooltip>
                          )}
                          
                          {/* Property Image */}
                          <PropertyImage
                            listing={listing}
                            title={listing.title}
                            onClick={() => handleImageClick(listing)}
                            userFavorites={userFavorites}
                            onFavoriteToggle={toggleFavorite}
                          />
                          
                          <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                  {listing.title}
                                </Typography>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                  <LocationIcon sx={{ fontSize: '1rem', color: '#a777e3', mr: 0.5 }} />
                                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                                    {listing.location}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                            
                            <ExpandableDescription description={listing.description} />
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                              <Typography variant="h5" sx={{ fontWeight: 700, color: '#6e8efb' }}>
                                RM {listing.price}/month
                              </Typography>
                              
                              {listing.numberOfRooms && (
                                <Chip 
                                  icon={<RoomIcon />}
                                  label={`${listing.numberOfRooms} rooms`}
                                  size="small"
                                  sx={{ bgcolor: 'rgba(110, 142, 251, 0.1)', color: '#6e8efb' }}
                                />
                              )}
                            </Box>
                            
                            {/* Property Features */}
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 2 }}>
                              {listing.furnishing && (
                                <Chip 
                                  label={listing.furnishing} 
                                  size="small" 
                                  sx={{ bgcolor: 'rgba(76, 175, 80, 0.1)', color: '#4caf50' }}
                                />
                              )}
                              {listing.parkingAvailability && (
                                <Chip 
                                  icon={<ParkingIcon />}
                                  label="Parking" 
                                  size="small" 
                                  sx={{ bgcolor: 'rgba(255, 152, 0, 0.1)', color: '#ff9800' }}
                                />
                              )}
                              {listing.preferredGender && (
                                <Chip 
                                  label={listing.preferredGender} 
                                  size="small" 
                                  sx={{ bgcolor: 'rgba(233, 30, 99, 0.1)', color: '#e91e63' }}
                                />
                              )}
                            </Box>

                            {/* Browse Actions */}
                            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                              <Button
                                fullWidth
                                variant="contained"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewPropertyDetails(listing);
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
                        </PropertyCard>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CollapsibleContent>
            </Collapse>
          </Box>
        </>
      )}

      {/* Dream Homes FAB */}
      <DreamHomesFab onClick={() => setDreamHomesOpen(true)}>
        <Badge badgeContent={favorites.length} color="error">
          <BookmarkIcon />
        </Badge>
      </DreamHomesFab>

      {/* Dream Homes Drawer */}
      <DreamHomesDrawer
        open={dreamHomesOpen}
        onClose={() => setDreamHomesOpen(false)}
        dreamHomes={favorites}
        onRemove={handleRemoveFromDreamHomes}
        onViewProperty={handleViewPropertyFromDrawer}
      />

      {/* Property Details Modal */}
      <PropertyDetailsModal
        open={propertyDetailsOpen}
        onClose={() => setPropertyDetailsOpen(false)}
        property={selectedProperty}
      />

      {/* Image Modal */}
      <ImageModal
        open={!!selectedListing}
        onClose={handleCloseModal}
        photos={selectedListing?.photos || selectedListing?.images || []}
        initialIndex={selectedImageIndex}
      />

      {/* Snackbar */}
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
}
