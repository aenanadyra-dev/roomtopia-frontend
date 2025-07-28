import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container, 
  Paper,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Logo from '../assets/logoo.gif';

export default function MuiToolBar({ isAuthenticated, setIsAuthenticated, userEmail }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  
  // 📱 RESPONSIVE BREAKPOINTS
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const isTablet = useMediaQuery(theme.breakpoints.down('xl'));
  
  // 🔥 MOBILE MENU STATE
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/login');
    setMobileMenuOpen(false); // Close mobile menu on logout
  };

  const isLandingPage = location.pathname === '/';

  // 🎯 NAVIGATION ITEMS ARRAY FOR EASIER MANAGEMENT
  const navigationItems = [
    { 
      label: 'Home', 
      path: '/home', 
      icon: <HomeIcon />,
      gradient: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(63, 81, 181, 0.1) 100%)',
      border: 'rgba(33, 150, 243, 0.2)'
    },
    { 
      label: 'Find Roommate', 
      path: '/find-roomie', 
      icon: <PeopleIcon />,
      gradient: 'linear-gradient(135deg, rgba(110, 142, 251, 0.1) 0%, rgba(167, 119, 227, 0.1) 100%)',
      border: 'rgba(110, 142, 251, 0.2)'
    },
    { 
      label: 'Post Request', 
      path: '/post-roommate', 
      icon: <AddIcon />,
      gradient: 'linear-gradient(135deg, rgba(255, 182, 193, 0.1) 0%, rgba(221, 160, 221, 0.1) 100%)',
      border: 'rgba(255, 182, 193, 0.2)'
    },
    { 
      label: 'Properties', 
      path: '/property-listings', 
      icon: <BusinessIcon />,
      gradient: 'linear-gradient(135deg, rgba(128, 237, 153, 0.1) 0%, rgba(135, 206, 235, 0.1) 100%)',
      border: 'rgba(128, 237, 153, 0.2)'
    },
    { 
      label: 'Post Property', 
      path: '/post-property', 
      icon: <AddIcon />,
      gradient: 'linear-gradient(135deg, rgba(255, 217, 59, 0.1) 0%, rgba(255, 133, 27, 0.1) 100%)',
      border: 'rgba(255, 217, 59, 0.2)'
    },
    { 
      label: 'Profile', 
      path: '/profile', 
      icon: <PersonIcon />,
      gradient: 'linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(233, 30, 99, 0.1) 100%)',
      border: 'rgba(156, 39, 176, 0.2)'
    },
    { 
      label: 'Settings', 
      path: '/settings', 
      icon: <SettingsIcon />,
      gradient: 'linear-gradient(135deg, rgba(158, 158, 158, 0.1) 0%, rgba(117, 117, 117, 0.1) 100%)',
      border: 'rgba(158, 158, 158, 0.2)'
    }
  ];

  // 🎨 MOBILE DRAWER COMPONENT
  const MobileDrawer = () => (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100vw', sm: 350 },
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          pt: 2
        }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        px: 3,
        pb: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img src={Logo} alt="Logo" style={{ height: 145, marginRight: 12 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
            RoomTopia
          </Typography>
        </Box>
        <IconButton onClick={() => setMobileMenuOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Divider />
      
      <List sx={{ px: 2, py: 1 }}>
        {navigationItems.map((item) => (
          <ListItem
            key={item.path}
            component={Link}
            to={item.path}
            onClick={() => setMobileMenuOpen(false)}
            sx={{
              borderRadius: '12px',
              mb: 1,
              background: location.pathname === item.path ? item.gradient : 'transparent',
              border: location.pathname === item.path ? `1px solid ${item.border}` : 'none',
              '&:hover': {
                background: item.gradient,
                transform: 'translateX(8px)'
              },
              transition: 'all 0.3s ease',
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <ListItemIcon sx={{ 
              color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
              minWidth: 40
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.label}
              sx={{ 
                '& .MuiTypography-root': {
                  fontWeight: location.pathname === item.path ? 700 : 600,
                  color: location.pathname === item.path ? 'primary.main' : 'text.primary'
                }
              }}
            />
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ mt: 'auto', p: 3 }}>
        <Button
          fullWidth
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          variant="contained"
          sx={{ 
            background: 'linear-gradient(135deg, #FF69B4 0%, #9370DB 100%)',
            borderRadius: '12px',
            py: 1.5,
            fontWeight: 600,
            '&:hover': {
              background: 'linear-gradient(135deg, #FF1493 0%, #8A2BE2 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(255, 105, 180, 0.4)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          Log Out
        </Button>
        
        {userEmail && (
          <Typography variant="body2" sx={{ 
            textAlign: 'center', 
            mt: 2, 
            color: 'text.secondary',
            fontSize: '0.85rem'
          }}>
            👋 {userEmail}
          </Typography>
        )}
      </Box>
    </Drawer>
  );

  return (
    <>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          backgroundColor: 'transparent',
          backgroundImage: 'none',
          boxShadow: 'none',
          py: { xs: 1, md: 2 }
        }}
      >
        <Container maxWidth="xl">
          <Paper 
            elevation={4}
            sx={{
              borderRadius: { xs: '25px', md: '50px' },
              border: '1px solid rgba(0, 0, 0, 0.1)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              px: { xs: 2, md: 3 },
              py: { xs: 0.5, md: 1 },
              boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.12)',
              transition: 'all 0.3s ease'
            }}
          >
            <Toolbar disableGutters sx={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              minHeight: { xs: '56px', md: '64px' }
            }}>
              
              {/* 🎨 LOGO + BRAND NAME */}
              <Box 
                component={Link}
                to="/"
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  textDecoration: 'none',
                  flexShrink: 0
                }}
              >
                <img 
                  src={Logo} 
                  alt="Logo" 
                  style={{ 
                    height: isMobile ? 50 : 65, 
                    marginRight: 12 
                  }} 
                />
                <Typography
                  variant={isMobile ? "h6" : "h5"}
                  sx={{
                    fontWeight: 800,
                    fontFamily: '"Poppins", "Roboto", sans-serif',
                    background: 'linear-gradient(135deg, #FF69B4 0%, #9370DB 50%, #4169E1 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textDecoration: 'none',
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  RoomTopia
                </Typography>
              </Box>

              {/* 🖥️ DESKTOP NAVIGATION */}
              {!isLandingPage && !isMobile && (
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: { lg: 0.5, xl: 1 },
                  mx: 2,
                  flexGrow: 1,
                  justifyContent: 'center',
                  flexWrap: 'wrap'
                }}>
                  {navigationItems.map((item) => (
                    <Button 
                      key={item.path}
                      component={Link} 
                      to={item.path}
                      startIcon={item.icon}
                      sx={{ 
                        color: 'text.primary',
                        fontWeight: 600,
                        fontFamily: '"Poppins", "Roboto", sans-serif',
                        textTransform: 'none',
                        minWidth: 'auto',
                        fontSize: { lg: '0.85rem', xl: '0.9rem' },
                        px: { lg: 1.5, xl: 2 },
                        py: 0.5,
                        borderRadius: '25px',
                        background: location.pathname === item.path ? item.gradient : 'transparent',
                        border: location.pathname === item.path ? `1px solid ${item.border}` : 'none',
                        boxShadow: location.pathname === item.path ? 2 : 0,
                        '&:hover': {
                          background: item.gradient,
                          border: `1px solid ${item.border}`,
                          boxShadow: 4,
                          transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {isTablet ? '' : item.label}
                    </Button>
                  ))}
                </Box>
              )}

              {/* 🔐 AUTHENTICATION SECTION */}
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
                gap: 1
              }}>
                {isAuthenticated ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {/* 📱 MOBILE MENU BUTTON */}
                    {!isLandingPage && isMobile && (
                      <IconButton
                        onClick={() => setMobileMenuOpen(true)}
                        sx={{ 
                          bgcolor: 'rgba(110, 142, 251, 0.1)',
                          border: '1px solid rgba(110, 142, 251, 0.2)',
                          '&:hover': {
                            bgcolor: 'rgba(110, 142, 251, 0.2)',
                            transform: 'scale(1.05)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <MenuIcon sx={{ color: 'primary.main' }} />
                      </IconButton>
                    )}
                    
                    {/* 🖥️ DESKTOP LOGOUT */}
                    {!isMobile && (
                      <Button
                        startIcon={<LogoutIcon />}
                        onClick={handleLogout}
                        variant="contained"
                        sx={{ 
                          background: 'linear-gradient(135deg, #FF69B4 0%, #9370DB 100%)',
                          fontWeight: 600,
                          fontFamily: '"Poppins", "Roboto", sans-serif',
                          textTransform: 'none',
                          borderRadius: '25px',
                          px: 3,
                          py: 1,
                          boxShadow: '0 4px 20px rgba(255, 105, 180, 0.3)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #FF1493 0%, #8A2BE2 100%)',
                            boxShadow: '0 8px 30px rgba(255, 105, 180, 0.5)',
                            transform: 'translateY(-2px)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Log Out
                      </Button>
                    )}
                    
                    {/* 📱 MOBILE LOGOUT */}
                    {isMobile && (
                      <IconButton
                        onClick={handleLogout}
                        sx={{ 
                          bgcolor: 'rgba(255, 105, 180, 0.1)',
                          border: '1px solid rgba(255, 105, 180, 0.2)',
                          '&:hover': {
                            bgcolor: 'rgba(255, 105, 180, 0.2)',
                            transform: 'scale(1.05)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <LogoutIcon sx={{ color: '#FF69B4' }} />
                      </IconButton>
                    )}
                  </Box>
                ) : (
                  // 🔐 NOT AUTHENTICATED BUTTONS
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button 
                      component={Link} 
                      to="/login"
                      size={isMobile ? "small" : "medium"}
                      sx={{ 
                        color: 'text.primary',
                        fontWeight: 600,
                        fontFamily: '"Poppins", "Roboto", sans-serif',
                        textTransform: 'none',
                        borderRadius: '25px',
                        px: { xs: 2, md: 3 },
                        border: '1px solid rgba(110, 142, 251, 0.2)',
                        '&:hover': {
                          bgcolor: 'rgba(110, 142, 251, 0.1)',
                          transform: 'translateY(-2px)',
                          boxShadow: 3
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Login
                    </Button>
                    <Button 
                      variant="contained" 
                      component={Link} 
                      to="/register"
                      size={isMobile ? "small" : "medium"}
                      sx={{ 
                        background: 'linear-gradient(135deg, #6e8efb 0%, #a777e3 100%)',
                        fontWeight: 700,
                        fontFamily: '"Poppins", "Roboto", sans-serif',
                        textTransform: 'none',
                        borderRadius: '25px',
                        px: { xs: 2, md: 3 },
                        boxShadow: '0 4px 20px rgba(110, 142, 251, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5c7cfa 0%, #9775fa 100%)',
                          boxShadow: '0 8px 30px rgba(110, 142, 251, 0.5)',
                          transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Sign Up
                    </Button>
                  </Box>
                )}
              </Box>
            </Toolbar>
          </Paper>
        </Container>
      </AppBar>

      {/* 📱 MOBILE DRAWER */}
      <MobileDrawer />
    </>
  );
}