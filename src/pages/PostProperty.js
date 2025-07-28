import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Paper, Grid,
  FormControl, InputLabel, Select, MenuItem, Chip,
  IconButton, Snackbar, Alert, Card, CardMedia,
  LinearProgress, Container
} from '@mui/material';
import { 
  Add as AddIcon, 
  Close as CloseIcon, 
  PhotoCamera as PhotoIcon,
  Delete as DeleteIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  MeetingRoom as RoomIcon,
  Bathtub as BathIcon,
  LocalParking as ParkingIcon,
  Wifi as WifiIcon,
  AcUnit as AcIcon,
  Kitchen as KitchenIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const commonAmenities = [
  { name: 'WiFi', icon: <WifiIcon fontSize="small" /> },
  { name: 'Air Conditioning', icon: <AcIcon fontSize="small" /> },
  { name: 'Swimming Pool', icon: <BathIcon fontSize="small" /> },
  { name: 'Parking', icon: <ParkingIcon fontSize="small" /> },
  { name: 'Kitchen', icon: <KitchenIcon fontSize="small" /> },
  { name: 'Furnished', icon: <HomeIcon fontSize="small" /> },
  { name: '24/7 Security', icon: <PersonIcon fontSize="small" /> }
];

export default function PostProperty({ userEmail }) {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.editData;
  
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    location: '',
    type: '',
    description: '',
    contact: '',
    amenities: [],
    photos: [],
    writtenDate: '',
    writtenTime: '',
    shareholderName: '',
    shareholderAddress: '',
    phoneNumber: '',
    shareContract: '',
    priceRate: '',
    numberOfRooms: '',
    rentalType: '',
    furnishing: '',
    parkingAvailability: '',
    preferredGender: '',
    religiousPreference: '',
    studentYearPreference: '',
    lifestylePreference: '',
    smokingPreference: '',
    studyHabitsPreference: ''
  });
  
  const [newAmenity, setNewAmenity] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [uploading, setUploading] = useState(false);
  const [photoPreviews, setPhotoPreviews] = useState([]);

  // ✅ NEW: EDIT SUPPORT - Load existing data when editing
  useEffect(() => {
    if (editData) {
      console.log('🔧 Edit mode detected, loading data:', editData);
      setFormData({
        title: editData.title || '',
        price: editData.price || '',
        location: editData.location || '',
        type: editData.type || '',
        description: editData.description || '',
        contact: editData.contact || '',
        amenities: editData.amenities || [],
        photos: editData.photos || [],
        writtenDate: editData.writtenDate || '',
        writtenTime: editData.writtenTime || '',
        shareholderName: editData.shareholderName || '',
        shareholderAddress: editData.shareholderAddress || '',
        phoneNumber: editData.phoneNumber || '',
        shareContract: editData.shareContract || '',
        priceRate: editData.priceRate || '',
        numberOfRooms: editData.numberOfRooms || '',
        rentalType: editData.rentalType || '',
        furnishing: editData.furnishing || '',
        parkingAvailability: editData.parkingAvailability || '',
        preferredGender: editData.preferredGender || '',
        religiousPreference: editData.religiousPreference || '',
        studentYearPreference: editData.studentYearPreference || '',
        lifestylePreference: editData.lifestylePreference || '',
        smokingPreference: editData.smokingPreference || '',
        studyHabitsPreference: editData.studyHabitsPreference || ''
      });

      // Load existing photos
      if (editData.photos && editData.photos.length > 0) {
        const newPreviews = editData.photos.map(url => ({ 
          url: url.startsWith('http') ? url : `http://localhost:3001${url}`
        }));
        setPhotoPreviews(newPreviews);
      }
    }
  }, [editData]);

  const handlePhotoUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;
    
    setUploading(true);
    
    try {
      const formDataUpload = new FormData();
      files.forEach(file => formDataUpload.append('photos', file));

      const response = await fetch('http://localhost:3001/api/properties/upload-photos', {
        method: 'POST',
        body: formDataUpload
      });

      const data = await response.json();

      if (data.success) {
        setFormData(prev => ({
          ...prev,
          photos: [...prev.photos, ...data.photos.map(photo => photo.url)]
        }));

        const newPreviews = data.photos.map(photo => ({
          url: `http://localhost:3001${photo.url}`,
          filename: photo.filename
        }));
        
        setPhotoPreviews(prev => [...prev, ...newPreviews]);
        setSnackbar({
          open: true,
          message: `Successfully uploaded ${data.photos.length} photos! 📸`,
          severity: 'success'
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to upload photos. Please try again.',
        severity: 'error'
      });
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, index) => index !== indexToRemove)
    }));
    setPhotoPreviews(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // ✅ ENHANCED: EDIT/CREATE SUBMIT LOGIC
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log('🏠 Submitting property with data:', formData);
      console.log('🔧 Edit mode:', !!editData);
      
      // ✅ Dynamic endpoint and method based on edit mode
      const endpoint = editData
        ? `http://localhost:3001/api/properties/${editData._id}`
        : 'http://localhost:3001/api/properties/user-submit';

      const method = editData ? 'PUT' : 'POST';
      
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          photos: formData.photos,
          userEmail,
          source: editData ? 'Edit Submission' : 'User Submission'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        const successMessage = editData 
          ? 'Property updated successfully! ✨🏠' 
          : 'Property posted successfully! 🏠📸';
          
        setSnackbar({ 
          open: true, 
          message: successMessage, 
          severity: 'success' 
        });
        
        // Reset form only if creating new (not editing)
        if (!editData) {
          setFormData({
            title: '', price: '', location: '', type: '', 
            description: '', contact: '', amenities: [], photos: [],
            writtenDate: '', writtenTime: '', shareholderName: '',
            shareholderAddress: '', phoneNumber: '', shareContract: '',
            priceRate: '', numberOfRooms: '', rentalType: '',
            furnishing: '', parkingAvailability: '',
            preferredGender: '', religiousPreference: '', studentYearPreference: '',
            lifestylePreference: '', smokingPreference: '', studyHabitsPreference: ''
          });
          setPhotoPreviews([]);
        }
        
        setTimeout(() => {
          navigate('/property-listings');
        }, 2000);
        
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: 'Error saving property: ' + error.message, 
        severity: 'error' 
      });
    }
  };

  const addAmenity = () => {
    if (newAmenity && !formData.amenities.includes(newAmenity)) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity]
      }));
      setNewAmenity('');
    }
  };

  const addCommonAmenity = (amenity) => {
    if (!formData.amenities.includes(amenity)) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenity]
      }));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3, pt: 10, fontFamily: '"Poppins", sans-serif' }}>
      <Paper sx={{ 
        p: 3, 
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.06)',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: '1px solid rgba(0, 0, 0, 0.05)'
      }}>
        {/* ✅ DYNAMIC TITLE BASED ON EDIT MODE */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ 
            background: 'linear-gradient(135deg, #6e8efb 0%, #a777e3 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 800,
            fontSize: { xs: '1.8rem', sm: '2rem', md: '2.2rem' },
            mb: 1,
            fontFamily: '"Poppins", sans-serif'
          }}>
            <HomeIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: 'inherit' }} />
            {editData ? '✏️ Edit Your Property' : 'Post Your Property'}
          </Typography>
          <Typography variant="body1" sx={{ 
            color: 'text.secondary', 
            fontWeight: 400,
            fontSize: '1rem',
            fontFamily: '"Poppins", sans-serif'
          }}>
            {editData ? 'Update your property information' : 'Share your property with potential tenants'}
          </Typography>
        </Box>
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            
            {/* SECTION 1: BASIC INFORMATION */}
            <Grid item xs={12} lg={6}>
              <Paper sx={{ 
                p: 3, 
                borderRadius: '16px', 
                bgcolor: 'rgba(110, 142, 251, 0.03)',
                border: '2px solid rgba(110, 142, 251, 0.1)',
                height: '100%',
                minHeight: '480px'
              }}>
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  p: 2,
                  borderRadius: '12px',
                  bgcolor: 'rgba(110, 142, 251, 0.1)',
                  border: '1px solid rgba(110, 142, 251, 0.2)'
                }}>
                  <HomeIcon sx={{ mr: 1, color: '#6e8efb', fontSize: '1.5rem' }} />
                  <Typography variant="h6" sx={{ 
                    color: '#6e8efb', 
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    fontFamily: '"Poppins", sans-serif'
                  }}>
                    Basic Information
                  </Typography>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 600, 
                        mb: 1, 
                        color: '#6e8efb',
                        fontSize: '0.9rem',
                        fontFamily: '"Poppins", sans-serif'
                      }}>
                        Property Title
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="e.g., Cozy Studio in Seksyen 7"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        required
                        size="small"
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: '10px',
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            fontFamily: '"Poppins", sans-serif'
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 600, 
                        mb: 1, 
                        color: '#6e8efb',
                        fontSize: '0.9rem',
                        fontFamily: '"Poppins", sans-serif'
                      }}>
                        Monthly Rent (RM)
                      </Typography>
                      <TextField
                        fullWidth
                        type="number"
                        placeholder="e.g., 1200"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        required
                        size="small"
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: '10px',
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            fontFamily: '"Poppins", sans-serif'
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 600, 
                        mb: 1, 
                        color: '#6e8efb',
                        fontSize: '0.9rem',
                        fontFamily: '"Poppins", sans-serif'
                      }}>
                        Property Type
                      </Typography>
                      <FormControl fullWidth required size="small">
                        <Select
                          value={formData.type}
                          onChange={(e) => setFormData({...formData, type: e.target.value})}
                          displayEmpty
                          sx={{ 
                            borderRadius: '10px',
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            fontFamily: '"Poppins", sans-serif'
                          }}
                        >
                          <MenuItem value="" disabled>Select property type</MenuItem>
                          <MenuItem value="House">House</MenuItem>
                          <MenuItem value="Apartment">Apartment</MenuItem>
                          <MenuItem value="Studio">Studio</MenuItem>
                          <MenuItem value="Shared Room">Shared Room</MenuItem>
                          <MenuItem value="Single Room">Single Room</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 600, 
                        mb: 1, 
                        color: '#6e8efb',
                        fontSize: '0.9rem',
                        fontFamily: '"Poppins", sans-serif'
                      }}>
                        Location
                      </Typography>
                      <FormControl fullWidth required size="small">
                        <Select
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          displayEmpty
                          sx={{ 
                            borderRadius: '10px',
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            fontFamily: '"Poppins", sans-serif'
                          }}
                        >
                          <MenuItem value="" disabled>Select location</MenuItem>
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
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 600, 
                        mb: 1, 
                        color: '#6e8efb',
                        fontSize: '0.9rem',
                        fontFamily: '"Poppins", sans-serif'
                      }}>
                        Property Description
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Describe your property in detail..."
                        multiline
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        required
                        size="small"
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: '10px',
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            fontFamily: '"Poppins", sans-serif'
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 600, 
                        mb: 1, 
                        color: '#6e8efb',
                        fontSize: '0.9rem',
                        fontFamily: '"Poppins", sans-serif'
                      }}>
                        Contact Information
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="e.g., 012-345-6789 or email@example.com"
                        value={formData.contact}
                        onChange={(e) => setFormData({...formData, contact: e.target.value})}
                        required
                        size="small"
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: '10px',
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            fontFamily: '"Poppins", sans-serif'
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            {/* SECTION 2: PROPERTY DETAILS */}
            <Grid item xs={12} lg={6}>
              <Paper sx={{ 
                p: 3, 
                borderRadius: '16px', 
                bgcolor: 'rgba(167, 119, 227, 0.03)',
                border: '2px solid rgba(167, 119, 227, 0.1)',
                height: '100%',
                minHeight: '480px'
              }}>
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  p: 2,
                  borderRadius: '12px',
                  bgcolor: 'rgba(167, 119, 227, 0.1)',
                  border: '1px solid rgba(167, 119, 227, 0.2)'
                }}>
                  <RoomIcon sx={{ mr: 1, color: '#a777e3', fontSize: '1.5rem' }} />
                  <Typography variant="h6" sx={{ 
                    color: '#a777e3', 
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    fontFamily: '"Poppins", sans-serif'
                  }}>
                    Property Details
                  </Typography>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 600, 
                        mb: 1, 
                        color: '#a777e3',
                        fontSize: '0.9rem',
                        fontFamily: '"Poppins", sans-serif'
                      }}>
                        Number of Rooms
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Select
                          value={formData.numberOfRooms}
                          onChange={(e) => setFormData({...formData, numberOfRooms: e.target.value})}
                          displayEmpty
                          sx={{ 
                            borderRadius: '10px',
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            fontFamily: '"Poppins", sans-serif'
                          }}
                        >
                          <MenuItem value="">Select rooms</MenuItem>
                          <MenuItem value="1">1 Room</MenuItem>
                          <MenuItem value="2">2 Rooms</MenuItem>
                          <MenuItem value="3">3 Rooms</MenuItem>
                          <MenuItem value="4">4+ Rooms</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 600, 
                        mb: 1, 
                        color: '#a777e3',
                        fontSize: '0.9rem',
                        fontFamily: '"Poppins", sans-serif'
                      }}>
                        Rental Type
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Select
                          value={formData.rentalType}
                          onChange={(e) => setFormData({...formData, rentalType: e.target.value})}
                          displayEmpty
                          sx={{ 
                            borderRadius: '10px',
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            fontFamily: '"Poppins", sans-serif'
                          }}
                        >
                          <MenuItem value="">Select type</MenuItem>
                          <MenuItem value="Room Only">Room Only</MenuItem>
                          <MenuItem value="Whole Unit">Whole Unit</MenuItem>
                          <MenuItem value="Shared Space">Shared Space</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 600, 
                        mb: 1, 
                        color: '#a777e3',
                        fontSize: '0.9rem',
                        fontFamily: '"Poppins", sans-serif'
                      }}>
                        Furnishing
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Select
                          value={formData.furnishing}
                          onChange={(e) => setFormData({...formData, furnishing: e.target.value})}
                          displayEmpty
                          sx={{ 
                            borderRadius: '10px',
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            fontFamily: '"Poppins", sans-serif'
                          }}
                        >
                          <MenuItem value="">Select furnishing</MenuItem>
                          <MenuItem value="Fully Furnished">Fully Furnished</MenuItem>
                          <MenuItem value="Partially Furnished">Partially Furnished</MenuItem>
                          <MenuItem value="Unfurnished">Unfurnished</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 600, 
                        mb: 1, 
                        color: '#a777e3',
                        fontSize: '0.9rem',
                        fontFamily: '"Poppins", sans-serif'
                      }}>
                        Parking
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Select
                          value={formData.parkingAvailability}
                          onChange={(e) => setFormData({...formData, parkingAvailability: e.target.value})}
                          displayEmpty
                          sx={{ 
                            borderRadius: '10px',
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            fontFamily: '"Poppins", sans-serif'
                          }}
                        >
                          <MenuItem value="">Select parking</MenuItem>
                          <MenuItem value="Available">Available</MenuItem>
                          <MenuItem value="Not Available">Not Available</MenuItem>
                          <MenuItem value="Additional Cost">Additional Cost</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 600, 
                        mb: 1, 
                        color: '#a777e3',
                        fontSize: '0.9rem',
                        fontFamily: '"Poppins", sans-serif'
                      }}>
                        Owner Name
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Property owner's name"
                        value={formData.shareholderName}
                        onChange={(e) => setFormData({...formData, shareholderName: e.target.value})}
                        size="small"
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: '10px',
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            fontFamily: '"Poppins", sans-serif'
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 600, 
                        mb: 1, 
                        color: '#a777e3',
                        fontSize: '0.9rem',
                        fontFamily: '"Poppins", sans-serif'
                      }}>
                        Phone Number
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="e.g., 012-345-6789"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                        size="small"
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: '10px',
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            fontFamily: '"Poppins", sans-serif'
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 600, 
                        mb: 1, 
                        color: '#a777e3',
                        fontSize: '0.9rem',
                        fontFamily: '"Poppins", sans-serif'
                      }}>
                        Property Address
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Full property address"
                        multiline
                        rows={2}
                        value={formData.shareholderAddress}
                        onChange={(e) => setFormData({...formData, shareholderAddress: e.target.value})}
                        size="small"
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: '10px',
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            fontFamily: '"Poppins", sans-serif'
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* SECTION 3: TENANT PREFERENCES */}
            <Grid item xs={12}>
              <Paper sx={{ 
                p: 3, 
                borderRadius: '16px', 
                bgcolor: 'rgba(233, 30, 99, 0.03)',
                border: '2px solid rgba(233, 30, 99, 0.1)'
              }}>
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  p: 2,
                  borderRadius: '12px',
                  bgcolor: 'rgba(233, 30, 99, 0.1)',
                  border: '1px solid rgba(233, 30, 99, 0.2)'
                }}>
                  <PeopleIcon sx={{ mr: 1, color: '#e91e63', fontSize: '1.5rem' }} />
                  <Typography variant="h6" sx={{ 
                    color: '#e91e63', 
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    fontFamily: '"Poppins", sans-serif'
                  }}>
                    Tenant Preferences 
                  </Typography>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Box>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 600, 
                        mb: 1, 
                        color: '#e91e63',
                        fontSize: '0.9rem',
                        fontFamily: '"Poppins", sans-serif'
                      }}>
                        Gender Preference
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Select
                          value={formData.preferredGender}
                          onChange={(e) => setFormData({...formData, preferredGender: e.target.value})}
                          displayEmpty
                          sx={{ 
                            borderRadius: '10px',
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            fontFamily: '"Poppins", sans-serif'
                          }}
                        >
                          <MenuItem value="">Any Gender</MenuItem>
                          <MenuItem value="Male Only">Male Only</MenuItem>
                          <MenuItem value="Female Only">Female Only</MenuItem>
                          <MenuItem value="Any Gender">Any Gender</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}>
                    <Box>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 600, 
                        mb: 1, 
                        color: '#e91e63',
                        fontSize: '0.9rem',
                        fontFamily: '"Poppins", sans-serif'
                      }}>
                        Religious Preference
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Select
                          value={formData.religiousPreference}
                          onChange={(e) => setFormData({...formData, religiousPreference: e.target.value})}
                          displayEmpty
                          sx={{ 
                            borderRadius: '10px',
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            fontFamily: '"Poppins", sans-serif'
                          }}
                        >
                          <MenuItem value="">Any Religion</MenuItem>
                          <MenuItem value="Muslim Only">Muslim Only</MenuItem>
                          <MenuItem value="Non-Muslim Only">Non-Muslim Only</MenuItem>
                          <MenuItem value="Any Religion">Any Religion</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}>
                    <Box>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 600, 
                        mb: 1, 
                        color: '#e91e63',
                        fontSize: '0.9rem',
                        fontFamily: '"Poppins", sans-serif'
                      }}>
                        Student Year
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Select
                          value={formData.studentYearPreference}
                          onChange={(e) => setFormData({...formData, studentYearPreference: e.target.value})}
                          displayEmpty
                          sx={{ 
                            borderRadius: '10px',
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            fontFamily: '"Poppins", sans-serif'
                          }}
                        >
                          <MenuItem value="">Any Year</MenuItem>
                          <MenuItem value="1st Year Only">1st Year Only</MenuItem>
                          <MenuItem value="2nd Year Only">2nd Year Only</MenuItem>
                          <MenuItem value="3rd Year Only">3rd Year Only</MenuItem>
                          <MenuItem value="Final Year Only">Final Year Only</MenuItem>
                          <MenuItem value="Any Year">Any Year</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}>
                    <Box>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 600, 
                        mb: 1, 
                        color: '#e91e63',
                        fontSize: '0.9rem',
                        fontFamily: '"Poppins", sans-serif'
                      }}>
                        Lifestyle Preference
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Select
                          value={formData.lifestylePreference}
                          onChange={(e) => setFormData({...formData, lifestylePreference: e.target.value})}
                          displayEmpty
                          sx={{ 
                            borderRadius: '10px',
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            fontFamily: '"Poppins", sans-serif'
                          }}
                        >
                          <MenuItem value="">Any Lifestyle</MenuItem>
                          <MenuItem value="Quiet/Studious">Quiet/Studious</MenuItem>
                          <MenuItem value="Social/Active">Social/Active</MenuItem>
                          <MenuItem value="Balanced">Balanced</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}>
                    <Box>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 600, 
                        mb: 1, 
                        color: '#e91e63',
                        fontSize: '0.9rem',
                        fontFamily: '"Poppins", sans-serif'
                      }}>
                        Smoking Policy
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Select
                          value={formData.smokingPreference}
                          onChange={(e) => setFormData({...formData, smokingPreference: e.target.value})}
                          displayEmpty
                          sx={{ 
                            borderRadius: '10px',
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            fontFamily: '"Poppins", sans-serif'
                          }}
                        >
                          <MenuItem value="">Any</MenuItem>
                          <MenuItem value="Non-Smoker Only">Non-Smoker Only</MenuItem>
                          <MenuItem value="Smoker Friendly">Smoker Friendly</MenuItem>
                          <MenuItem value="Any">Any</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}>
                    <Box>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 600, 
                        mb: 1, 
                        color: '#e91e63',
                        fontSize: '0.9rem',
                        fontFamily: '"Poppins", sans-serif'
                      }}>
                        Study Habits
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Select
                          value={formData.studyHabitsPreference}
                          onChange={(e) => setFormData({...formData, studyHabitsPreference: e.target.value})}
                          displayEmpty
                          sx={{ 
                            borderRadius: '10px',
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            fontFamily: '"Poppins", sans-serif'
                          }}
                        >
                          <MenuItem value="">Any Study Habits</MenuItem>
                          <MenuItem value="Early Bird">Early Bird</MenuItem>
                          <MenuItem value="Night Owl">Night Owl</MenuItem>
                          <MenuItem value="Flexible">Flexible</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* SECTION 4: AMENITIES */}
            <Grid item xs={12}>
              <Paper sx={{ 
                p: 3, 
                borderRadius: '16px', 
                bgcolor: 'rgba(76, 175, 80, 0.03)',
                border: '2px solid rgba(76, 175, 80, 0.1)'
              }}>
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  p: 2,
                  borderRadius: '12px',
                  bgcolor: 'rgba(76, 175, 80, 0.1)',
                  border: '1px solid rgba(76, 175, 80, 0.2)'
                }}>
                  <WifiIcon sx={{ mr: 1, color: '#4caf50', fontSize: '1.5rem' }} />
                  <Typography variant="h6" sx={{ 
                    color: '#4caf50', 
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    fontFamily: '"Poppins", sans-serif'
                  }}>
                    Amenities & Features
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ 
                    fontWeight: 600, 
                    mb: 2, 
                    color: '#4caf50',
                    fontSize: '0.9rem',
                    fontFamily: '"Poppins", sans-serif'
                  }}>
                    Quick Add Common Amenities:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {commonAmenities.map((amenity) => (
                      <Button
                        key={amenity.name}
                        variant={formData.amenities.includes(amenity.name) ? "contained" : "outlined"}
                        size="small"
                        startIcon={amenity.icon}
                        onClick={() => addCommonAmenity(amenity.name)}
                        sx={{
                          borderRadius: '20px',
                          textTransform: 'none',
                          fontSize: '0.8rem',
                          fontFamily: '"Poppins", sans-serif',
                          ...(formData.amenities.includes(amenity.name) && {
                            bgcolor: '#4caf50',
                            '&:hover': { bgcolor: '#45a049' }
                          })
                        }}
                      >
                        {amenity.name}
                      </Button>
                    ))}
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    fullWidth
                    placeholder="Add custom amenity..."
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    size="small"
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: '10px',
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        fontFamily: '"Poppins", sans-serif'
                      }
                    }}
                  />
                  <Button 
                    variant="contained" 
                    onClick={addAmenity}
                    sx={{ 
                      borderRadius: '10px',
                      bgcolor: '#4caf50',
                      '&:hover': { bgcolor: '#45a049' },
                      fontFamily: '"Poppins", sans-serif'
                    }}
                  >
                    <AddIcon />
                  </Button>
                </Box>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.amenities.map((amenity, index) => (
                    <Chip
                      key={index}
                      label={amenity}
                      onDelete={() => {
                        setFormData(prev => ({
                          ...prev,
                          amenities: prev.amenities.filter((_, i) => i !== index)
                        }));
                      }}
                      sx={{ 
                        bgcolor: 'rgba(76, 175, 80, 0.1)',
                        color: '#4caf50',
                        fontFamily: '"Poppins", sans-serif'
                      }}
                    />
                  ))}
                </Box>
              </Paper>
            </Grid>

            {/* SECTION 5: PHOTOS */}
            <Grid item xs={12}>
              <Paper sx={{ 
                p: 3, 
                borderRadius: '16px', 
                bgcolor: 'rgba(255, 152, 0, 0.03)',
                border: '2px solid rgba(255, 152, 0, 0.1)'
              }}>
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  p: 2,
                  borderRadius: '12px',
                  bgcolor: 'rgba(255, 152, 0, 0.1)',
                  border: '1px solid rgba(255, 152, 0, 0.2)'
                }}>
                  <PhotoIcon sx={{ mr: 1, color: '#ff9800', fontSize: '1.5rem' }} />
                  <Typography variant="h6" sx={{ 
                    color: '#ff9800', 
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    fontFamily: '"Poppins", sans-serif'
                  }}>
                    Property Photos
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<PhotoIcon />}
                      disabled={uploading}
                      sx={{ 
                        borderRadius: '12px',
                        borderColor: '#ff9800',
                        color: '#ff9800',
                        '&:hover': {
                          borderColor: '#f57c00',
                          bgcolor: 'rgba(255, 152, 0, 0.04)'
                        },
                        fontFamily: '"Poppins", sans-serif'
                      }}
                    >
                      {uploading ? 'Uploading...' : 'Upload Photos'}
                    </Button>
                  </label>
                  {uploading && <LinearProgress sx={{ mt: 2 }} />}
                </Box>
                
                {photoPreviews.length > 0 && (
                  <Grid container spacing={2}>
                    {photoPreviews.map((preview, index) => (
                      <Grid item xs={6} sm={4} md={3} key={index}>
                        <Card sx={{ position: 'relative', borderRadius: '12px' }}>
                          <CardMedia
                            component="img"
                            height="120"
                            image={preview.url}
                            alt={`Property ${index + 1}`}
                            sx={{ borderRadius: '12px' }}
                          />
                          <IconButton
                            onClick={() => removePhoto(index)}
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              bgcolor: 'rgba(255, 255, 255, 0.8)',
                              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' }
                            }}
                            size="small"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Paper>
            </Grid>

            {/* SUBMIT BUTTON */}
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    background: editData 
                      ? 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)'
                      : 'linear-gradient(135deg, #6e8efb 0%, #a777e3 100%)',
                    color: 'white',
                    py: 2,
                    px: 6,
                    borderRadius: '15px',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    fontFamily: '"Poppins", sans-serif',
                    boxShadow: '0 8px 25px rgba(110, 142, 251, 0.4)',
                    '&:hover': {
                      background: editData
                        ? 'linear-gradient(135deg, #f57c00 0%, #ef6c00 100%)'
                        : 'linear-gradient(135deg, #5c7cfa 0%, #9775fa 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 35px rgba(110, 142, 251, 0.5)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <HomeIcon sx={{ mr: 1 }} />
                  {editData ? '✏️ Update Property' : '🚀 Post Property'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ borderRadius: '12px', fontFamily: '"Poppins", sans-serif' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
