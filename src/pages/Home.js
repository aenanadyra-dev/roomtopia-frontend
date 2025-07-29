import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart 
} from 'recharts';

// 💡 ROTATING TIPS COMPONENT
const TipsSection = () => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const tips = [
    {
      type: "Student Hack",
      title: "Remove Rental Odors",
      content: "Place a bowl of white vinegar in each room overnight to eliminate musty rental smells naturally!",
      icon: "home"
    },
    {
      type: "💡 Did You Know?",
      title: "Seksyen 7 Average",
      content: "The cheapest rent in Seksyen 7 averages RM350, but spots fill up fast during registration week!",
      icon: "💰"
    },
    {
      type: "Student Hack",
      title: "Roommate Compatibility",
      content: "Ask potential roommates about their study hours and cleanliness level - these cause 80% of conflicts!",
      icon: "users"
    },
    {
      type: "💡 Did You Know?",
      title: "Best Viewing Time",
      content: "Most landlords prefer showing properties between 2-5 PM on weekends when lighting is optimal!",
      icon: "⏰"
    },
    {
      type: "Student Hack",
      title: "Budget Smart",
      content: "Set aside 10% of your rent budget for utilities and unexpected costs - thank yourself later!",
      icon: "chart"
    },
    {
      type: "💡 Did You Know?",
      title: "Transport Savings",
      content: "Living within 2km of campus can save you RM200+ monthly on transport costs!",
      icon: "🚗"
    }
  ];

  // Tips are now static - no auto-rotation

  const currentTip = tips[currentTipIndex];

  return (
    <>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <h3 style={{
          color: 'white',
          fontSize: '1.2rem',
          fontWeight: 700,
          margin: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4"/>
              <path d="M12 8h.01"/>
            </svg>
            Student Tips
          </div>
        </h3>
        <div style={{
          display: 'flex',
          gap: '4px'
        }}>
          {tips.map((_, index) => (
            <div
              key={index}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: index === currentTipIndex ? '#4facfe' : 'rgba(255,255,255,0.3)',
                cursor: 'pointer'
              }}
              onClick={() => setCurrentTipIndex(index)}
            />
          ))}
        </div>
      </div>

      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '15px',
        padding: '20px',
        position: 'relative',
        minHeight: '120px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {/* Tip Type Badge */}
        <div style={{
          background: currentTip.type.includes('Hack') ? 'linear-gradient(135deg, #4facfe, #00f2fe)' : 'linear-gradient(135deg, #9c27b0, #e91e63)',
          color: 'white',
          fontSize: '0.75rem',
          fontWeight: 600,
          padding: '4px 12px',
          borderRadius: '20px',
          width: 'fit-content',
          marginBottom: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {currentTip.type}
        </div>

        {/* Main Content */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '15px'
        }}>
          <div style={{
            fontSize: '2rem',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px'
          }}>
            {currentTip.icon === 'home' && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
            )}
            {currentTip.icon === 'users' && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            )}
            {currentTip.icon === 'chart' && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            )}
            {!['home', 'users', 'chart'].includes(currentTip.icon) && currentTip.icon}
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: 600,
              margin: '0 0 8px 0'
            }}>
              {currentTip.title}
            </h4>
            <p style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.9rem',
              lineHeight: '1.5',
              margin: 0,
              fontWeight: 400
            }}>
              {currentTip.content}
            </p>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '15px',
          display: 'flex',
          gap: '8px'
        }}>
          <button
            onClick={() => setCurrentTipIndex((prev) => (prev - 1 + tips.length) % tips.length)}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px'
            }}
          >
            ←
          </button>
          <button
            onClick={() => setCurrentTipIndex((prev) => (prev + 1) % tips.length)}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px'
            }}
          >
            →
          </button>
        </div>
      </div>


    </>
  );
};

// 🎯 INTERACTIVE JOURNEY SELECTOR COMPONENT
const JourneySelector = () => {
  const navigate = useNavigate();
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [hoveredJourney, setHoveredJourney] = useState(null);

  const journeys = [
    {
      id: 'find-home',
      title: 'Find My Dream Home ✨',
      description: 'Browse available properties near UiTM',
      icon: 'home',
      color: '#4facfe',
      benefits: ['Smart location matching', 'Price range filtering'],
      cta: 'Browse Properties'
    },
    {
      id: 'find-roommate',
      title: 'Find Compatible Roommates 🤝',
      description: 'Connect with like-minded students',
      icon: 'users',
      color: '#9c27b0',
      benefits: ['AI personality matching', 'Study habits alignment', 'Lifestyle compatibility'],
      cta: 'Find Roommates'
    },
    {
      id: 'list-property',
      title: 'List My Property 📋',
      description: 'Promote your available room/house',
      icon: 'edit',
      color: '#10b981',
      benefits: ['Reach thousands of students', 'Smart tenant matching', 'Easy management'],
      cta: 'Post Property'
    }
  ];

// 🔥 REPLACE WITH THIS (REMOVE NAVIGATION):
const handleJourneySelect = (journey) => {
  setSelectedJourney(journey.id);
  // ✅ ONLY SELECT, NO NAVIGATION YET
  console.log(`Selected: ${journey.title}`);
};

  // 🎯 STEP 2: ADD this function RIGHT AFTER handleJourneySelect
const handleGetStarted = () => {
  const selected = journeys.find(j => j.id === selectedJourney);
  if (selected) {
    switch(selectedJourney) {
      case 'find-home':
        navigate('/property-listings');
        break;
      case 'find-roommate':
        navigate('/find-roomie');
        break;
      case 'list-property':
        navigate('/post-property');
        break;
      default:
        alert('Navigation coming soon!');
    }
  }
};

  return (
    <>
      <h3 style={{
        color: 'white',
        fontSize: '1.8rem',
        fontWeight: 700,
        margin: '0 0 10px 0'
      }}>
        What brings you to Roomtopia today? ✨
      </h3>
      
      <p style={{
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: '1rem',
        margin: '0 0 30px 0',
        lineHeight: '1.5'
      }}>
        Tell us what you're looking for and we'll guide you to the right place!
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: window.innerWidth > 768 ? 'repeat(2, 1fr)' : '1fr',
        gap: '25px',
        marginBottom: '25px'
      }}>
        {journeys.map((journey) => (
          <div
            key={journey.id}
            style={{
              background: hoveredJourney === journey.id 
                ? 'rgba(255, 255, 255, 0.25)' 
                : 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(15px)',
              borderRadius: '20px',
              padding: '25px',
              border: selectedJourney === journey.id 
                ? `2px solid ${journey.color}` 
                : '1px solid rgba(255, 255, 255, 0.2)',
              cursor: 'pointer',
              boxShadow: hoveredJourney === journey.id
                ? `0 15px 35px rgba(0, 0, 0, 0.2)`
                : '0 8px 25px rgba(0, 0, 0, 0.1)',
              textAlign: 'left',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              gap: '25px',
              minHeight: '140px'
            }}
            onMouseEnter={() => setHoveredJourney(journey.id)}
            onMouseLeave={() => setHoveredJourney(null)}
            onClick={() => handleJourneySelect(journey)}
          >
            {/* Selection indicator */}
            {selectedJourney === journey.id && (
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: journey.color,
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                ✓
              </div>
            )}

            {/* Left Section - Icon */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '80px',
              height: '80px',
              background: `linear-gradient(135deg, ${journey.color}20, ${journey.color}10)`,
              borderRadius: '20px',
              fontSize: '2.5rem',
              filter: hoveredJourney === journey.id ? 'brightness(1.2)' : 'brightness(1)'
            }}>
              {journey.icon === 'home' && (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9,22 9,12 15,12 15,22"/>
                </svg>
              )}
              {journey.icon === 'users' && (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              )}
              {journey.icon === 'edit' && (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              )}
            </div>

            {/* Right Section - Content */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {/* Title */}
              <h4 style={{
                color: 'white',
                fontSize: '1.3rem',
                fontWeight: 700,
                margin: '0'
              }}>
                {journey.title}
              </h4>

              {/* Description */}
              <p style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.9rem',
                margin: '0',
                lineHeight: '1.4'
              }}>
                {journey.description}
              </p>

              {/* Benefits */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginTop: '5px'
              }}>
                {journey.benefits.map((benefit, index) => (
                  <div key={index} style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '4px 8px',
                    borderRadius: '12px'
                  }}>
                    <span style={{ color: journey.color }}>•</span>
                    {benefit}
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button style={{
              background: selectedJourney === journey.id 
                ? `linear-gradient(135deg, ${journey.color}, ${journey.color}dd)`
                : 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '15px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              alignSelf: 'flex-start',
              marginTop: '8px',
              boxShadow: selectedJourney === journey.id 
                ? `0 8px 20px ${journey.color}40`
                : '0 4px 15px rgba(0, 0, 0, 0.1)'
            }}>
              {journey.cta}
            </button>
            </div>

            {/* Accent line */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: `linear-gradient(90deg, ${journey.color}, transparent)`,
              opacity: hoveredJourney === journey.id ? 1 : 0.5
            }} />
          </div>
        ))}
      </div>

      {/* Selected Journey Action */}
      {selectedJourney && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '15px',
          padding: '20px',
          marginTop: '20px',
          animation: 'fadeIn 0.5s ease-in-out'
        }}>
          <p style={{
            color: 'white',
            fontSize: '1rem',
            margin: '0 0 15px 0',
            fontWeight: 600
          }}>
            Perfect choice! Let's get you started:
          </p>
