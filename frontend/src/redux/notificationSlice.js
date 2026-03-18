import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: "notification",
    initialState: {
        notifications: [],
        unreadCount: 0,
        loading: false,
    },
    reducers: {
        setNotifications: (state, action) => {
            state.notifications = action.payload.notifications;
            state.unreadCount = action.payload.unreadCount;
        },
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
            state.unreadCount += 1;
        },
        markAllRead: (state) => {
            state.notifications.forEach((n) => {
                n.isRead = true;
            });
            state.unreadCount = 0;
        },
        markOneRead: (state, action) => {
            const idx = state.notifications.findIndex((n) => n._id === action.payload);
            if (idx !== -1 && !state.notifications[idx].isRead) {
                state.notifications[idx].isRead = true;
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
        },
        removeNotification: (state, action) => {
            const idx = state.notifications.findIndex((n) => n._id === action.payload);
            if (idx !== -1) {
                if (!state.notifications[idx].isRead) { // If the removed notification was unread, decrease the count
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
                state.notifications.splice(idx, 1); 
            }
        },
        clearAllNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }

    },
});

export const {
    setNotifications,
    addNotification,
    markAllRead,
    markOneRead,
    removeNotification,
    clearAllNotifications,
    setLoading,
} = notificationSlice.actions;

export default notificationSlice.reducer;
