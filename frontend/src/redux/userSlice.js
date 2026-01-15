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
    name:"user",
    initialState:{
        userData: loadUserFromLocalStorage()
    },
    reducers:{
        setUserData:(state,action) => {
            state.userData = action.payload;
            try {
                localStorage.setItem('userData', JSON.stringify(action.payload));
            } catch (error) {
                console.error('Error saving user data to localStorage:', error);
            }
        },
        clearUserData:(state) => {
            state.userData = null;
            // Remove from localStorage
            try {
                localStorage.removeItem('userData');
            } catch (error) {
                console.error('Error removing user data from localStorage:', error);
            }
        }
    }
})

export const {setUserData, clearUserData} = userSlice.actions;
export default userSlice.reducer;