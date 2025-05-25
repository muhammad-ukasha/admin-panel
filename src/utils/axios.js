import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://192.168.0.179:3000/api/v1", // Replace with your backend base URL
  //   timeout: 10000, // Timeout after 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;