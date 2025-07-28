import React, { useState } from 'react';
import axios from 'axios';

const Scraper = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScrape = async (e) => {
    e.preventDefault(); // Prevent form submission reload
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/scrape', { url });
      setResult(response.data);
    } catch (error) {
      console.error('Scraping error:', error.response?.data);
      alert('Scraping failed! Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Web Scraper</h2>
      <form onSubmit={handleScrape}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL to scrape"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Scraping...' : 'Scrape'}
        </button>
      </form>
      
      {result && (
        <div>
          <h3>Results:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Scraper;