import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SessionModelType } from '../../models/SessionModel';
import type { RootState } from '../store';

// Define a type for the slice state
export interface ActiveSession {
  id: number | null;
  name: string | null;
}

// Define the initial state using that type
const initialState: ActiveSession = {
  id: null,
  name: null,
};

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    clearSession: (state) => {
      state.id = null;
      state.name = null;
    },
    setSession: (state, action: PayloadAction<SessionModelType>) => {
      console.log(action);
      state.id = action.payload.id;
      state.name = action.payload.name;
    },
  },
});

export const { clearSession, setSession } = sessionSlice.actions;

export const selectSessionID = (state: RootState) => state.session.id;

export default sessionSlice.reducer;
