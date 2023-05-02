import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { ThunkDispatch } from 'redux-thunk';
import authReducer from './auth';

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = ThunkDispatch<RootState, unknown, Action>;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export default store;