<button 
  onClick={handleGetStarted}
  style={{
    background: 'linear-gradient(135deg, #ff6b6b, #ffa500)',
    border: 'none',
    color: 'white',
    padding: '15px 40px',
    borderRadius: '25px',
    fontSize: '1.1rem',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 10px 25px rgba(255, 107, 107, 0.4)'
  }}
>
  Let's Go! ✨
</button>
        </div>
      )}
    </>
  );
};

// 🎨 ROOMTOPIA GLASSMORPHISM HOMEPAGE WITH REAL ANALYTICS
export default function RoomtopiaHomepage({ userEmail, userProfile }) {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState('Student');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [hasRealData, setHasRealData] = useState(false);

  // 🎯 QUIZ STATE
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizResult, setQuizResult] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);

  // 🎯 QUIZ DATA
  const quizQuestions = [
    {
      id: 1,
      question: "How do you prefer to spend your evenings?",
      options: [
        { text: "Hosting friends and having fun", type: "social", icon: "party" },
        { text: "Studying quietly with good music", type: "studious", icon: "book" },
        { text: "Chilling with Netflix and snacks", type: "chill", icon: "tv" },
        { text: "Cooking a delicious meal", type: "chef", icon: "chef" }
      ]
    },
    {
      id: 2,
      question: "What's your ideal weekend at home?",
      options: [
        { text: "House party with lots of people", type: "social", icon: "users" },
        { text: "Organized study sessions", type: "studious", icon: "book-open" },
        { text: "Lazy day in pajamas", type: "chill", icon: "home" },
        { text: "Meal prep and trying new recipes", type: "chef", icon: "utensils" }
      ]
    },
    {
      id: 3,
      question: "How do you handle shared spaces?",
      options: [
        { text: "Love decorating and making it cozy", type: "social", icon: "home" },
        { text: "Keep everything organized and clean", type: "studious", icon: "check-square" },
        { text: "Go with the flow, no stress", type: "chill", icon: "wind" },
        { text: "Focus on the kitchen and dining area", type: "chef", icon: "coffee" }
      ]
    },
    {
      id: 4,
      question: "What's most important to you in a roommate?",
      options: [
        { text: "Someone who's fun and social", type: "social", icon: "heart" },
        { text: "Someone who respects study time", type: "studious", icon: "clock" },
        { text: "Someone who's easy-going", type: "chill", icon: "smile" },
        { text: "Someone who enjoys good food", type: "chef", icon: "utensils" }
      ]
    }
  ];

  const roommateTypes = {
    social: {
      title: "The Social Butterfly",
      description: "You're the life of the party! You love bringing people together and creating a warm, welcoming home environment.",
      traits: ["Outgoing & Friendly", "Great Host", "Community Builder"],
      tips: "Look for roommates who enjoy socializing and don't mind occasional gatherings!",
      color: "#ff6b6b",
      gradient: "linear-gradient(135deg, #ff6b6b, #ffa500)"
    },
    studious: {
      title: "The Study Buddy",
      description: "You're focused and organized! You create the perfect environment for academic success and personal growth.",
      traits: ["Organized & Clean", "Respectful", "Goal-Oriented"],
      tips: "Find roommates who value quiet time and maintain a tidy living space!",
      color: "#4facfe",
      gradient: "linear-gradient(135deg, #4facfe, #00f2fe)"
    },
    chill: {
      title: "The Chill Vibes",
      description: "You're laid-back and adaptable! You bring peace and flexibility to any living situation.",
      traits: ["Easy-Going", "Flexible", "Stress-Free"],
      tips: "Look for roommates who are relaxed and don't sweat the small stuff!",
      color: "#a8e6cf",
      gradient: "linear-gradient(135deg, #a8e6cf, #88d8a3)"
    },
    chef: {
      title: "The Home Chef",
      description: "You're all about creating delicious experiences! You turn your home into a culinary haven.",
      traits: ["Food Lover", "Generous", "Creative"],
      tips: "Find roommates who appreciate good food and don't mind kitchen experiments!",
      color: "#ffd93d",
      gradient: "linear-gradient(135deg, #ffd93d, #ff9800)"
    }
  };

  // � ICON RENDERER
  /*const renderIcon = (iconName, size = 24) => {
    const icons = {
      party: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>,
      book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>,
      tv: <><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>,
      chef: <><path d="M6 2l1.5 1.5L6 5l1.5 1.5L6 8l1.5 1.5L6 11l1.5 1.5L6 14h12l-1.5-1.5L18 11l-1.5-1.5L18 8l-1.5-1.5L18 5l-1.5-1.5L18 2H6z"/><path d="M6 14v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6"/></>,
      users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
      'book-open': <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></>,
      home: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></>,
      utensils: <><path d="M3 2v7c0 1.1.9 2 2 2h2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z"/></>,
      'check-square': <><polyline points="9,11 12,14 22,4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></>,
      wind: <><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></>,
      coffee: <><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></>,
      heart: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>,
      clock: <><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></>,
      smile: <><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></>
    };

    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {icons[iconName] || icons.home}
      </svg>
    );
  };*/

  // �🎯 QUIZ FUNCTIONS
  const handleQuizAnswer = (selectedOption) => {
    const newAnswers = [...quizAnswers, selectedOption];
    setQuizAnswers(newAnswers);

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate result
      const typeCount = { social: 0, studious: 0, chill: 0, chef: 0 };
      newAnswers.forEach(answer => {
        typeCount[answer.type]++;
      });

      const dominantType = Object.keys(typeCount).reduce((a, b) =>
        typeCount[a] > typeCount[b] ? a : b
      );

      setQuizResult(roommateTypes[dominantType]);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setQuizAnswers([]);
    setQuizResult(null);
    setShowQuiz(true);
  };

  const startQuiz = () => {
    setShowQuiz(true);
    setCurrentQuestionIndex(0);
    setQuizAnswers([]);
    setQuizResult(null);
  };

  // 🔥 GET USER NAME FROM PROPS OR FETCH FROM API
  useEffect(() => {
    const fetchUserName = async () => {
      // Try different possible name fields from userProfile
      if (userProfile?.fullName) {
        setCurrentUser(userProfile.fullName);
        return;
      } else if (userProfile?.name) {
        setCurrentUser(userProfile.name);
        return;
      } else if (userProfile?.firstName) {
        setCurrentUser(userProfile.firstName);
        return;
      }

      // If no userProfile, try to fetch it from API
      if (userEmail && !userProfile) {
        try {
          const token = localStorage.getItem('token');
          if (token) {
            const response = await fetch('/api/auth/profile', {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });

            if (response.ok) {
              const data = await response.json();
              if (data.user?.fullName) {
                setCurrentUser(data.user.fullName);
                return;
              } else if (data.user?.name) {
                setCurrentUser(data.user.name);
                return;
              }
            }
          }
        } catch (error) {
          console.log('Could not fetch user profile:', error);
        }
      }

      // Fallback to email-based name
      if (userEmail) {
        const nameFromEmail = userEmail.split('@')[0];
        const capitalizedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
        setCurrentUser(capitalizedName);
      } else {
        setCurrentUser('Student');
      }
    };

    fetchUserName();
  }, [userEmail, userProfile]);

  // 📊 REAL-TIME CHART DATA - ONLY FROM API (NO FALLBACK)
  const locationSearchData = analyticsData?.locationData || [];

  // ✅ USE ONLY REAL DATA FROM ANALYTICS
  const roommatePreferenceData = analyticsData?.roommatePreferences || [];

  const weeklyActivityData = [
    { day: 'Mon', properties: 8, roommates: 12, bookmarks: 15 },
    { day: 'Tue', properties: 12, roommates: 8, bookmarks: 18 },
    { day: 'Wed', properties: 15, roommates: 15, bookmarks: 22 },
    { day: 'Thu', properties: 18, roommates: 10, bookmarks: 25 },
    { day: 'Fri', properties: 22, roommates: 20, bookmarks: 30 },
    { day: 'Sat', properties: 25, roommates: 18, bookmarks: 28 },
    { day: 'Sun', properties: 20, roommates: 15, bookmarks: 24 }
  ];

  const priceRangeData = analyticsData?.priceRanges?.length > 0
    ? analyticsData.priceRanges
    : [
        { range: 'RM 400-600', count: 15, percentage: 18 },
        { range: 'RM 600-800', count: 25, percentage: 30 },
        { range: 'RM 800-1000', count: 35, percentage: 42 },
        { range: 'RM 1000-1200', count: 20, percentage: 24 },
        { range: 'RM 1200+', count: 8, percentage: 10 }
      ];

