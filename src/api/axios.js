import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export default axios.create({ //일반 요청용 
    baseURL: BASE_URL,
    
   
});

export const axiosPrivate = axios.create({  
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});