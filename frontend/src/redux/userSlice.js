import { createSlice } from "@reduxjs/toolkit";

// Load user data from localStorage if it exists
const loadUserFromLocalStorage = () => {
    try {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('Error loading user data from localStorage:', error);
        return null;
    }
};

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: loadUserFromLocalStorage(),
    suggestedUsers:[],
    profileData:null,
    following:[],
    loading:false,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
      try {
        localStorage.setItem("userData", JSON.stringify(action.payload));
      } catch (error) {
        console.error("Error saving user data to localStorage:", error);
      }
    },
    clearUserData: (state) => {
      state.userData = null;
      // Remove from localStorage
      try {
        localStorage.removeItem("userData");
      } catch (error) {
        console.error("Error removing user data from localStorage:", error);
      }
    },
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload;
    },
    setProfileData: (state, action) => {
      state.profileData = action.payload;
    },
    setFollowing: (state,action) => {
      state.following = action.payload;
    },
    toggleFollow: (state, action) => {
      const userId = action.payload;
      if (state.following.includes(userId)) {
        state.following = state.following.filter(id => id !== userId);
      } else {
        state.following.push(userId);
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }

  },
});

export const {setUserData, clearUserData, setSuggestedUsers, setProfileData, setFollowing, toggleFollow, setLoading} = userSlice.actions;
export default userSlice.reducer;