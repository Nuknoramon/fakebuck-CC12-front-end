import axios from "axios";
import { API_ENDPOINT_URL } from "./evn";

axios.defaults.baseURL = API_ENDPOINT_URL;

export default axios;
