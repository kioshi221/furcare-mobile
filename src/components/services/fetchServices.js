// const fetchServices = {
//   postData: async (url = "", data = {}) => {
//     try {
//       const response = await fetch(url, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok.');
//       }

//       return await response.json();
//     } catch (error) {
//       // Handle fetch errors or response errors here
//       console.error('Fetch error:', error.message);
//       throw error; // Propagate the error to the caller
//     }
//   },
// };

// export default fetchServices;

import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const baseURL = "http://192.168.43.31/api/mobile";

const axiosClient = axios.create({
  baseURL,
});

axiosClient.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('ACCESS_TOKEN');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(token)
    }
    return config;
  } catch (error) {
    return Promise.reject(error);
  }
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { response } = error;
    if (response && response.status === 401) {
      try {
        await SecureStore.deleteItemAsync('ACCESS_TOKEN');
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
