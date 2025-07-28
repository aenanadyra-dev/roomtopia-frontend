// Quick test to check if analytics API is working from frontend
async function testAnalytics() {
  try {
    console.log('🧪 Testing analytics API from frontend...');
    
    const response = await fetch('/api/analytics/dashboard', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Analytics API Response:', data);
    
    if (data.success && data.data) {
      console.log('📊 Location Data:', data.data.locationData);
      console.log('👥 Roommate Preferences:', data.data.roommatePreferences);
      console.log('💰 Price Ranges:', data.data.priceRanges);
      
      // Test if data is suitable for charts
      console.log('🎯 Chart readiness:');
      console.log('  - Location bars:', data.data.locationData?.length || 0);
      console.log('  - Roommate charts:', data.data.roommatePreferences?.length || 0);
      console.log('  - Price bars:', data.data.priceRanges?.length || 0);
    } else {
      console.error('❌ API response format unexpected:', data);
    }
    
  } catch (error) {
    console.error('❌ Analytics test failed:', error);
  }
}

// Run the test
testAnalytics();
