import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const storySlice = createSlice({
    name: 'story',
    initialState: {
        stories: [],
        isLoading: false,
        hasFetched: false,
        lastFetched: null,
    },
    reducers: {
        setStories: (state, action) => {
            state.stories = action.payload;
            state.hasFetched = true;
            state.lastFetched = Date.now();
        },
        setStoriesLoading: (state, action) => {
            state.isLoading = action.payload;
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
        invalidateStoriesCache: (state) => {
            state.hasFetched = false;
            state.lastFetched = null;
        },
    }
})

export const fetchStoriesIfNeeded = ({ force = false, ttlMs = 120000, silent = false } = {}) => async (dispatch, getState) => {
    const { story } = getState();

    const isCacheFresh =
        story.hasFetched &&
        story.lastFetched &&
        Date.now() - story.lastFetched < ttlMs;

    if (story.isLoading) {
        return;
    }

    if (!force && isCacheFresh) {
        return;
    }

    try {
        if (!silent) {
            dispatch(setStoriesLoading(true));
        }
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/story/getAllStories`, {
            withCredentials: true,
        });
        dispatch(setStories(response.data.stories || []));
    } catch (error) {
        console.log("Error fetching stories:", error?.response?.data?.message);
        dispatch(setStories([]));
    } finally {
        if (!silent) {
            dispatch(setStoriesLoading(false));
        }
    }
};

export const { setStories, setStoriesLoading, addStory, updateStory, removeStory, invalidateStoriesCache } = storySlice.actions;
export default storySlice.reducer;