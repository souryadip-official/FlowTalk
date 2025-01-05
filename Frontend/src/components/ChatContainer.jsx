import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { Frown } from "lucide-react";

export default function ChatContainer() {
    const { messages, getMessages, isMessagesLoading, selectedUser, listenToMessages, ignoreMessages } = useChatStore();
    const { authUser } = useAuthStore();

    const messageEndRef = useRef(null);

    useEffect(() => {
        getMessages(selectedUser._id);
        listenToMessages();
        return () => ignoreMessages();
        /* This is a cleanup function that will run when the component is unmounted or before the effect runs again due to a change in dependencies.
        ignoreMessages() will likely stop the socket.io listener that was set up by listenToMessages(). This ensures that once you change the selected user or the component is unmounted, the listener is cleaned up, avoiding memory leaks and unnecessary message updates. */
    }, [selectedUser._id, getMessages, listenToMessages, ignoreMessages]); 
    /* It means we will use the getEffect as many times as the selected user changes */

    useEffect(() => {
        if(messageEndRef.current && messages) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth"});
        }
    }, [messages]);

    if(isMessagesLoading) {
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader />
                <MessageSkeleton />
                <MessageInput />
            </div>
        );
    };
    
    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length == 0 && (
                <div className="flex justify-center items-center text-center">
                    <p className="text-blue-500 font-bold text-sm text-base-500 bg-base-200 px-6 py-3 rounded-lg ">
                    Inbox is empty &nbsp; <Frown className="inline"/>
                    </p>
                </div>
            )}
                {messages.map((message) => (
                <div key={message._id}
                    className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
                     ref={messageEndRef}>
                    <div className=" chat-image avatar">
                        <div className="size-10 rounded-full border">
                            <img
                            src={
                                message.senderId === authUser._id
                                ? authUser.profilePic || "/avatar.png"
                                : selectedUser.profilePic || "/avatar.png"
                            }
                            alt="profile pic"
                            />
                        </div>
                    </div>
                    <div className="chat-header mb-1">
                        <time className="text-xs opacity-50 ml-1">
                            {/* The <time> tag in React (and HTML in general) is used to represent a specific point in time or a duration. It provides semantic meaning to date and time values in your code, helping screen readers and other tools to understand and display the content correctly. */}
                            {formatMessageTime(message.createdAt)}
                        </time>
                    </div>
                    <div className="chat-bubble flex flex-col">
                        {message.image && (
                            <img
                            src={message.image}
                            alt="Attachment"
                            className="sm:max-w-[200px] rounded-md mb-2"
                            />
                        )}
                        {message.text && <p>{message.text}</p>}
                    </div>
                </div>
                ))}
            </div>
            <MessageInput />
        </div>
    );
};