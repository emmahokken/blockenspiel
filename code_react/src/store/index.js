import { configureStore } from '@reduxjs/toolkit';
import gridReducer from './grid';

const store = configureStore({
  reducer: {
    grid: gridReducer,
  },
});

export default store;