import { Container, Box, Typography, Button, Stack, Fade, Chip, Card } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AutoAwesome, People, Security } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Static logo container - no animations
const LogoContainer = styled(Box)({
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
  }
});

const FeatureCard = styled(Card)(() => ({
  height: '100%',
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '16px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  }
}));

export default function Landing({ setIsAuthenticated }) {
  const navigate = useNavigate();

  return (
    <Box sx={{
      backgroundImage: 'url("bgfyp.jpeg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Overlay for better text readability */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        zIndex: 1,
      }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, py: 4 }}>
        {/* Main Content Card */}
        <Fade in={true} timeout={1000}>
          <Box sx={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
            borderRadius: '24px',
            p: { xs: 4, md: 6 },
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.15)',
            textAlign: 'center',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            maxWidth: '1000px',
            mx: 'auto',
            mt: 4,
          }}>

            {/* Static Logo - Big and Clear */}
            <LogoContainer sx={{ mb: 3 }}>
              <Box
                component="img"
                src="logoo.gif"
                alt="RoomTopia Logo"
                sx={{
                  width: '100%',
                  maxWidth: 400, // Made bigger
                  height: 'auto',
                  filter: 'drop-shadow(0 8px 25px rgba(0, 0, 0, 0.1))',
                }}
              />
            </LogoContainer>

            {/* Main Title - Better Visibility */}
            <Typography variant="h1" sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #FF1493 0%, #9370DB 50%, #4169E1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2.8rem', md: '4rem' },
              letterSpacing: '-0.02em',
              mb: 2,
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}>
              ROOMTOPIA
            </Typography>

            {/* Tagline */}
            <Typography variant="h5" sx={{
              color: '#2D3748',
              mb: 3,
              fontWeight: 600,
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              letterSpacing: '0.5px',
            }}>
              Find Your Perfect Room & Roommate
            </Typography>

            {/* UiTM Badge */}
            <Box sx={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'linear-gradient(135deg, #FF1493 0%, #9370DB 100%)',
              borderRadius: '50px',
              px: 4,
              py: 1.5,
              mb: 3,
              boxShadow: '0 4px 15px rgba(255, 20, 147, 0.3)',
            }}>
              <Typography sx={{
                color: 'white',
                fontWeight: 600,
                fontSize: { xs: '0.9rem', md: '1rem' },
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}>
                🎓 Specially Made for UiTM Shah Alam Students
              </Typography>
            </Box>

            {/* Description */}
            <Typography variant="body1" sx={{
              color: '#4A5568',
              mb: 4,
              fontSize: { xs: '1rem', md: '1.2rem' },
              lineHeight: 1.7,
              maxWidth: '700px',
              mx: 'auto'
            }}>
              Your perfect room hunt starts here! Connect with compatible roommates using our{' '}
              <Box component="span" sx={{ fontWeight: 700, color: '#9370DB' }}>
                AI-powered matching
              </Box>{' '}
              and discover amazing properties near campus. 🏠✨
            </Typography>

            {/* Optional: Mascot - you can remove this section if you don't want it */}
            {/*
            <Box sx={{ mb: 4 }}>
              <Box
                component="img"
                src="RoomTopiamascot.png"
                alt="RoomTopia Mascot"
                sx={{
                  width: '100%',
                  maxWidth: 80,
                  height: 'auto',
                  filter: 'drop-shadow(0 4px 15px rgba(0, 0, 0, 0.1))',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  }
                }}
                onClick={() => {
                  console.log('🐰 Welcome to RoomTopia!');
                }}
              />
            </Box>
            */}

            {/* Action Buttons */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={3}
              sx={{ justifyContent: 'center', mb: 5 }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  py: 2,
                  px: 5,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #FF1493 0%, #9370DB 50%, #4169E1 100%)',
                  color: 'white',
                  borderRadius: '15px',
                  boxShadow: '0 8px 25px rgba(255, 20, 147, 0.4)',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 15px 40px rgba(255, 20, 147, 0.5)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                🚀 Start Your Journey
              </Button>

              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  py: 2,
                  px: 5,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  borderColor: '#9370DB',
                  color: '#9370DB',
                  borderWidth: 2,
                  borderRadius: '15px',
                  '&:hover': {
                    borderColor: '#FF1493',
                    backgroundColor: 'rgba(255, 20, 147, 0.1)',
                    color: '#FF1493',
                    transform: 'translateY(-3px)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                ✨ Create Account
              </Button>
            </Stack>
          </Box>
        </Fade>

        {/* Features Section */}
        <Fade in={true} timeout={1500}>
          <Box sx={{ mt: 6 }}>
            <Typography variant="h4" sx={{
              textAlign: 'center',
              color: 'white',
              fontWeight: 700,
              mb: 5,
              fontSize: { xs: '2rem', md: '2.5rem' },
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
            }}>
              Why Choose RoomTopia?
            </Typography>

            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={4}
              sx={{ justifyContent: 'center', px: 2 }}
            >
              {/* AI Matching Feature */}
              <FeatureCard sx={{ maxWidth: 320 }}>
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <AutoAwesome sx={{
                    fontSize: 56,
                    color: '#FF1493',
                    mb: 2,
                    filter: 'drop-shadow(0 4px 12px rgba(255, 20, 147, 0.3))'
                  }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1a202c', fontSize: '1.3rem' }}>
                    AI Smart Matching
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#4a5568', lineHeight: 1.7, fontSize: '1rem' }}>
                    Our advanced AI analyzes your lifestyle and preferences to find your most compatible roommate match.
                  </Typography>
                </Box>
              </FeatureCard>

              {/* Community Feature */}
              <FeatureCard sx={{ maxWidth: 320 }}>
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <People sx={{
                    fontSize: 56,
                    color: '#9370DB',
                    mb: 2,
                    filter: 'drop-shadow(0 4px 12px rgba(147, 112, 219, 0.3))'
                  }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1a202c', fontSize: '1.3rem' }}>
                    Student Community
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#4a5568', lineHeight: 1.7, fontSize: '1rem' }}>
                    Connect with fellow UiTM students who share similar interests, study habits, and lifestyle preferences.
                  </Typography>
                </Box>
              </FeatureCard>

              {/* Security Feature */}
              <FeatureCard sx={{ maxWidth: 320 }}>
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Security sx={{
                    fontSize: 56,
                    color: '#4169E1',
                    mb: 2,
                    filter: 'drop-shadow(0 4px 12px rgba(65, 105, 225, 0.3))'
                  }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1a202c', fontSize: '1.3rem' }}>
                    Safe & Secure
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#4a5568', lineHeight: 1.7, fontSize: '1rem' }}>
                    Verified student profiles and secure messaging ensure a safe environment for finding your perfect room.
                  </Typography>
                </Box>
              </FeatureCard>
            </Stack>
          </Box>
        </Fade>

        {/* Bottom CTA Section */}
        <Fade in={true} timeout={2000}>
          <Box sx={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%)',
            backdropFilter: 'blur(15px)',
            borderRadius: '20px',
            p: 5,
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            mt: 6,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}>
            <Typography variant="h5" sx={{
              color: 'white',
              fontWeight: 700,
              mb: 3,
              fontSize: { xs: '1.3rem', md: '1.6rem' },
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            }}>
              Join the RoomTopia Community
            </Typography>

            <Stack
              direction="row"
              spacing={2}
              sx={{
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: 2,
                mb: 3
              }}
            >
              <Chip
                label="💰 Budget-Friendly"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.25)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  py: 2,
                  px: 1,
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.35)' }
                }}
              />
              <Chip
                label="🚌 Near Campus"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.25)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  py: 2,
                  px: 1,
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.35)' }
                }}
              />
              <Chip
                label="📚 Study-Friendly"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.25)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  py: 2,
                  px: 1,
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.35)' }
                }}
              />
              <Chip
                label="🎉 Like-Minded"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.25)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  py: 2,
                  px: 1,
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.35)' }
                }}
              />
            </Stack>

            <Typography variant="body1" sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '1.1rem',
              fontWeight: 500,
              textShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
            }}>
              Join thousands of UiTM students finding their perfect accommodation 🏡
            </Typography>
          </Box>
        </Fade>

      </Container>
    </Box>
  );
}