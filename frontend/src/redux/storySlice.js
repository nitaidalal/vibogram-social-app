import { createSlice } from "@reduxjs/toolkit";

const storySlice = createSlice({
    name: 'story',
    initialState: {
        stories: [],
    },
    reducers: {
        setStories: (state, action) => {
            state.stories = action.payload;
        },
        addStory: (state, action) => {
            state.stories.unshift(action.payload);
        },
        updateStory: (state, action) => {
            const index = state.stories.findIndex(story => story._id === action.payload._id);
            if (index !== -1) {
                state.stories[index] = action.payload;
            }
        },
        removeStory: (state, action) => {
            state.stories = state.stories.filter(story => story._id !== action.payload);
        },
    }
})

export const { setStories, addStory, updateStory, removeStory } = storySlice.actions;
export default storySlice.reducer;