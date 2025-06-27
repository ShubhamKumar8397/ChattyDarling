import React from 'react'
import ChatItem from '../Shared/ChatItem'

const ChatList = ({ 
    w = "100%", 
    chats = [], 
    chatId, 
    onlineUsers = [], 
    newMessagesAlert = [
    {
        chatId: "",
        count: 0,
    }],
    handleDeleteChat,
}) => {
    return (
        chats?.map((data) => {
            return (
                <div className={`${w} mb-1`}>
                    <ChatItem isOnline={data.isOnline} name={data.name} avatar={data.avatar}/>
                </div>
            )
        })
    )
}

export default ChatList