import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setNotifications,setLoading } from '../redux/notificationSlice';

// Fetches notifications on app load so the bell icon shows
// the correct unread count without requiring a visit to /notifications
const useGetNotifications = () => {
    const dispatch = useDispatch();
    const { userData } = useSelector((state) => state.user);
    

    useEffect(() => {
        if (!userData?._id) return;

        const fetchNotifications = async () => {
            try {
                dispatch(setLoading(true));
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/notifications`,
                    { withCredentials: true }
                );
                dispatch(setNotifications({
                    notifications: res.data.notifications,
                    unreadCount: res.data.unreadCount,
                }));
            } catch {
                // silent — bell badge just shows 0 until next refresh
            } finally {
                dispatch(setLoading(false));

            }
        };

        fetchNotifications();
    }, [userData?._id]);
};

export default useGetNotifications;
