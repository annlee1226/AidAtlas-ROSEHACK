import axios from 'axios';


const BASE_URL = "http://127.0.0.1:5000"

export const getLocation = async (latitude, longitude) => {
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




