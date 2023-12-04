import { configureStore } from '@reduxjs/toolkit';
import courseReducer from './slices/courseSlice';
import userReducer from './slices/userSlice';
import managementReducer from './slices/managementSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

const store = configureStore({
  reducer: {
    course: courseReducer,
    user: userReducer,
    management: managementReducer,
  },
});

export default store;

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
