import axios from 'axios';

const apiUrl = 'http://localhost:3000/api'; // replace with your backend URL

export const getListings = async () => {
  try {
    const response = await axios.get(`${apiUrl}/listings`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};