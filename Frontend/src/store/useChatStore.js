import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from "./useAuthStore";
import toast from 'react-hot-toast';

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    getUsers: async () => {
        set( { isUsersLoading: true } );
        try {
            const response = await axiosInstance.get("/message/users");
            /* res.json() sends the data in the data field of response, so we can access it using response.data */
            set({ users: response.data});
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false});
        }
    },
    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const response = await axiosInstance.get(`/message/${userId}`);
            set({ messages: response.data });
            /* toast.success("Messages loaded successfully"); */ /* remove later */
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },
    sendMessage: async (messageData) => {
        /* To call any of the variables declared in this variable, we get 
        "get" command from zustand to have this benefit */
        const { selectedUser, messages } = get();
        try {
            const response = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
            set({ messages: [ ...messages, response.data ]});
            /* We will get the message that was send from the backend.
               we first destructured the previous message array and kept it
               as it is and then updated it with the recently sent one */
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },
    listenToMessages: () => {
        const { selectedUser } = get();
        if(!selectedUser) return;
        const socket = useAuthStore.getState().socket;
        /* This is how we import socket variables */

        socket.on("newMessage", (newMessage) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if(!isMessageSentFromSelectedUser) return;
            console.log(newMessage);
            set({ messages: [...get().messages, newMessage]});
        });
    },
    ignoreMessages: () => {
        /* when we log out, we don't require the real time activity */
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },
    setSelectedUser: (user) => set({ selectedUser: user }),
}));