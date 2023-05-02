import axios from 'axios';
import Cookie from 'js-cookie';

//The function to send credentials (username and password)
// to the backend and receive the JWT if the authentication is successful.
export async function login(username: string, password: string) {
    try {
      const response = await axios.post('/api/users/login', { username, password });
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  //When the JWT is received from the backend, store the token in a cookie to keep the user logged in on page reload.
export function saveToken(token: string) {
    Cookie.set('token', token);
  }

  //Send requests to APIs that require authentication
export async function fetchProtectedData() {
    const token = Cookie.get('token');
    try {
      const response = await axios.get('/api/protected', { headers: { Authorization: `Bearer ${token}` } });
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

 //Handling request automatically refresh token
export async function refreshToken() {
    try {
      const response = await axios.post('/api/auth/refresh-token', {}, { headers: { Authorization: `Bearer ${Cookie.get('refreshToken')}` } });
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

    //Handle expired JWT case
  async function handleUnauthorizedError() {
    const newToken = await refreshToken();
    if (newToken) {
      saveToken(newToken);
      // Retry the original request with the new token
    } else {
      Cookie.remove('token');
      Cookie.remove('refreshToken');
      // Redirect user to the login page or show a message asking them to log in again
    }
  }
export function logout() {
    Cookie.remove('token');
    Cookie.remove('refreshToken');
    // Redirect user to the login page
  }
