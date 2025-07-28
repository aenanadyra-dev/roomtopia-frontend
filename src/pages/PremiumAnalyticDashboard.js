// CLIENT SIDE: components/PremiumAnalyticsDashboard.js
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';

const PremiumAnalyticsDashboard = ({ mascot, animatedLogo }) => {
  const [propertyData, setPropertyData] = useState([]);
  const [roommateData, setRoommateData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sample data that will be replaced with real data
  const samplePropertyData = [
    { location: 'Seksyen 7', searches: 45 },
    { location: 'Seksyen 2', searches: 32 },
    { location: 'Seksyen 13', searches: 28 },
    { location: 'i-City', searches: 25 }
  ];

  const sampleRoommateData = [
    { gender: 'Female', searches: 65 },
    { gender: 'Male', searches: 45 },
    { gender: 'Any', searches: 20 }
  ];

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Try to fetch real data
        const [propertyRes, roommateRes] = await Promise.all([
          fetch('/api/analytics/popular-locations'),
          fetch('/api/analytics/roommate-trends')
        ]);

        const propertyRealData = await propertyRes.json();
        const roommateRealData = await roommateRes.json();

        // Use real data if available, otherwise use sample data
        setPropertyData(propertyRealData.length > 0 ? propertyRealData : samplePropertyData);
        setRoommateData(roommateRealData.length > 0 ? roommateRealData : sampleRoommateData);
      } catch (error) {
        // Fallback to sample data
        setPropertyData(samplePropertyData);
        setRoommateData(sampleRoommateData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="premium-dashboard">
      {/* Header with animated logo */}
      <motion.div 
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="animated-logo">
          {animatedLogo}
        </div>
        <h1>Premium Analytics Dashboard</h1>
        <div className="mascot-container">
          {mascot}
        </div>
      </motion.div>

      {/* Analytics Grid */}
      <div className="analytics-grid">
        {/* Property Analytics */}
        <motion.div 
          className="glass-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3>🏠 Most Searched Property Locations</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={propertyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="location" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(255,255,255,0.1)', 
                  border: 'none', 
                  borderRadius: '10px',
                  backdropFilter: 'blur(10px)'
                }} 
              />
              <Bar dataKey="searches" fill="url(#colorGradient)" />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Roommate Analytics */}
        <motion.div 
          className="glass-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3>👥 Roommate Search Preferences</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={roommateData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ gender, percent }) => `${gender} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="searches"
              >
                {roommateData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Summary Stats */}
        <motion.div 
          className="stats-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="stat-card glass-card">
            <h4>🔥 Hottest Location</h4>
            <p className="big-number">{propertyData[0]?.location || 'Seksyen 7'}</p>
          </div>
          <div className="stat-card glass-card">
            <h4>📊 Total Searches</h4>
            <p className="big-number">
              {propertyData.reduce((sum, item) => sum + item.searches, 0)}
            </p>
          </div>
          <div className="stat-card glass-card">
            <h4>👫 Popular Gender</h4>
            <p className="big-number">{roommateData[0]?.gender || 'Female'}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PremiumAnalyticsDashboard;
