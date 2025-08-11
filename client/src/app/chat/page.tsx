"use client"
import { RotatingLoader } from '@/components/shared/Loader'
import { ChatSidebar } from '@/components/shared/ChatSidebar'
import { useAppData } from '@/context/AppContext'
import { useRouter } from 'next/navigation'

import React, { Suspense, useEffect, useState } from 'react'
import { useGetAllChatsQuery, useGetAllMessagesQuery } from '@/tanstackQueries/chatQueries'
import ChatHeader from '@/components/shared/ChatHeader'
import ChatMessages from '@/components/shared/ChatMessages'
import MessageInput from '@/components/shared/MessageInput'
import { sendMessageEndpoint } from '@/endpointsApi/chat.endpoint'
import { toast } from 'react-toastify'
import { SocketData } from '@/context/SocketContext'
import { useQueryClient } from '@tanstack/react-query'
import { measureMemory } from 'vm'


const page = () => {
  const router = useRouter()
  const { user: loggedinUser, isAuth, loading, logoutUser } = useAppData();
  const { onlineUsers, socket } = SocketData()

  const { data, isLoading: getChatsLoading } = useGetAllChatsQuery()

  const [openSearchUser, setOpenSearchUser] = useState<boolean>(false)
  const [selectedChat, setSelectedChat] = useState<any>()
  const [messageInput, setMessageInput] = useState<string>("")

  const { data: messagesData, isLoading: getMessagesLoading, } = useGetAllMessagesQuery({ chatId: selectedChat?._id })

  const [messages, setMessages] = useState(messagesData?.data?.allMessage)

  const handleMessageSend = async (e: any, imageFile?: File) => {
    e.preventDefault();
    if (!messageInput.trim() && !imageFile && !selectedChat) return

    // socket work

    try {
      const formData = new FormData();
      formData.append("chatId", selectedChat._id)

      if (messageInput.trim()) {
        formData.append("text", messageInput)
      }
      if (imageFile) {
        formData.append("image", imageFile)
      }

      const response = await sendMessageEndpoint(formData);
      setMessages((prev: any) => {
        const currentMessages = prev || []
        const messageExists = currentMessages.some((msg: any) => msg._id === response.message._id)
        if (!messageExists) {
          return [...currentMessages, response.message]
        }
        return currentMessages;
      })

      setMessageInput("")
    } catch (error: any) {
      toast.error(error.message)
    }

  }

  const queryClient = useQueryClient();

const moveChatToTop = (chatId: string, newMessage: any, updatedUnseenCount = true) => {
  queryClient.setQueryData(["getAllChats"], (oldData: any) => {
    if (!oldData) return oldData;

    // Assuming oldData is an array of chats
    let chats = [...oldData.data];

    // Find the chat
    const index = chats.findIndex((c: any) => c._id === chatId);
    if (index === -1) return oldData; // Chat not found

    // Update last message & updatedAt
    chats[index] = {
      ...chats[index],
      lastMessage: newMessage?.text || chats[index].lastMessage,
      updatedAt: new Date().toISOString(),
      unseenCount: updatedUnseenCount
        ? (chats[index].unseenCount || 0) + 1
        : chats[index].unseenCount
    };

    // Move to top
    const [chat] = chats.splice(index, 1);
    chats.unshift(chat);

    return chats;
  });
};

  useEffect(() => {
    if (!loading && !isAuth) {
      router.push("/auth/login")
    }
  }, [isAuth, loading])

  useEffect(() => {
    setMessages(messagesData?.data?.allMessage)
  }, [messagesData])

  useEffect(() => {
    socket?.on("newMessage", (message) => {
      console.log("Received new message :", message)
      if(selectedChat._id === message.chatId){
        setMessages((prev:any) => {
          const currentMessages = prev || [];
          const messageExist = currentMessages.some((msg:any) => msg._id === message._id)
          if(!messageExist){
            return [...currentMessages, message]
          }
          return currentMessages;
        })
      }
    })


    return () => {
      socket?.off("newMessage")
    }
  },[selectedChat])

  // join a chat room
  useEffect(() => {
    if (selectedChat) {
      socket?.emit("joinChat", selectedChat?._id)
    }

    return () => {
      socket?.emit("leaveChat", selectedChat?._id)
      setMessages(null)
    }
  }, [socket, selectedChat,])

  if (loading || getChatsLoading) return <RotatingLoader className="bg-black min-h-screen text-white flex justify-center items-center" classNameLoader="w-[150px] h-[150px] animate-spin text-white" />

  return (
    <div className='min-h-screen flex bg-slate-900' >
      <div>
        <ChatSidebar
          chats={data}
          openSearchUser={openSearchUser}
          setOpenSearchUser={setOpenSearchUser}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          onlineUsers={onlineUsers}
        />
      </div>
      <div className='flex-1 flex flex-col  px-5'>
        <ChatHeader
          selectedChat={selectedChat}
          onlineUsers={onlineUsers}
        />

        <ChatMessages
          selectedChat={selectedChat}
          loggedInUser={loggedinUser}
          messages={messages}
          getMessagesLoading={getMessagesLoading}
        />

        <MessageInput
          selectedChat={selectedChat}
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          handleMessageSend={handleMessageSend}
        />
      </div>
    </div>
  )
}

export default page