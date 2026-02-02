import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    addPost: (state, action) => {
      state.posts.unshift(action.payload);
    },
    updatePost: (state, action) => {
      const index = state.posts.findIndex(post => post._id === action.payload._id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
    removePost: (state, action) => {
      state.posts = state.posts.filter(post => post._id !== action.payload);
    },
    likePost: (state, action) => {
      const post = state.posts.find(p => p._id === action.payload.postId);
      if (post) {
        post.likes = action.payload.likes;
      }
    },
    addComment: (state, action) => {
      const post = state.posts.find(p => p._id === action.payload.postId);
      if (post) {
        post.comments = action.payload.comments;
      }
    },
  },
});

export const { setPosts, addPost, updatePost, removePost, likePost, addComment } = postSlice.actions;
export default postSlice.reducer;
