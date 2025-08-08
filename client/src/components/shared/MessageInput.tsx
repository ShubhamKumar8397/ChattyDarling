import { Paperclip, X } from 'lucide-react';
import React, { useState } from 'react'
import { RotatingLoader } from './Loader';

interface MessageInputProps {
    selectedChat: any | null;
    messageInput: string,
    setMessageInput: (message: string) => void
    handleMessageSend: any
}

const MessageInput = ({ selectedChat, messageInput, setMessageInput, handleMessageSend }: MessageInputProps) => {
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false);

    const handleFormSubmit = async (e: any) => {
        e.preventDefault();
        if (!messageInput.trim() && !imageFile) return
        try {
            setIsUploading(true);
            await handleMessageSend(e, imageFile)
            setIsUploading(false)
        } catch (error) {
            console.log(error)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        selectedChat && (
            <form onSubmit={handleFormSubmit} className='flex flex-col gap-2 border-t border-gray-700 pt-2 mb-3' >
                {
                    imageFile && <div className='relative w-fit' >
                        <img className='w-24 h-24 object-cover rounded-lg border-gray-600 ' src={URL.createObjectURL(imageFile)} alt="preview" />\\
                        <button type='button' className='absolute -top-2 -right-2 cursor-pointer bg-black rounded-full p-1 '
                            onClick={() => setImageFile(null)}
                        >
                            <X className='w-4 h-4 text-white' />
                        </button>
                    </div>
                }
                <div className='w-full flex  gap-2'>
                    <label className='cursor-pointer flex justify-center items-center w-10 h-10 bg-gray-100 hover:bg-gray-600 rounded-lg '>
                        <Paperclip size={22} className='text-gray-400' />
                        <input type="file" accept='image/*' className='hidden'
                            onChange={e => {
                                const file = e.target.files?.[0];
                                if (file && file.type.startsWith("image/")) {
                                    setImageFile(file)
                                }
                            }} />
                    </label>

                    <input type="text"
                        className='flex-1 rounded-lg   bg-gray-700 rouned-lg px-4 py-2 text-white placeholder-gray-400'
                        placeholder={imageFile ? "Add a Caption.." : "Type A Message"}
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                    />

                    <button type='submit'
                        disabled={!imageFile && !messageInput || isUploading}
                        className='bg-blue-600 px-3 rounded-md cursor-pointer disabled:cursor-not-allowed'
                    >
                        {
                            isUploading ? <RotatingLoader/> : "Send"
                        }
                    </button>
                </div>
            </form>
        )
    )
}

export default MessageInput