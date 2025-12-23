
import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "https://amazon-api-deploy-op73.onrender.com/",
});
export { axiosInstance };
