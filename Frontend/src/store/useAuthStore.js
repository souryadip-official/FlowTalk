import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import { io } from "socket.io-client";
/* Axios is a promise-based HTTP client for the browser and Node.js. It is used to make requests to the server. It is use to send asynchronous HTTP requests to REST endpoints and perform CRUD operations. */
import toast from 'react-hot-toast';
/* Zustand is a global state management library that allows us to share state between components without having to use props or context. */

const BASE_URL = import.meta.env.MODE === "development"? "http://localhost:5001" : "/"; /* Backend server URL */

export const useAuthStore = create((set,get) => ({
    authUser: null,
    onlineUsers: [],
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    socket: null,
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
            get().connectSocket(); /* so that even if we refresh, we stay connected */
        } catch (error) {
            /* user is not authenticated */
            console.log(`Error in checkAuth: ${error.message}`);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const response = await axiosInstance.post("/auth/signup", data);
            set({ authUser: response.data });
            toast.success("Account created successfully!");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);  
        } finally {
            set({ isSigningUp: false });
        }
    },
    logout: async() => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully!");
            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },
    login: async (data) => {
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post("/auth/login", data);
          set({ authUser: res.data });
          toast.success("Logged in successfully");
          get().connectSocket();
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ isLoggingIn: false });
        }
    },
    updateProfile: async(data) => {
        set({ isUpdatingProfile: true });
        try {
            let response = await axiosInstance.put("/auth/update-profile", data);
            /* console.log(response); */
            set((state) => ({
                /* functional update -> updation depends on the current state */
                authUser: {
                  ...state.authUser, /* the previous authUser data remains */
                  profilePic: response.data.updatedUser.profilePic, /* update only the profilePic */
                },
            }));
            /* res.data contains the newly updated user object */
            toast.success("Profile updated successfully!"); 
        } catch (error) {
            console.log(`Error in updateProfile: ${error.message}`);
            toast.error(error.response.data.message);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },
    connectSocket: () => {
        const { authUser } = get();
        if(!authUser || get().socket?.connected) return;
        console.log("Connecting socket with userId:", authUser?._id);
        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            },
        }); 
        socket.connect();
        set({socket: socket});

        /* socket.on -> listen */
        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    },
    disconnectSocket: () => {
        if(get().socket?.connected) {
            console.log("disconnecting");
            get().socket.disconnect();
        }
    },
}));