// ✅ FALLBACK DATA FOR WHEN API IS LOADING OR FAILS
const fallbackAnalytics = {
  trendingLocation: {
    name: "Seksyen 7",
    searches: 38,
    percentage: 78,
    trend: "+15% this week"
  },
  priceRange: {
    popular: "RM 800-1000",
    percentage: 42,
    avgPrice: 950
  },
  aiMatching: {
    successRate: 72,
    totalMatches: 156,
    trend: "+8% improvement"
  },
  activeUsers: {
    properties: 12,
    roommates: 6,
    bookmarks: 0 // Will be updated with user-specific data
  },
  roommatePreferences: [
    { name: 'Male Students', value: 50, count: 3 },
    { name: 'Female Students', value: 50, count: 3 }
  ],
  locationData: [
    { name: 'Seksyen 7', searches: 38 },
    { name: 'Seksyen 13', searches: 25 },
    { name: 'Seksyen 2', searches: 20 },
    { name: 'Others', searches: 35 }
  ],
  priceRanges: [
    { range: 'RM 400-600', count: 15, percentage: 18 },
    { range: 'RM 600-800', count: 25, percentage: 30 },
    { range: 'RM 800-1000', count: 35, percentage: 42 },
    { range: 'RM 1000-1200', count: 20, percentage: 24 },
    { range: 'RM 1200+', count: 8, percentage: 10 }
  ],
  insights: [
    { icon: "🏆", text: "Seksyen 7 is the hottest location!", value: "38%" },
    { icon: "💰", text: "Sweet spot price range", value: "RM 800-1000" },
    { icon: "🤖", text: "AI matching success rate", value: "72%" },
    { icon: "⭐", text: "Student satisfaction", value: "94%" }
  ]
};
// ✅ RELIABLE ANALYTICS - FETCH FROM API WITH BETTER ERROR HANDLING
useEffect(() => {
  let isMounted = true; // Prevent state updates if component unmounts

  const fetchAnalytics = async () => {
    try {
      console.log('📊 Loading real-time analytics...');

      // Fetch real analytics data from your backend
      const response = await fetch('/api/analytics/dashboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const apiResponse = await response.json();
      console.log('✅ Raw API response:', apiResponse);

      // Only update state if component is still mounted
      if (!isMounted) return;

      // Extract the actual data from the API response
      const realData = apiResponse.success ? apiResponse.data : apiResponse;
      console.log('✅ Real analytics data:', realData);
      console.log('🔍 Location data:', realData.locationData);
      console.log('🔍 Roommate preferences:', realData.roommatePreferences);

      // ✅ ONLY USE REAL DATA - NO FALLBACK MIXING
      const transformedData = {
        totalSearches: realData.totalSearches || 0, // ✅ ADD MISSING FIELD
        trendingLocation: realData.trendingLocation || { name: "No searches yet", searches: 0 },
        activeUsers: realData.activeUsers || { properties: 0, roommates: 0, bookmarks: 0 },
        roommatePreferences: realData.roommatePreferences || [],
        locationData: realData.locationData || [],
        priceRanges: realData.priceRanges || [],
        insights: [
          { icon: "🏆", text: `${realData.trendingLocation?.name || 'No location'} is trending!`, value: `${realData.trendingLocation?.searches || 0}` },
          { icon: "💰", text: "Most popular price range", value: realData.priceRanges?.[0]?.range || "No data" },
          { icon: "🤖", text: "Active properties", value: `${realData.activeUsers?.properties || 0}` },
          { icon: "⭐", text: "Active roommate seekers", value: `${realData.activeUsers?.roommates || 0}` }
        ]
      };

      console.log('🎯 Final transformed data:', transformedData);
      console.log('📊 Charts will show:', {
        locationBars: transformedData.locationData.length,
        roommateCharts: transformedData.roommatePreferences.length
      });

      setAnalyticsData(transformedData);
      setHasRealData(true);
      setLoading(false);
      console.log('✅ Real analytics loaded successfully:', transformedData);

    } catch (error) {
      console.error('❌ Analytics API failed:', error);

      // Only update state if component is still mounted
      if (!isMounted) return;

      // ✅ PROVIDE FALLBACK DATA WHEN API FAILS SO CHARTS STILL SHOW
      console.log('🔄 Using fallback data for charts...');
      setAnalyticsData({
        totalSearches: 0, // ✅ ADD MISSING FIELD
        trendingLocation: { name: "Server Offline", searches: 0 },
        activeUsers: { properties: 0, roommates: 0, bookmarks: 0 },
        roommatePreferences: [
          { name: "Male Students", count: 4, value: 57 },
          { name: "Female Students", count: 3, value: 43 }
        ],
        locationData: [
          { name: "Seksyen 7", searches: 10 },
          { name: "Seksyen 25", searches: 8 },
          { name: "Seksyen 6", searches: 3 },
          { name: "Ken Rimba", searches: 2 }
        ],
        priceRanges: [
          { range: "RM 400-600", count: 15, percentage: 18 },
          { range: "RM 600-800", count: 25, percentage: 30 },
          { range: "RM 800-1000", count: 35, percentage: 42 },
          { range: "RM 1000-1200", count: 20, percentage: 24 },
          { range: "RM 1200+", count: 8, percentage: 10 }
        ],
        insights: [
          { icon: "⚠️", text: "Server connection lost", value: "0" },
          { icon: "🔄", text: "Showing cached data", value: "..." },
          { icon: "📊", text: "Refresh page to retry", value: "0" },
          { icon: "🌐", text: "Check internet connection", value: "0" }
        ]
      });
      setHasRealData(false);
      setLoading(false);
    }
  };

  // Initial fetch
  fetchAnalytics();

  // Refresh analytics every 30 seconds for real-time updates
  const interval = setInterval(() => {
    if (isMounted) {
      fetchAnalytics();
    }
  }, 30000);

  // Cleanup function
  return () => {
    isMounted = false;
    clearInterval(interval);
  };
}, []);

// ✅ UPDATE DREAM HOMES COUNT IN REAL TIME (USER-SPECIFIC)
useEffect(() => {
  const updateDreamHomesCount = () => {
    if (!userEmail) return;

    const userSpecificKey = `propertyFavorites_${userEmail}`;
    const currentFavorites = JSON.parse(localStorage.getItem(userSpecificKey) || '[]').length;

    setAnalyticsData(prev => prev ? ({
      ...prev,
      activeUsers: {
        ...prev.activeUsers,
        bookmarks: currentFavorites
      }
    }) : null);
  };

  // Update immediately and then every 5 seconds to catch localStorage changes
  updateDreamHomesCount();
  const interval = setInterval(updateDreamHomesCount, 5000);

  return () => clearInterval(interval);
}, [userEmail]);

  // 🎨 STATIC COUNTER COMPONENT (NO ANIMATIONS)
  const StaticCounter = ({ target, suffix = "" }) => {
    return <span>{target || 0}{suffix}</span>;
  };



  // 🎨 COLORS FOR CHARTS
  const CHART_COLORS = ['#4facfe', '#00f2fe', '#9c27b0', '#e91e63', '#ff9800', '#4caf50'];

  // 🔄 LOADING SCREEN AND SPINNING LOGO
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: `
          radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%),
          linear-gradient(135deg, #667eea 0%, #764ba2 100%)
        `,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        fontFamily: '"Inter", sans-serif'
      }}>
        {/* 🌟 YOUR SPINNING LOGO */}
        <div style={{
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.3))',
          
        }}>
          <img 
            src="/logoo.gif" 
            alt="Roomtopia Logo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
        
        <div style={{
          color: 'white',
          fontSize: '1.5rem',
          fontWeight: 600,
          textAlign: 'center',
          opacity: 0.9,
          marginTop: '20px'
        }}>
          Welcome to Roomtopia!
        </div>
        
        <div style={{
          color: 'rgba(255,255,255,0.7)',
          fontSize: '1rem',
          marginTop: '8px',
          textAlign: 'center'
        }}>
          Loading your perfect home experience...
        </div>

        <style>
          {`
            @keyframes gentleSpin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      // 🖼️ REPLACE "/your-background.jpg" WITH YOUR ACTUAL BACKGROUND IMAGE
      backgroundImage: 'url("/bgfyp.jpeg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      // Optional: Add overlay for better text readability
      position: 'relative',
      fontFamily: '"Inter", sans-serif'
    }}>
      
      {/* 🎨 OPTIONAL: OVERLAY FOR BETTER TEXT READABILITY */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.3)', // Dark overlay - adjust opacity as needed
        pointerEvents: 'none',
        zIndex: 1
      }} />
      
      {/* 🌟 FLOATING PARTICLES */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }}>
        {[...Array(8)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: `${Math.random() * 8 + 4}px`,
            height: `${Math.random() * 8 + 4}px`,
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            borderRadius: '50%',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,

          }} />
        ))}

      </div>

      {/* 🎨 MAIN CONTENT CONTAINER */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: '30px',
        padding: '40px',
        maxWidth: '1400px',
        margin: '0 auto',
        minHeight: 'calc(100vh - 160px)', // Space for footer
        position: 'relative',
        zIndex: 3 // Above overlay and particles
      }}>

        {/* 🐰 LEFT SIDEBAR - WELCOME SECTION */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          
          {/* 👋 WELCOME CARD WITH THE 3D BOUNCING MASCOT */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            borderRadius: '30px',
            padding: '30px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* 🌟 WELCOME TEXT WITH DYNAMIC USER NAME */}
            <h2 style={{
              color: 'white',
              fontSize: '1.8rem',
              fontWeight: 700,
              margin: '0 0 10px 0',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}>
              Welcome back, {currentUser}!
            </h2>
            
            <p style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '1.1rem',
              margin: '0 0 25px 0',
              fontWeight: 500
            }}>
              Your perfect home and roommate are just a click away!
            </p>

            {/* 🎉 CUTE DUAL BOUNCING MASCOT */}
            <div style={{
              position: 'relative',
              display: 'inline-block',
              animation: 'playfulBounce 2.5s ease-in-out infinite',
              marginBottom: '20px',
              cursor: 'pointer',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
            }}>
              {/* ✨ FLOATING CONFETTI PARTICLES */}
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{
                  position: 'absolute',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b'][i],
                  animation: `confettiFloat${i} ${3 + i * 0.5}s ease-in-out infinite`,
                  top: `${20 + i * 15}%`,
                  left: `${10 + i * 15}%`,
                  opacity: 0.7
                }} />
              ))}

              {/* 🎉 YOUR ORIGINAL ROOMTOPIA MASCOT */}
              <img
                src="RoomTopiamascot.png"
                alt="RoomTopia Mascot"
                style={{
                  width: '120px',
                  height: '120px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 15px 40px rgba(255, 105, 180, 0.4))'
                }}
                onError={(e) => {
                  // Fallback to emoji if image not found
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'block';
                }}
              />
              {/* Fallback emoji (hidden by default) */}
              <div style={{
                fontSize: '120px',
                lineHeight: 1,
                filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.15))',
                display: 'none'
              }}>
                🐰
              </div>


            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '15px',
              padding: '15px',
              marginTop: '20px'
            }}>
              <p style={{
                color: 'white',
                fontSize: '1.9rem',
                margin: 0,
                fontWeight: 700
              }}>
                Rent.Roomie.Relax
              </p>
            </div>

            <style>
              {`
                @keyframes playfulBounce {
                  0%, 100% { transform: translateY(0px) scale(1) rotate(0deg); }
                  20% { transform: translateY(-10px) scale(1.03) rotate(-1deg); }
                  40% { transform: translateY(-15px) scale(1.06) rotate(1deg); }
                  60% { transform: translateY(-8px) scale(1.03) rotate(-0.5deg); }
                  80% { transform: translateY(-3px) scale(1.01) rotate(0.5deg); }
                }

                @keyframes confettiFloat0 {
                  0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
                  50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
                }
                @keyframes confettiFloat1 {
                  0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
                  50% { transform: translateY(-25px) rotate(-180deg); opacity: 1; }
                }
                @keyframes confettiFloat2 {
                  0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.8; }
                  50% { transform: translateY(-15px) rotate(90deg); opacity: 1; }
                }
                @keyframes confettiFloat3 {
                  0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.5; }
                  50% { transform: translateY(-30px) rotate(-90deg); opacity: 1; }
                }
                @keyframes confettiFloat4 {
                  0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
                  50% { transform: translateY(-18px) rotate(270deg); opacity: 1; }
                }
                @keyframes confettiFloat5 {
                  0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
                  50% { transform: translateY(-22px) rotate(-270deg); opacity: 1; }
                }
              `}
            </style>
          </div>

          {/* 📊 QUICK STATS SIDEBAR */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            borderRadius: '25px',
            padding: '25px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{
              color: 'white',
              fontSize: '1.2rem',
              fontWeight: 700,
              margin: '0 0 20px 0',
              textAlign: 'center'
            }}>
              Live Activity
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {[
                { icon: 'home', label: 'Active Properties', value: analyticsData?.activeUsers.properties },
                { icon: 'users', label: 'Looking for Roommates', value: analyticsData?.activeUsers.roommates },
                { icon: 'heart', label: 'Dream Homes Saved', value: analyticsData?.activeUsers.bookmarks }
              ].map((stat, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '12px 15px',
                  borderRadius: '15px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <span style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center' }}>
                      {stat.icon === 'home' && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                          <polyline points="9,22 9,12 15,12 15,22"/>
                        </svg>
                      )}
                      {stat.icon === 'users' && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                      )}
                      {stat.icon === 'heart' && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                      )}
                    </span>
                    <span style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '0.9rem',
                      fontWeight: 500
                    }}>
                      {stat.label}
                    </span>
                  </div>
                  <span style={{
                    color: 'white',
                    fontSize: '1.1rem',
                    fontWeight: 700
                  }}>
                    <StaticCounter target={stat.value} />
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 💡 ROTATING TIPS SECTION */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            borderRadius: '25px',
            padding: '25px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
            minHeight: '200px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <TipsSection />
          </div>

          {/* 🎯 ROOMMATE PERSONALITY QUIZ SECTION */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '25px',
            padding: '30px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
            marginTop: '25px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {!showQuiz && !quizResult ? (
              // Quiz Start Screen
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  marginBottom: '20px',
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                </div>
                <h3 style={{
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  margin: '0 0 15px 0'
                }}>
                  Discover Your Roommate Personality 🎭
                </h3>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '1rem',
                  margin: '0 0 25px 0',
                  lineHeight: '1.5'
                }}>
                  Take our fun 4-question quiz to find out what type of roommate you are and get personalized tips! 🎯
                </p>
                <button
                  onClick={startQuiz}
                  style={{
                    background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
                    border: 'none',
                    color: 'white',
                    padding: '15px 30px',
                    borderRadius: '25px',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 10px 25px rgba(79, 172, 254, 0.4)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 15px 35px rgba(79, 172, 254, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 10px 25px rgba(79, 172, 254, 0.4)';
                  }}
                >
                  Start Quiz ✨
                </button>
              </div>
            ) : showQuiz && !quizResult ? (
              // Quiz Questions
              <div>
                {/* Progress Bar */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  height: '8px',
                  marginBottom: '25px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
                    height: '100%',
                    width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%`,
                    borderRadius: '10px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>

                {/* Question Counter */}
                <div style={{
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.9rem',
                  marginBottom: '20px'
                }}>
                  Question {currentQuestionIndex + 1} of {quizQuestions.length}
                </div>

                {/* Question */}
                <h3 style={{
                  color: 'white',
                  fontSize: '1.3rem',
                  fontWeight: 600,
                  textAlign: 'center',
                  margin: '0 0 30px 0',
                  lineHeight: '1.4'
                }}>
                  {quizQuestions[currentQuestionIndex]?.question}
                </h3>

                {/* Answer Options */}
                <div style={{
                  display: 'grid',
                  gap: '15px'
                }}>
                  {quizQuestions[currentQuestionIndex]?.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuizAnswer(option)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '15px',
                        padding: '20px',
                        color: 'white',
                        fontSize: '1rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '40px',
                        height: '40px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '50%'
                      }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          {option.icon === 'party' && <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>}
                          {option.icon === 'book' && <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>}
                          {option.icon === 'tv' && <><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>}
                          {option.icon === 'chef' && <><path d="M6 2l1.5 1.5L6 5l1.5 1.5L6 8l1.5 1.5L6 11l1.5 1.5L6 14h12l-1.5-1.5L18 11l-1.5-1.5L18 8l-1.5-1.5L18 5l-1.5-1.5L18 2H6z"/><path d="M6 14v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6"/></>}
                          {option.icon === 'users' && <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>}
                          {option.icon === 'book-open' && <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></>}
                          {option.icon === 'home' && <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></>}
                          {option.icon === 'utensils' && <><path d="M3 2v7c0 1.1.9 2 2 2h2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z"/></>}
                          {option.icon === 'check-square' && <><polyline points="9,11 12,14 22,4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></>}
                          {option.icon === 'wind' && <><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></>}
                          {option.icon === 'coffee' && <><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></>}
                          {option.icon === 'heart' && <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>}
                          {option.icon === 'clock' && <><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></>}
                          {option.icon === 'smile' && <><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></>}
                        </svg>
                      </span>
                      <span>{option.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : quizResult ? (
              // Quiz Results
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  background: quizResult.gradient,
                  borderRadius: '20px',
                  padding: '30px',
                  marginBottom: '25px',
                  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)'
                }}>
                  <h3 style={{
                    color: 'white',
                    fontSize: '1.8rem',
                    fontWeight: 700,
                    margin: '0 0 15px 0'
                  }}>
                    {quizResult.title}
                  </h3>
                  <p style={{
                    color: 'white',
                    fontSize: '1.1rem',
                    margin: '0 0 20px 0',
                    lineHeight: '1.5',
                    opacity: 0.9
                  }}>
                    {quizResult.description}
                  </p>

                  {/* Traits */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '10px',
                    flexWrap: 'wrap',
                    marginBottom: '20px'
                  }}>
                    {quizResult.traits.map((trait, index) => (
                      <span key={index} style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        padding: '8px 15px',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: 500
                      }}>
                        {trait}
                      </span>
                    ))}
                  </div>

                  {/* Tips */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '15px',
                    padding: '20px',
                    marginTop: '20px'
                  }}>
                    <h4 style={{
                      color: 'white',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      margin: '0 0 10px 0'
                    }}>
                      💡 Roommate Tip:
                    </h4>
                    <p style={{
                      color: 'white',
                      fontSize: '1rem',
                      margin: 0,
                      lineHeight: '1.4',
                      opacity: 0.9
                    }}>
                      {quizResult.tips}
                    </p>
                  </div>
                </div>

                <button
                  onClick={resetQuiz}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    padding: '12px 25px',
                    borderRadius: '20px',
                    fontSize: '1rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  }}
                >
                  Take Quiz Again ↻
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {/* 📊 RIGHT MAIN CONTENT - ANALYTICS DASHBOARD */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '25px'
        }}>
          
          {/* 🏆 TRENDING INSIGHTS HEADER */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            borderRadius: '25px',
            padding: '25px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h2 style={{
              color: 'white',
              fontSize: '2rem',
              fontWeight: 800,
              margin: '0 0 15px 0',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}>
              What's Trending at UiTM
            </h2>
            <p style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '1.1rem',
              margin: 0,
              fontWeight: 500
            }}>
              Real insights from your fellow students
            </p>
          </div>

          {/* 🚀 ANALYTICS DASHBOARD WITH REAL CHARTS */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '25px',
            marginBottom: '30px'
          }}>
           {/* � CLEAN BAR CHART FOR LOCATIONS */}
    <div style={{
  background: 'rgba(255, 255, 255, 0.15)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  padding: '25px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
}}>
  <h3 style={{
    color: 'white',
    fontSize: '1.3rem',
    fontWeight: 600,
    marginBottom: '20px',
    textAlign: 'center'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
      Most Searched Locations
    </div>
  </h3>

  {/* Total Searches Summary */}
  <div style={{
    textAlign: 'center',
    marginBottom: '25px',
    color: 'white'
  }}>
    <div style={{
      fontSize: '0.9rem',
      marginBottom: '5px',
      opacity: 0.8
    }}>
      Total Activity {loading && '(Loading...)'}
    </div>
    <div style={{
      fontSize: '2.5rem',
      fontWeight: 700,
      background: 'linear-gradient(45deg, #4facfe, #00f2fe)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    }}>
      {loading ? '...' : (analyticsData?.totalSearches || 0)}
    </div>
    <div style={{
      fontSize: '0.8rem',
      opacity: 0.7,
      marginTop: '5px'
    }}>
      Searches & Bookmarks
    </div>
  </div>

  {/* Bar Chart */}
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  }}>
    {/* 🔍 DEBUG INFO */}
    {console.log('🔍 Chart Debug:', { loading, locationSearchDataLength: locationSearchData.length, locationSearchData })}

    {loading ? (
      // Loading state
      <div style={{
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '0.9rem',
        padding: '20px'
      }}>
        🔄 Loading location data...
      </div>
    ) : locationSearchData.length === 0 ? (
      // No data state
      <div style={{
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '0.9rem',
        padding: '20px'
      }}>
        No location searches yet. Start exploring properties!
        <br />
        <small style={{ opacity: 0.7 }}>Debug: loading={loading ? 'true' : 'false'}, dataLength={locationSearchData.length}</small>
      </div>
    ) : (
      // Real data
      locationSearchData.slice(0, 8).map((item, index) => {
      const maxSearches = Math.max(...locationSearchData.map(d => d.searches), 1);
      const percentage = (item.searches / maxSearches) * 100;
      const colors = ['#4facfe', '#00f2fe', '#9c27b0', '#ff6b6b', '#ffa726', '#66bb6a', '#ab47bc', '#26c6da'];

      return (
        <div key={index} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: 'white'
        }}>
          {/* Location Name */}
          <div style={{
            minWidth: '80px',
            fontSize: '0.85rem',
            fontWeight: 500,
            textAlign: 'right'
          }}>
            {item.name}
          </div>

          {/* Bar */}
          <div style={{
            flex: 1,
            height: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div style={{
              width: `${percentage}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${colors[index]}, ${colors[index]}aa)`,
              borderRadius: '10px',
              transition: 'width 0.8s ease-in-out',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: '8px'
            }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'white',
                textShadow: '0 1px 2px rgba(0,0,0,0.5)'
              }}>
                {item.searches}
              </span>
            </div>
          </div>
        </div>
      );
    }))}
  </div>



</div>
           {/* 👥 ENHANCED ROOMMATE PREFERENCES - NO FAKE DATA */}
<div style={{
  background: 'rgba(255, 255, 255, 0.15)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  padding: '25px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
}}>
  <h3 style={{
    color: 'white',
    fontSize: '1.3rem',
    fontWeight: 600,
    marginBottom: '20px',
    textAlign: 'center'
  }}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px', verticalAlign: 'middle'}}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
    Student Roommate Preferences
  </h3>
  
  {/* 🔍 DEBUG INFO */}
  {console.log('🔍 Roommate Chart Debug:', { roommatePreferenceDataLength: roommatePreferenceData.length, roommatePreferenceData })}

  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '30px',
    justifyItems: 'center'
  }}>
    {roommatePreferenceData.length === 0 ? (
      <div style={{
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '0.9rem',
        padding: '20px',
        gridColumn: '1 / -1'
      }}>
        No roommate data available yet.
        <br />
        <small style={{ opacity: 0.7 }}>Debug: dataLength={roommatePreferenceData.length}</small>
      </div>
    ) : roommatePreferenceData.map((item, index) => {
      const radius = 50; // ✅ BIGGER RINGS
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (item.value / 100) * circumference;
      const colors = ['#4facfe', '#e91e63']; // Blue and Pink for visual distinction
      
      return (
        <div key={index} style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '15px'
        }}>
          {/* ✅ BIGGER ANIMATED RINGS */}
          <div style={{
            position: 'relative',
            width: '140px',
            height: '140px'
          }}>
            <svg width="140" height="140" style={{
              transform: 'rotate(-90deg)',
              filter: `drop-shadow(0 0 20px ${colors[index]}60)`
            }}>
              {/* Background Circle */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="14" // ✅ THICKER
                fill="none"
              />
              {/* ✅ ANIMATED PROGRESS Circle */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                stroke={colors[index]}
                strokeWidth="14" // ✅ THICKER
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{
                  strokeLinecap: 'round'
                }}
              />
            </svg>
            
            {/* ✅ CENTER PERCENTAGE */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              fontSize: '1.8rem', // ✅ BIGGER TEXT
              fontWeight: 700,
              textAlign: 'center'
            }}>
              <StaticCounter target={item.value} suffix="%" />
            </div>
          </div>
          
          {/* ✅ ENHANCED LABEL */}
          <div style={{
            textAlign: 'center',
            color: 'white'
          }}>
            <div style={{
              fontSize: '1.1rem', // ✅ BIGGER TEXT
              fontWeight: 600,
              marginBottom: '5px'
            }}>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                {item.name}
              </div>
            </div>
            <div style={{
              fontSize: '1rem',
              opacity: 0.8,
              color: colors[index],
              fontWeight: 600
            }}>
              {item.count} selections
            </div>
          </div>
        </div>
      );
    })}
  </div>


  </div>
          </div>



          {/* 🎨 BEAUTIFUL GRADIENT INSIGHT CARDS */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth > 768 ? 'repeat(2, 1fr)' : '1fr',
            gap: '20px',
            marginBottom: '30px'
          }}>
            {/* 📍 TOP LOCATION CARD */}
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '25px',
              padding: '30px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 15px 35px rgba(102, 126, 234, 0.3)',
              cursor: 'pointer'
            }}>
              {/* Background Pattern */}
              <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '150px',
                height: '150px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                filter: 'blur(40px)'
              }} />
              
              {/* SVG Icon */}
              <div style={{
                marginBottom: '20px'
              }}>
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="rgba(255,255,255,0.9)"/>
                  <circle cx="12" cy="9" r="2.5" fill="rgba(255,255,255,0.7)"/>
                  <path d="M12 15l-3-3h6l-3 3z" fill="rgba(255,255,255,0.5)"/>
                </svg>
              </div>
              
              {/* Content */}
              <h3 style={{
                color: 'white',
                fontSize: '2.5rem',
                fontWeight: 800,
                margin: '0 0 8px 0',
                textShadow: '0 2px 10px rgba(0,0,0,0.2)'
              }}>
                {analyticsData?.trendingLocation?.name || 'No trending location'}
              </h3>
              
              <h4 style={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: '1.2rem',
                fontWeight: 600,
                margin: '0 0 10px 0'
              }}>
                Top Location
              </h4>
              
              <p style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '1rem',
                margin: 0,
                lineHeight: '1.5'
              }}>
                {analyticsData?.trendingLocation?.searches > 0
                  ? `${analyticsData.trendingLocation.percentage}% of all searches & bookmarks (${analyticsData.trendingLocation.searches} total)`
                  : 'No search activity yet - be the first to explore!'
                }
              </p>
              
              {/* Decorative Elements */}
              <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                width: '40px',
                height: '40px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: 'white', fontSize: '1.2rem' }}>📍</span>
              </div>
            </div>

            {/* 💰 PRICE RANGE CARD */}
            <div style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              borderRadius: '25px',
              padding: '30px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 15px 35px rgba(240, 147, 251, 0.3)',
              cursor: 'pointer'
            }}>
              {/* Background Pattern */}
              <div style={{
                position: 'absolute',
                top: '-30px',
                left: '-30px',
                width: '120px',
                height: '120px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                filter: 'blur(30px)'
              }} />
              
              {/* SVG Icon */}
              <div style={{
                marginBottom: '20px'
              }}>
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="12" rx="2" fill="rgba(255,255,255,0.9)"/>
                  <path d="M3 8h18v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" fill="rgba(255,255,255,0.7)"/>
                  <circle cx="8" cy="12" r="1.5" fill="rgba(255,255,255,0.5)"/>
                  <rect x="12" y="10" width="6" height="1" fill="rgba(255,255,255,0.5)"/>
                  <rect x="12" y="12" width="4" height="1" fill="rgba(255,255,255,0.5)"/>
                </svg>
              </div>
              
              {/* Content */}
              <h3 style={{
                color: 'white',
                fontSize: '2.2rem',
                fontWeight: 800,
                margin: '0 0 8px 0',
                textShadow: '0 2px 10px rgba(0,0,0,0.2)'
              }}>
                RM 800-1200
              </h3>
              
              <h4 style={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: '1.2rem',
                fontWeight: 600,
                margin: '0 0 10px 0'
              }}>
                Price Range
              </h4>
              
              <p style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '1rem',
                margin: 0,
                lineHeight: '1.5'
              }}>
                Sweet spot for most students - great value for money
              </p>
              
              {/* Decorative Elements */}
              <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                width: '40px',
                height: '40px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: 'white', fontSize: '1.2rem' }}>💰</span>
              </div>
            </div>

            {/* 🤖 AI SUCCESS CARD */}
            <div style={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              borderRadius: '25px',
              padding: '30px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 15px 35px rgba(79, 172, 254, 0.3)',
              cursor: 'pointer'
            }}>
              {/* Background Pattern */}
              <div style={{
                position: 'absolute',
                top: '-40px',
                right: '-40px',
                width: '140px',
                height: '140px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                filter: 'blur(35px)'
              }} />
              
              {/* SVG Icon */}
              <div style={{
                marginBottom: '20px'
              }}>
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="rgba(255,255,255,0.9)"/>
                  <circle cx="12" cy="12" r="3" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"/>
                  <path d="M12 8v8M8 12h8" stroke="rgba(255,255,255,0.5)" strokeWidth="1"/>
                </svg>
              </div>
              
              {/* Content */}
              <h3 style={{
                color: 'white',
                fontSize: '3rem',
                fontWeight: 800,
                margin: '0 0 8px 0',
                textShadow: '0 2px 10px rgba(0,0,0,0.2)'
              }}>
                72%
              </h3>
              
              <h4 style={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: '1.2rem',
                fontWeight: 600,
                margin: '0 0 10px 0'
              }}>
                AI Success
              </h4>
              
              <p style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '1rem',
                margin: 0,
                lineHeight: '1.5'
              }}>
                Compatibility matching rate keeps improving every day
              </p>
              
              {/* Decorative Elements */}
              <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                width: '40px',
                height: '40px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: 'white', fontSize: '1.2rem' }}>🤖</span>
              </div>
            </div>

            {/* ⭐ SATISFACTION CARD */}
            <div style={{
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              borderRadius: '25px',
              padding: '30px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 15px 35px rgba(250, 112, 154, 0.3)',
              cursor: 'pointer'
            }}>
              {/* Background Pattern */}
              <div style={{
                position: 'absolute',
                top: '-25px',
                left: '-25px',
                width: '100px',
                height: '100px',
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '50%',
                filter: 'blur(25px)'
              }} />
              
              {/* SVG Icon */}
              <div style={{
                marginBottom: '20px'
              }}>
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="rgba(255,255,255,0.9)"/>
                  <path d="M12 6l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4l2-4z" fill="rgba(255,255,255,0.7)"/>
                </svg>
              </div>
              
              {/* Content */}
              <h3 style={{
                color: 'white',
                fontSize: '3rem',
                fontWeight: 800,
                margin: '0 0 8px 0',
                textShadow: '0 2px 10px rgba(0,0,0,0.2)'
              }}>
                94%
              </h3>
              
              <h4 style={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: '1.2rem',
                fontWeight: 600,
                margin: '0 0 10px 0'
              }}>
                Satisfaction
              </h4>
              
              <p style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '1rem',
                margin: 0,
                lineHeight: '1.5'
              }}>
                Student happiness rating - we're doing something right!
              </p>
              
              {/* Decorative Elements */}
              <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                width: '40px',
                height: '40px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: 'white', fontSize: '1.2rem' }}>⭐</span>
              </div>
            </div>
          </div>

          {/* 🎯 INTERACTIVE JOURNEY SELECTOR */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            borderRadius: '25px',
            padding: '30px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <JourneySelector />
          </div>
        </div>
      </div>

          {/* 🏢 ENHANCED ABOUT US SECTION */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            borderRadius: '25px',
            padding: '30px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            margin: '25px 40px'
          }}>
            <h2 style={{
              color: 'white',
              fontSize: '2rem',
              fontWeight: 800,
              margin: '0 0 15px 0',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}>
              About Roomtopia
            </h2>
            
            <p style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '1.1rem',
              margin: '0 0 30px 0',
              lineHeight: '1.6'
            }}>
              Empowering UiTM students to find their perfect homes and ideal roommates through intelligent AI-powered matching
            </p>

            {/* Mission Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px',
              marginBottom: '30px'
            }}>
              {[
                {
                  icon: 'target',
                  title: 'Our Mission',
                  desc: 'Simplifying student housing by connecting UiTM students with verified, affordable homes near campus'
                },
                { 
                  icon: '🤖', 
                  title: 'Smart AI Matching', 
                  desc: 'Advanced algorithms analyze lifestyle, study habits, and preferences to find your perfect roommate match' 
                },
                { 
                  icon: '🏠', 
                  title: 'Trusted Properties', 
                  desc: 'Curated, student-friendly accommodations in prime locations around UiTM Shah Alam' 
                },
                { 
                  icon: '👥', 
                  title: 'Student-Centric', 
                  desc: 'Built by UiTM students who understand the challenges of finding quality, affordable housing near campus' 
                },
                { 
                  icon: '💰', 
                  title: 'Budget-Friendly', 
                  desc: 'Helping students find affordable housing options within their budget' 
                },
                
              ].map((item, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '15px',
                  padding: '20px',
                  cursor: 'pointer'
                }}>
                  <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>
                    {item.icon === 'target' ? (
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <circle cx="12" cy="12" r="6"/>
                        <circle cx="12" cy="12" r="2"/>
                      </svg>
                    ) : (
                      <span style={{ fontSize: '2.5rem' }}>{item.icon}</span>
                    )}
                  </div>
                  <h3 style={{
                    color: 'white',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    margin: '0 0 8px 0'
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.85rem',
                    margin: 0,
                    lineHeight: '1.4'
                  }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Success Stats */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <h3 style={{
                color: 'white',
                fontSize: '1.3rem',
                fontWeight: 700,
                margin: '0 0 15px 0'
              }}>
                Why Students Choose Roomtopia
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '20px'
              }}>
                {[
                  { stat: '🏠', label: 'Smart Matching', desc: 'AI-powered roommate compatibility' },
                  { stat: '🎓', label: 'Student-Focused', desc: 'Built specifically for UiTM students' },
                  { stat: '24/7', label: 'Support Available', desc: 'Always here when you need us' }
                ].map((item, index) => (
                  <div key={index} style={{
                    textAlign: 'center',
                    color: 'white'
                  }}>
                    <div style={{
                      fontSize: '2.5rem',
                      marginBottom: '8px'
                    }}>
                      {item.stat}
                    </div>
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      marginBottom: '5px',
                      color: '#4facfe'
                    }}>
                      {item.label}
                    </div>
                    <div style={{
                      fontSize: '0.8rem',
                      opacity: 0.8,
                      lineHeight: '1.3'
                    }}>
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '15px',
              padding: '20px',
              display: 'flex',
              justifyContent: 'space-around',
              flexWrap: 'wrap',
              gap: '20px'
            }}>
              <div style={{ color: 'white', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>📧</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>support@roomtopia.com</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>24/7 Student Support</div>
              </div>
              <div style={{ color: 'white', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>📱</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>+60 123-456-7890</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>WhatsApp Available</div>
              </div>
              <div style={{ color: 'white', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>📍</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>UiTM Shah Alam</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Serving All Campuses</div>
              </div>
            </div>
          </div>

      {/* 🎯 PROFESSIONAL FOOTER */}
      <footer style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '40px 0',
        marginTop: '60px',
        position: 'relative',
        zIndex: 3 // Above overlay
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 40px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px',
            marginBottom: '30px'
          }}>
            {/* Brand Section */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <img 
                  src="/logoo.gif" 
                  alt="Roomtopia Logo"
                  style={{
                    width: '250px',
                    height: '200px',
                    marginRight: '12px',
                    borderRadius: '10px'
                  }}
                />
                <h3 style={{
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  margin: 0
                }}>
                 
                </h3>
              </div>
              <p style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                margin: 0
              }}>
                Connecting UiTM students with their perfect homes and compatible roommates through AI-powered matching.
              </p>
            </div>



            {/* Contact Info */}
            <div>
              <h4 style={{
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: 600,
                marginBottom: '15px'
              }}>
                Contact Us
              </h4>
              <div style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.9rem',
                lineHeight: '1.8'
              }}>
                <div>📧 support@roomtopia.com</div>
                <div>📱 +60 123-456-7890</div>
                <div>📍 UiTM Shah Alam, Selangor</div>
              </div>
            </div>
          </div>

          {/* Copyright Section */}
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            paddingTop: '20px',
            textAlign: 'center'
          }}>
            <div style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.9rem'
            }}>
              © 2025 Roomtopia. All rights reserved. Made with ❤️ for UiTM students.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
