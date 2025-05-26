import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://3125ccb2-54a5-4d27-9aef-532ef1bdaccc-00-226tm68i8l9bh.sisko.replit.dev/api/v1", // Replace with your backend base URL
  //   timeout: 10000, // Timeout after 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;