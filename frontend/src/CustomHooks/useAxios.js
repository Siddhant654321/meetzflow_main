import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function useAxios() {
  const navigate = useNavigate();
  
  const instance = axios.create({
    baseURL: 'https://meetzflow.com/',
  });

  instance.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate('/error', { state: { error: "You are unauthorized to perform this action" } });
      } else if (error.response.data.hasOwnProperty('emailError')) {
        navigate('/error', { state: { error: "Please confirm your email before you proceed" } });
      } else if(error.response.data.hasOwnProperty('googleAuthenticationError')) {
        navigate('/app/setup/');
      } else if (error.response.status === 500) {
        navigate('/error', { state: { error: "Server Error" } });
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

export default useAxios;