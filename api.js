import axios from 'axios';

const apiUrl = 'https://roomtopia-backend-vnj1.onrender.com'; // replace with your backend URL

export const getListings = async () => {
  try {
    const response = await axios.get(`${apiUrl}/listings`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};