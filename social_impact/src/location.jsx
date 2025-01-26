import axios from 'axios';

const BASE_URL = "http://127.0.0.1:5000"

export const setLocation = async (latitude, longitude) => {
  try {
    const response = await axios.post(`${BASE_URL}/location`, {
      latitude,
      longitude,
    });
    console.log("Location response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending location:", error);
    throw error;
  }
};


export const getShelters = async (latitude, longitude) => {
  try {
    const response = await axios.get(`${BASE_URL}/shelters`, {
      params: { latitude, longitude }, // Pass latitude and longitude as query parameters
    });
    console.log("Shelters response:", response.data);
    return response.data; // Return the shelters data
  } catch (error) {
    console.error("Error fetching shelters:", error);
    throw error;
  }
};


export const getJobs = async (latitude, longitude) => {
  try {
    const response = await axios.post(`${BASE_URL}/searchLocalJobs`, {
      latitude,
      longitude,
    });
    console.log("Location response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending location:", error);
    throw error;
  }
};
