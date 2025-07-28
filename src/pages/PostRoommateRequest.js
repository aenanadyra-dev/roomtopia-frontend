import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function PostRoommateRequest({ userEmail }) {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.editData;

  // ✅ USER PROFILE DATA - AUTO-POPULATED FROM PROFILE
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    religion: '',
    contactInfo: '',
    university: 'UiTM Shah Alam',
    faculty: '',
    year: '',
    bio: '',
    interests: [],
    smoking: false,
    studyHabits: '',
    cleanliness: '',
    socialLevel: '',
    roommateGender: 'No Preference',
    roommateReligion: 'Any Religion',
    roommateStudyHabits: 'Flexible',
    roommateCleanliness: 'Moderate',
    roommateSocialLevel: 'Balanced',
    roommateSmoker: false
  });

  // ✅ KEEP ONLY FOR PROFILE PICTURE FETCHING
  const [userProfile, setUserProfile] = useState({
    profilePicture: null
  });

  const [newInterest, setNewInterest] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ FETCH ONLY PROFILE PICTURE FOR ROOMMATE POST
  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/users/profile/${userEmail}`);
      if (response.ok) {
        const userData = await response.json();
        console.log('✅ User profile picture fetched for roommate post:', userData.profilePicture);

        setUserProfile({
          profilePicture: userData.profilePicture || null
        });
      } else {
        console.log('⚠️ Could not fetch user profile');
      }
    } catch (error) {
      console.error('❌ Error fetching user profile:', error);
    }
  };

  // ✅ FETCH PROFILE DATA ON COMPONENT MOUNT
  useEffect(() => {
    if (userEmail) {
      fetchUserProfile();
    }
  }, [userEmail]);

  // ✅ NEW: EDIT SUPPORT - Load existing data when editing
  useEffect(() => {
    if (editData) {
      console.log('🔧 Edit mode detected, loading roommate data:', editData);
      setFormData({
        name: editData.name || '',
        age: editData.age || '',
        gender: editData.gender || '',
        university: editData.university || 'UiTM Shah Alam',
        faculty: editData.faculty || '',
        year: editData.year || '',
        bio: editData.aboutMe?.description || '',
        interests: editData.interests || [],
        contactInfo: editData.contact || '',
        religion: editData.religion || '',
        smoking: editData.aboutMe?.smoker || false,
        studyHabits: editData.aboutMe?.studyHabits || '',
        cleanliness: editData.aboutMe?.cleanliness || '',
        socialLevel: editData.aboutMe?.socialLevel || '',
        roommateGender: editData.preferences?.gender || 'No Preference',
        roommateReligion: editData.preferences?.religion || 'Any Religion',
        roommateStudyHabits: editData.preferences?.studyHabits || 'Flexible',
        roommateCleanliness: editData.preferences?.cleanliness || 'Moderate',
        roommateSocialLevel: editData.preferences?.socialLevel || 'Balanced',
        roommateSmoker: editData.preferences?.smoker || false
      });
    }
  }, [editData]);

  const uitmFaculties = [
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

  const interestSuggestions = [
    'Studying', 'Cooking', 'Reading', 'Netflix', 'Sports', 'Gaming', 
    'Movies', 'Gym', 'Art', 'Music', 'Photography', 'Travel',
    'Programming', 'Tech', 'Coffee', 'Minimalism', 'Yoga', 'Dancing',
    'Hiking', 'Shopping', 'Anime', 'K-Drama', 'Football', 'Badminton'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addInterest = (interest) => {
    if (interest && !formData.interests.includes(interest)) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }));
      setNewInterest('');
    }
  };

  const removeInterest = (interestToRemove) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
    }));
  };

  // ✅ ENHANCED: EDIT/CREATE SUBMIT LOGIC
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      name: formData.name,
      age: Number(formData.age),
      gender: formData.gender,
      religion: formData.religion,
      contact: formData.contactInfo,
      university: formData.university,
      faculty: formData.faculty,
      year: formData.year,
      preferences: {
        gender: formData.roommateGender,
        religion: formData.roommateReligion,
        habits: formData.interests.slice(0, 3),
        cleanliness: formData.roommateCleanliness,
        socialLevel: formData.roommateSocialLevel,
        smoker: formData.roommateSmoker,
        studyHabits: formData.roommateStudyHabits || 'Flexible'
      },
      aboutMe: {
        description: formData.bio,
        studyHabits: formData.studyHabits,
        cleanliness: formData.cleanliness,
        socialLevel: formData.socialLevel,
        smoker: formData.smoking
      },
      interests: formData.interests,
      userEmail: userEmail || 'anonymous@student.uitm.edu.my',
      profilePicture: userProfile.profilePicture // ✅ ONLY ADD PROFILE PICTURE FROM PROFILE
    };

    if (!payload.name || !payload.age || !payload.gender || !payload.contact) {
      setSnackbar({ open: true, message: 'Please fill in all required fields!', severity: 'error' });
      return;
    }
    if (!payload.faculty || !payload.year) {
      setSnackbar({ open: true, message: 'Please complete your academic information!', severity: 'error' });
      return;
    }
    if (!payload.aboutMe.description || payload.aboutMe.description.length < 50) {
      setSnackbar({ open: true, message: 'Please write at least 50 characters about yourself!', severity: 'error' });
      return;
    }

    setIsSubmitting(true);
    try {
      // ✅ Dynamic endpoint and method based on edit mode
      const endpoint = editData
        ? `http://localhost:3001/api/roommate-requests/${editData._id}`
        : 'http://localhost:3001/api/roommate-requests';

      const method = editData ? 'PUT' : 'POST';
      
      console.log('🏠 Submitting roommate request with data:', payload);
      console.log('🔧 Edit mode:', !!editData);
      
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        const successMessage = editData 
          ? 'Your roommate request updated successfully! ✨🏠' 
          : 'Your roommate request has been posted successfully! 🎉';
          
        setSnackbar({ 
          open: true, 
          message: successMessage, 
          severity: 'success' 
        });
        
        // Reset form only if creating new (not editing)
        if (!editData) {
          setFormData({
            name: '', age: '', gender: '', university: 'UiTM Shah Alam',
            faculty: '', year: '', bio: '', interests: [], contactInfo: '', religion: '',
            smoking: false, studyHabits: '', cleanliness: '', socialLevel: '',
            roommateGender: 'No Preference', roommateReligion: 'Any Religion',
            roommateStudyHabits: 'Flexible', roommateCleanliness: 'Moderate',
            roommateSocialLevel: 'Balanced', roommateSmoker: false
          });
        }
        
        setTimeout(() => {
          navigate('/find-roomie');
        }, 2000);
      } else {
        setSnackbar({ 
          open: true, 
          message: data.error || 'Failed to save request', 
          severity: 'error' 
        });
      }
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: 'Network error. Please try again.', 
        severity: 'error' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e3f0ff 100%)',
      padding: '32px',
      fontFamily: 'Poppins, sans-serif'
    }}>
      <div style={{
        padding: '32px',
        maxWidth: '1000px',
        margin: '0 auto',
        borderRadius: '24px',
        background: 'white',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)'
      }}>
        {/* ✅ DYNAMIC TITLE BASED ON EDIT MODE */}
        <h1 style={{
          fontWeight: 800,
          background: 'linear-gradient(135deg, #6e8efb 0%, #a777e3 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center',
          marginBottom: '32px',
          fontSize: '2.5rem'
        }}>
          {editData ? '✏️ Edit Roommate Request' : '📝 Post Your Roommate Request'}
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <div style={{
            padding: '24px',
            borderRadius: '16px',
            background: 'rgba(110, 142, 251, 0.03)',
            border: '2px solid rgba(110, 142, 251, 0.1)',
            marginBottom: '24px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '20px',
              padding: '12px',
              borderRadius: '12px',
              background: 'rgba(110, 142, 251, 0.1)',
              justifyContent: 'center'
            }}>
              <h2 style={{
                color: '#6e8efb',
                fontWeight: 700,
                fontSize: '1.2rem',
                margin: 0
              }}>
                👤 Personal Information
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginBottom: '20px'
            }}>
              <input
                name="name"
                type="text"
                placeholder="Full Name *"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  padding: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontFamily: 'Poppins, sans-serif',
                  minHeight: '56px',
                  boxSizing: 'border-box'
                }}
              />
              <input
                name="age"
                type="number"
                placeholder="Age *"
                value={formData.age}
                onChange={handleChange}
                required
                style={{
                  padding: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontFamily: 'Poppins, sans-serif',
                  minHeight: '56px',
                  boxSizing: 'border-box'
                }}
              />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                style={{
                  padding: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontFamily: 'Poppins, sans-serif',
                  minHeight: '56px',
                  boxSizing: 'border-box',
                  background: 'white'
                }}
              >
                <option value="">Select Gender *</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <select
                name="religion"
                value={formData.religion}
                onChange={handleChange}
                style={{
                  padding: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontFamily: 'Poppins, sans-serif',
                  minHeight: '56px',
                  boxSizing: 'border-box',
                  background: 'white'
                }}
              >
                <option value="">Select Religion</option>
                <option value="Islam">Islam</option>
                <option value="Christianity">Christianity</option>
                <option value="Buddhism">Buddhism</option>
                <option value="Hinduism">Hinduism</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <input
              name="contactInfo"
              type="text"
              placeholder="Contact Info (Phone/WhatsApp/Telegram)"
              value={formData.contactInfo}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '16px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                fontFamily: 'Poppins, sans-serif',
                minHeight: '56px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Academic Information */}
          <div style={{
            padding: '24px',
            borderRadius: '16px',
            background: 'rgba(167, 119, 227, 0.03)',
            border: '2px solid rgba(167, 119, 227, 0.1)',
            marginBottom: '24px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '20px',
              padding: '12px',
              borderRadius: '12px',
              background: 'rgba(167, 119, 227, 0.1)',
              justifyContent: 'center'
            }}>
              <h2 style={{
                color: '#a777e3',
                fontWeight: 700,
                fontSize: '1.2rem',
                margin: 0
              }}>
                🎓 Academic Information
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '20px',
              marginBottom: '20px'
            }}>
              <input
                type="text"
                value="UiTM Shah Alam"
                disabled
                style={{
                  padding: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontFamily: 'Poppins, sans-serif',
                  minHeight: '56px',
                  boxSizing: 'border-box',
                  background: '#f5f5f5'
                }}
              />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: '20px'
            }}>
              <select
                name="faculty"
                value={formData.faculty}
                onChange={handleChange}
                required
                style={{
                  padding: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontFamily: 'Poppins, sans-serif',
                  minHeight: '56px',
                  boxSizing: 'border-box',
                  background: 'white'
                }}
              >
                <option value="">Select Faculty *</option>
                {uitmFaculties.map(faculty => (
                  <option key={faculty} value={faculty}>{faculty}</option>
                ))}
              </select>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                style={{
                  padding: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontFamily: 'Poppins, sans-serif',
                  minHeight: '56px',
                  boxSizing: 'border-box',
                  background: 'white'
                }}
              >
                <option value="">Year *</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Final Year">Final Year</option>
              </select>
            </div>
          </div>

          {/* Lifestyle Preferences */}
          <div style={{
            padding: '24px',
            borderRadius: '16px',
            background: 'rgba(76, 175, 80, 0.03)',
            border: '2px solid rgba(76, 175, 80, 0.1)',
            marginBottom: '24px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '20px',
              padding: '12px',
              borderRadius: '12px',
              background: 'rgba(76, 175, 80, 0.1)',
              justifyContent: 'center'
            }}>
              <h2 style={{ 
                color: '#4caf50', 
                fontWeight: 700, 
                fontSize: '1.2rem',
                margin: 0
              }}>
                🏡 Lifestyle Preferences
              </h2>
            </div>
            
            <textarea
              name="bio"
              placeholder="Tell us about yourself, your hobbies, lifestyle, what you're looking for in a roommate..."
              value={formData.bio}
              onChange={handleChange}
              required
              rows={4}
              style={{
                width: '100%',
                padding: '16px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                fontFamily: 'Poppins, sans-serif',
                marginBottom: '20px',
                boxSizing: 'border-box',
                resize: 'vertical'
              }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '20px' }}>
              {formData.bio.length}/1000 characters (minimum 50 required)
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginBottom: '20px'
            }}>
              <select 
                name="studyHabits"
                value={formData.studyHabits}
                onChange={handleChange}
                style={{
                  padding: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontFamily: 'Poppins, sans-serif',
                  minHeight: '56px',
                  boxSizing: 'border-box',
                  background: 'white'
                }}
              >
                <option value="">Study Habits</option>
                <option value="Morning Person">Morning Person</option>
                <option value="Night Owl">Night Owl</option>
                <option value="Flexible">Flexible</option>
              </select>
              <select 
                name="cleanliness"
                value={formData.cleanliness}
                onChange={handleChange}
                style={{
                  padding: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontFamily: 'Poppins, sans-serif',
                  minHeight: '56px',
                  boxSizing: 'border-box',
                  background: 'white'
                }}
              >
                <option value="">Cleanliness Level</option>
                <option value="Very Clean">Very Clean</option>
                <option value="Moderate">Moderate</option>
                <option value="Relaxed">Relaxed</option>
              </select>
              <select 
                name="socialLevel"
                value={formData.socialLevel}
                onChange={handleChange}
                style={{
                  padding: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontFamily: 'Poppins, sans-serif',
                  minHeight: '56px',
                  boxSizing: 'border-box',
                  background: 'white'
                }}
              >
                <option value="">Social Level</option>
                <option value="Introvert">Introvert</option>
                <option value="Extrovert">Extrovert</option>
                <option value="Balanced">Balanced</option>
              </select>
            </div>
            
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              fontSize: '16px',
              color: '#4caf50'
            }}>
              <input
                type="checkbox"
                name="smoking"
                checked={formData.smoking}
                onChange={handleChange}
                style={{ transform: 'scale(1.2)' }}
              />
              I am a smoker
            </label>
          </div>

          {/* What I Seek in a Roommate */}
          <div style={{
            padding: '24px',
            borderRadius: '16px',
            background: 'rgba(255, 87, 34, 0.03)',
            border: '2px solid rgba(255, 87, 34, 0.1)',
            marginBottom: '24px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '20px',
              padding: '12px',
              borderRadius: '12px',
              background: 'rgba(255, 87, 34, 0.1)',
              justifyContent: 'center'
            }}>
              <h2 style={{ 
                color: '#ff5722', 
                fontWeight: 700, 
                fontSize: '1.2rem',
                margin: 0
              }}>
                👥 What I Seek in a Roommate
              </h2>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginBottom: '20px'
            }}>
              <select 
                name="roommateGender"
                value={formData.roommateGender}
                onChange={handleChange}
                style={{
                  padding: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontFamily: 'Poppins, sans-serif',
                  minHeight: '56px',
                  boxSizing: 'border-box',
                  background: 'white'
                }}
              >
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <select 
                name="roommateReligion"
                value={formData.roommateReligion}
                onChange={handleChange}
                style={{
                  padding: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontFamily: 'Poppins, sans-serif',
                  minHeight: '56px',
                  boxSizing: 'border-box',
                  background: 'white'
                }}
              >
                <option value="Any Religion">Any Religion</option>
                <option value="Islam">Islam</option>
                <option value="Christianity">Christianity</option>
                <option value="Buddhism">Buddhism</option>
                <option value="Hinduism">Hinduism</option>
              </select>
              <select 
                name="roommateStudyHabits"
                value={formData.roommateStudyHabits}
                onChange={handleChange}
                style={{
                  padding: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontFamily: 'Poppins, sans-serif',
                  minHeight: '56px',
                  boxSizing: 'border-box',
                  background: 'white'
                }}
              >
                <option value="">Study Habits</option>
                <option value="Morning Person">Morning Person</option>
                <option value="Night Owl">Night Owl</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginBottom: '20px'
            }}>
              <select 
                name="roommateCleanliness"
                value={formData.roommateCleanliness}
                onChange={handleChange}
                style={{
                  padding: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontFamily: 'Poppins, sans-serif',
                  minHeight: '56px',
                  boxSizing: 'border-box',
                  background: 'white'
                }}
              >
                <option value="">Cleanliness</option>
                <option value="Very Clean">Very Clean</option>
                <option value="Moderate">Moderate</option>
                <option value="Relaxed">Relaxed</option>
              </select>
              <select 
                name="roommateSocialLevel"
                value={formData.roommateSocialLevel}
                onChange={handleChange}
                style={{
                  padding: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontFamily: 'Poppins, sans-serif',
                  minHeight: '56px',
                  boxSizing: 'border-box',
                  background: 'white'
                }}
              >
                <option value="">Social Level</option>
                <option value="Introvert">Introvert</option>
                <option value="Extrovert">Extrovert</option>
                <option value="Balanced">Balanced</option>
              </select>
            </div>
            
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              fontSize: '16px',
              color: '#ff5722'
            }}>
              <input
                type="checkbox"
                name="roommateSmoker"
                checked={formData.roommateSmoker}
                onChange={handleChange}
                style={{ transform: 'scale(1.2)' }}
              />
              Accepts smoking roommates
            </label>
          </div>

          {/* Interests */}
          <div style={{
            padding: '24px',
            borderRadius: '16px',
            background: 'rgba(233, 30, 99, 0.03)',
            border: '2px solid rgba(233, 30, 99, 0.1)',
            marginBottom: '24px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '20px',
              padding: '12px',
              borderRadius: '12px',
              background: 'rgba(233, 30, 99, 0.1)',
              justifyContent: 'center'
            }}>
              <h2 style={{ 
                color: '#e91e63', 
                fontWeight: 700, 
                fontSize: '1.2rem',
                margin: 0
              }}>
                🎯 Interests & Hobbies
              </h2>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="Add Interest (e.g. Cooking)"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addInterest(newInterest);
                  }
                }}
                style={{
                  flex: 1,
                  padding: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontFamily: 'Poppins, sans-serif'
                }}
              />
              <button
                type="button"
                onClick={() => addInterest(newInterest)}
                disabled={!newInterest.trim()}
                style={{
                  padding: '16px 24px',
                  background: 'linear-gradient(135deg, #e91e63 0%, #9c27b0 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  cursor: newInterest.trim() ? 'pointer' : 'not-allowed',
                  opacity: newInterest.trim() ? 1 : 0.5
                }}
              >
                Add
              </button>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: '#e91e63' }}>Quick add:</strong>
            </div>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '8px', 
              marginBottom: '20px' 
            }}>
              {interestSuggestions.map(suggestion => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => addInterest(suggestion)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #e91e63',
                    background: 'white',
                    color: '#e91e63',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(233, 30, 99, 0.1)'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                >
                  {suggestion}
                </button>
              ))}
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: '#e91e63' }}>Your interests ({formData.interests.length}):</strong>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {formData.interests.map((interest, index) => (
                <div
                  key={index}
                  style={{
                    padding: '8px 12px',
                    background: '#e91e63',
                    color: 'white',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  {interest}
                  <button
                    type="button"
                    onClick={() => removeInterest(interest)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ✅ DYNAMIC SUBMIT BUTTON BASED ON EDIT MODE */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '20px',
              fontSize: '18px',
              fontWeight: 700,
              borderRadius: '16px',
              background: isSubmitting 
                ? '#ccc' 
                : editData
                ? 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)'
                : 'linear-gradient(135deg, #6e8efb 0%, #a777e3 100%)',
              color: 'white',
              border: 'none',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontFamily: 'Poppins, sans-serif',
              boxShadow: editData 
                ? '0 8px 25px rgba(255, 152, 0, 0.4)'
                : '0 8px 25px rgba(110, 142, 251, 0.4)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              if (!isSubmitting) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = editData
                  ? '0 12px 35px rgba(255, 152, 0, 0.6)'
                  : '0 12px 35px rgba(110, 142, 251, 0.6)';
              }
            }}
            onMouseOut={(e) => {
              if (!isSubmitting) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = editData
                  ? '0 8px 25px rgba(255, 152, 0, 0.4)'
                  : '0 8px 25px rgba(110, 142, 251, 0.4)';
              }
            }}
          >
            {isSubmitting 
              ? (editData ? 'Updating...' : 'Posting...') 
              : (editData ? '✏️ Update Roommate Request' : 'Post Roommate Request 🚀')
            }
          </button>

          {snackbar.open && (
            <div style={{
              position: 'fixed',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '16px 24px',
              background: snackbar.severity === 'success' ? '#4caf50' : '#f44336',
              color: 'white',
              borderRadius: '12px',
              zIndex: 1000,
              fontFamily: 'Poppins, sans-serif',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}>
              {snackbar.message}
              <button
                onClick={() => setSnackbar({...snackbar, open: false})}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  marginLeft: '10px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                ×
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}