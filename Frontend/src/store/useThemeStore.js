import { create } from 'zustand';
import toast from 'react-hot-toast';
export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("theme") || "light",
    /* localStorage.getItem() is a method in JavaScript that allows us to retrieve data that has been stored in the browser's local storage. The data in local storage persists even after the browser is closed and reopened, unlike session storage, which is cleared when the session ends. */
    setTheme: (theme) => {
        localStorage.setItem("theme", theme);
        /* localStorage.setItem() is a synchronous JavaScript method used to store data in the browser's local storage. This data persists even after the browser is closed and reopened, and it remains available until it is explicitly removed. */
        set({ theme });
        toast.success("The theme has been successfully applied.");
    }
}));

/* IMPORTANT NOTES: Data in localStorage is stored as a string. If you store objects, you'll need to stringify them first and parse them when retrieving. */