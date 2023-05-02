// import apiClient from '@/services/apiClient';
// import { Dispatch } from 'redux';
// import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from './actionTypes';

// export const login = (username: string, password: string) => async (dispatch: Dispatch) => {
//   try {
//     const response = await apiClient.post('/api/login', { username, password });
//     const user = response.data.user;
//     dispatch({ type: LOGIN_SUCCESS, payload: { user } });
//   } catch (error) {
//     dispatch({ type: LOGIN_FAILURE, payload: { error } });
//   }
// };

// export const logout = () => async (dispatch: Dispatch) => {
//   try {
//     await apiClient.post('/api/logout');
//     dispatch({ type: LOGOUT });
//   } catch (error) {
//     console.log(error);
//   }
// };
