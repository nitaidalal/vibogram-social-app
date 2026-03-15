import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE = import.meta.env.VITE_BACKEND_URL;

const initialState = {
  posts: [],
  isLoading: false,
  isFetchingMore: false,
  hasFetched: false,
  lastFetched: null,
  nextCursor: null,
  hasMore: true,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
      state.nextCursor = action.payload.nextCursor;
      state.hasMore = action.payload.hasMore;
      state.hasFetched = true;
      state.lastFetched = Date.now();
    },

    appendPosts: (state, action) => {
      state.posts.push(...action.payload.posts);
      state.nextCursor = action.payload.nextCursor;
      state.hasMore = action.payload.hasMore;
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setFetchingMore: (state, action) => {
      state.isFetchingMore = action.payload;
    },

    addPost: (state, action) => {
      state.posts.unshift(action.payload);
    },

    updatePost: (state, action) => {
      const index = state.posts.findIndex((p) => p._id === action.payload._id);
      if (index !== -1) state.posts[index] = action.payload;
    },

    removePost: (state, action) => {
      state.posts = state.posts.filter((p) => p._id !== action.payload);
    },

    likePost: (state, action) => {
      const post = state.posts.find((p) => p._id === action.payload.postId);
      if (post) post.likes = action.payload.likes;
    },

    addComment: (state, action) => {
      const post = state.posts.find((p) => p._id === action.payload.postId);
      if (post) post.comments = action.payload.comments;
    },

    invalidateCache: (state) => {
      state.hasFetched = false;
      state.lastFetched = null;
    },
  },
});

export const {
  setPosts,
  appendPosts,
  setLoading,
  setFetchingMore,
  addPost,
  updatePost,
  removePost,
  likePost,
  addComment,
  invalidateCache,
} = postSlice.actions;

export default postSlice.reducer;

/* ===============================
   Fetch Posts (with TTL caching)
================================ */

export const fetchPostsIfNeeded =
  ({ force = false, ttlMs = 120000, silent = false } = {}) =>
  async (dispatch, getState) => {
    const { post } = getState();

    const cacheFresh =
      post.hasFetched &&
      post.lastFetched &&
      Date.now() - post.lastFetched < ttlMs;

    if (!force && cacheFresh) return;
    if (post.isLoading) return;

    try {
      if (!silent) dispatch(setLoading(true));

      const { data } = await axios.get(`${BASE}/posts/getAllPosts`, {
        params: { limit: 10 },
        withCredentials: true,
      });

      dispatch(setPosts(data));
    } catch (err) {
      console.log("Fetch posts error:", err?.response?.data?.message);
    } finally {
      if (!silent) dispatch(setLoading(false));
    }
  };

/* ===============================
   Infinite Scroll Pagination
================================ */

export const fetchMorePosts =
  ({ limit = 10 } = {}) =>
  async (dispatch, getState) => {
    const { post } = getState();

    if (!post.hasMore || !post.nextCursor) return;
    if (post.isFetchingMore || post.isLoading) return;

    try {
      dispatch(setFetchingMore(true));

      const { data } = await axios.get(`${BASE}/posts/getAllPosts`, {
        params: {
          limit,
          cursor: post.nextCursor,
        },
        withCredentials: true,
      });

      dispatch(appendPosts(data));
    } catch (err) {
      console.log("Fetch more posts error:", err?.response?.data?.message);
    } finally {
      dispatch(setFetchingMore(false));
    }
  };
