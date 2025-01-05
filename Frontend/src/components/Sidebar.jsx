import { useEffect, useState } from "react";
import { Users, RefreshCcw, CircleSlash } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
   
    /* Refreshing Task */
    const navigate = useNavigate();
    const handleRefresh = () => {
        navigate(0); /* reloads the current page route without triggering a full page */
    };

    /* Refreshing task finished */
    const { users, getUsers, isUsersLoading, selectedUser, setSelectedUser } = useChatStore();
    const { onlineUsers } = useAuthStore();

    const [showOnlineOnly, setShowOnlineOnly] = useState(false);

    const filteredUsers = showOnlineOnly? users.filter(user => onlineUsers.includes(user._id)) : users;

    useEffect(() => {
        getUsers();
    }, [getUsers]); /* the array here is called the dependency array */

    if(isUsersLoading) {
        return <SidebarSkeleton />;
    }
    return(
    <aside className="h-full w-20 lg:w-72 border-r-[3px] border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b-[3px] border-base-300 w-full p-5">
        <div className="flex items-center justify-center flex-wrap gap-2 w-full">
          <Users className="size-6"/>
          <span className="font-medium hidden lg:block">Contacts</span>

          <button onClick={handleRefresh} className="btn btn-sm gap-2 ml-auto rounded-lg transition-colors">
            <RefreshCcw className="w-5 h-5 size-6 text-green-500" /> 
            <span className="text-green-500 hidden lg:block">Refresh</span>
          </button>
          
        </div>
        {/* Todo -> Online users */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm rounded-md"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
        </div>
      </div>
      
      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-200 rounded-xl transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300 rounded-xl" : ""}
            `}
          >
            {/* rounded-full and rounded-3xl property given above is a change made here */}
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && ( 
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"} 
              </div>
            </div>
          </button>
        ))}
        
        <div className="flex flex-col justify-center items-center w-full h-full">
          {filteredUsers.length === 0 && (
            <button className="btn btn-sm gap-2 rounded-lg transition-colors">
              <CircleSlash className="w-5 h-5 text-red-500" />
              <span className="text-red-500 hidden lg:block">No online users</span> 
            </button>
          )}
        </div>


      </div>
    </aside>
    );
};