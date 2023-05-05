import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import jwt_decode from 'jwt-decode';
import Cookies from 'js-cookie';
import apiClient from '@/services/apiClient';
import { RootState } from '@/store';

interface User {
  User_ID: number;
  User_Name: string;
  Full_Name: string;
  Phone_Number: string;
  Is_Admin: number;
}

interface AuthState {
  isLoggedIn: boolean;
  user?: User;
  accessToken?: string;
}

const initialState: AuthState = {
  isLoggedIn: !!Cookies.get('accessToken'),
  user: undefined,
  accessToken: Cookies.get('accessToken') ?? undefined,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { userName: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<{ status: boolean; message: string; user?: User; accessToken?: string }>(
        '/users/login',
        {
          userName: credentials.userName,
          password: credentials.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const { data } = response;

      if (data.status) {
        const decodedToken: any = jwt_decode(data.accessToken!);
        Cookies.set('user', JSON.stringify(decodedToken.user));
        Cookies.set('accessToken', data.accessToken || '');
        return { user: data.user!, accessToken: data.accessToken! };
      } else {
        // Reject with the error message from the API response
        return rejectWithValue(data.message);
      }
    } catch (error: any) {
      // Reject with a generic error message
      return rejectWithValue("An error occurred while logging in. Please try again.");
    }
}
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutSuccess(state) {
      state.isLoggedIn = false;
      state.user = undefined;
      state.accessToken = undefined;
      Cookies.remove('accessToken');
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      const { user, accessToken } = action.payload;
      state.isLoggedIn = true;
      state.user = user;
      state.accessToken = accessToken;
    });
  },
});

export const { logoutSuccess } = authSlice.actions;

export default authSlice.reducer;

export const selectAuthState = (state: RootState) => state.auth;
