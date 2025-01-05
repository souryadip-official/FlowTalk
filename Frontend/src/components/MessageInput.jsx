import { Image, SendHorizontal, X } from "lucide-react";
import { useState, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";

export default function MessageInput() {
    const [ text, setText ] = useState("");
    const [ imagePreview, setImagePreview ] = useState(null);
    const fileInputRef = useRef(null);
    /* useRef is a React hook that creates a reference to an element or a value that persists across renders but does not cause a re-render when it changes. It can be used to store a reference to a DOM element, or to hold any mutable value that we want to persist throughout the component's lifecycle. 
    In the case of a file input, we are typically using useRef to interact with the file input directly */
    const { sendMessage } = useChatStore();

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if(!file.type.startsWith("image/")) {
            toast.error("Please select an image file.")
            return;
        } 
        /* The syntax !file.type.startsWith("image/") is used to check whether a file's MIME type does not start with "image/" */
        const reader = new FileReader();
        reader.onloadend = () => {
            const image = reader.result;
            setImagePreview(image);
        }
        /* onloadend is a callback function that executes when the file reading is finished. */
        reader.readAsDataURL(file);
        /* Starts reading the file (passed as file), converting it to a Base64-encoded string. */

        /* This is commonly used syntax in file upload forms to display a preview of the selected image before uploading it to a server. */
    };

    const removeImage = () => {
        setImagePreview(null);
        if(fileInputRef.current) fileInputRef.current.value="";
        /* Reset the File Input Field:
            It checks if the fileInputRef (a reference to the <input type="file"> element) exists.
            If it does, it sets the value of the input field to an empty string (""), effectively clearing the selected file. 
        */
    };

    const handleSendMessage = async (event) => {
        event.preventDefault();
        if(!text.trim() && !imagePreview) return; /* Protecting logic from invalid api requests */
        try {
            await sendMessage({
                text: text.trim(),
                image: imagePreview,
            });
            /* Clearing the form */
            setText("");
            setImagePreview(null);
            if(fileInputRef.current) fileInputRef.current.value="";
            /* clears the file input reference after the message is sent */
        } catch (error) {
            toast.error("Failed to send message!");
        }
    };

    return (
        <div className="p-4 w-full">
            {imagePreview && (
                <div className="mb-3 flex items-center gap-2">
                    <div className="relative">
                        <img src={imagePreview} alt="Preview"
                        className="w-20 h-20 object-cover rounded-lg border border-zinc-700" />
                        <button onClick={removeImage}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
                        flex items-center justify-center" type="button" >
                        <X className="size-3" />
                        </button>
                    </div>
                </div>
            )}

            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <div className="flex-1 flex gap-2">
                    <input type="text" className="w-full input input-bordered rounded-lg input-sm sm:input-md border-[3px]" placeholder="Write a message..." value={text}
                    onChange={(e) => setText(e.target.value)} />
                    {/* To update the UI as we type a message */}
                    
                    <input type="file" accept="image/*" className="hidden" ref={fileInputRef}
                        onChange={handleImageChange} />
                    {/* The accept attribute of the <input> element specifies the types of files that the input should accept.

                    accept="image/*" -> It restricts the input to only allow image files to be selected. 

                    ref is a special attribute in React that is used to directly access a DOM element or a React component instance. It is often used when we need to interact with a DOM element directly. We create a ref using the useRef hook.

                    This ref will reference the DOM element of the <input> field

                    useRef returns a mutable object with a 'current' property, which will point to the DOM node after the component has been mounted.
                    We can then access the current property of fileInputRef to interact with the input element directly.
                    
                    */}

                    <button type="button" className={`hidden sm:flex btn btn-circle
                        ${imagePreview ? "text-emerald-600" : "text-zinc-400"}`}
                        onClick={() => fileInputRef.current?.click()} >
                        {/* The .click() method is a native DOM method used to simulate a click event. In this case, it is calling the click event of the <input type="file"> element, effectively opening the file dialog for the user to select a file.
                        Since we are working on reference, hence we used the useRef hook */}
                        <Image size={20} />
                    </button>
                </div>
                <button type="submit" className="btn btn-sm gap-2 rounded-lg ml-auto transition-colors"
                disabled={!text.trim() && !imagePreview} >
                    {/* The button will be disabled when there is no text and no image to send */}
                    <SendHorizontal size={22} className="text-teal-600" />
                    <span className="text-teal-600 hidden lg:block">Send</span>
                </button>
            </form>
        </div>
    );
};
