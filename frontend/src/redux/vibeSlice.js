import { createSlice } from "@reduxjs/toolkit";

const vibeSlice = createSlice({
  name: "vibe",
  initialState: {
    vibes: [],
  },
  reducers: {
    setVibes: (state, action) => {
      state.vibes = action.payload;
    },
    addVibe: (state, action) => {
      state.vibes.unshift(action.payload);
    },
    updateVibe: (state, action) => {
      const index = state.vibes.findIndex(vibe => vibe._id === action.payload._id);
      if (index !== -1) {
        state.vibes[index] = action.payload;
      }
    },
    removeVibe: (state, action) => {
      state.vibes = state.vibes.filter(vibe => vibe._id !== action.payload);
    },
    likeVibe: (state, action) => {
      const vibe = state.vibes.find(v => v._id === action.payload.vibeId);
      if (vibe) {
        vibe.likes = action.payload.likes;
      }
    },
    addVibeComment: (state, action) => {
      const vibe = state.vibes.find(v => v._id === action.payload.vibeId);
      if (vibe) {
        vibe.comments = action.payload.comments;
      }
    },
  },
});

export const { setVibes, addVibe, updateVibe, removeVibe, likeVibe, addVibeComment } = vibeSlice.actions;
export default vibeSlice.reducer;