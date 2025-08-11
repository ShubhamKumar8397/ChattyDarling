import { Check, CheckCheck } from 'lucide-react';
import moment from 'moment';
import React, { useEffect, useMemo, useRef } from 'react'

const ChatMessages = ({ selectedChat = "", messages = [], loggedInUser, getMessagesLoading }: any) => {

    const bottomRef = useRef<HTMLDivElement>(null);

    // console.log(getMessagesLoading)
    // console.log(messages)

    // seen fetaure have to add
    const uniqueMessages = useMemo(() => {
        if (!messages) return []
        const seen = new Set()
        // console.log(seen)
        const unique = messages.filter((message: any) => {
            if (seen.has(message._id)) {
                return false
            }
            seen.add(message._id)
            return true
        })
        // console.log(unique)
        return unique;
    }, [messages])


    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [selectedChat, uniqueMessages])

    return (
        <div className='flex-1 overflow-hidden'>
            <div className='h-full max-h-[calc(100vh_-_300px)]  overflow-y-auto p-2 space-y-2 custom-scroll'>
                {
                    uniqueMessages.map((message: any, index: any) => {
                        const isSentByMe = message.sender === loggedInUser?._id;

                        return (
                            <div key={message._id} className={`flex flex-col gap-1 mt-2 ${isSentByMe ? "items-end" : "items-start"}`}>
                                <div className={`rounded-lg p-3 max-w-sm ${isSentByMe ? "bg-blue-600 text-white" : "bg-gray-700 text-white"}`}>
                                    {
                                        message.messageType === "image" && message.image ? (
                                            <div className='relative group'>
                                                <img src={message.image.url} alt="shared image"
                                                    className='max-w-full h-auto rounded-lg'
                                                />
                                                {
                                                    message.text && <p className='mt-1'>{message.text}</p>
                                                }
                                            </div>

                                        )
                                            :
                                            message.text && <p>{message.text}</p>
                                    }

                                    <div className={`flex items-center gap-1 text-xs text-gray-300 
                                        ${isSentByMe ? "pr-2 flex-row-reverse" : "pl-2"}
                                    `}>
                                        <span>
                                            {moment(message.createdAt).format("hh:mm A . MMM D")}
                                        </span>
                                        {
                                            isSentByMe && <div className='flex items-center ml-1' >
                                                {
                                                    message.seen ? (
                                                        <div className='flex items-center gap-1 text-green-400' >
                                                            <CheckCheck className='w-3 h-3' />
                                                            {
                                                                message.seenAt && <span>{moment(message.seenAt).format("hh:mm A")}</span>
                                                            }
                                                        </div>
                                                    )
                                                        :
                                                        (
                                                            <Check className='text-gray-500 h-3 w-3' />
                                                        )
                                                }  
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                <div ref={bottomRef}></div>
            </div>
        </div>
    )
}

export default ChatMessages