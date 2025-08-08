
# By Map The Message Send And Render
### Best For High Scalable App



```
"use client"
import { RotatingLoader } from '@/components/shared/Loader'
import { ChatSidebar } from '@/components/shared/ChatSidebar'
import { useAppData } from '@/context/AppContext'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState, useMemo } from 'react'
import { useGetAllChatsQuery, useGetAllMessagesQuery } from '@/tanstackQueries/chatQueries'
import ChatHeader from '@/components/shared/ChatHeader'
import ChatMessages from '@/components/shared/ChatMessages'
import MessageInput from '@/components/shared/MessageInput'
import { sendMessageEndpoint } from '@/endpointsApi/chat.endpoint'
import { toast } from 'react-toastify'

const Page = () => {
  const router = useRouter()
  const { user: loggedinUser, isAuth, loading } = useAppData();
  const { data, isLoading: getChatsLoading } = useGetAllChatsQuery()

  const [openSearchUser, setOpenSearchUser] = useState(false)
  const [selectedChat, setSelectedChat] = useState<any>()
  const [messageInput, setMessageInput] = useState("")

  // 🚀 Store messages in Map
  const [messagesMap, setMessagesMap] = useState<Map<string, any>>(new Map())

  const { data: messagesData, isLoading: getMessagesLoading } =
    useGetAllMessagesQuery({ chatId: selectedChat?._id })

  // Convert Map → Array for rendering
  const uniqueMessages = useMemo(
    () => [...messagesMap.values()],
    [messagesMap]
  )

  // Add message safely
  const addMessage = (msg: any) => {
    setMessagesMap(prev => {
      if (prev.has(msg._id)) return prev // skip duplicates
      const newMap = new Map(prev)
      newMap.set(msg._id, msg)
      return newMap
    })
  }

  // Load initial messages when chat changes
  useEffect(() => {
    if (messagesData?.data?.allMessage) {
      const newMap = new Map()
      messagesData.data.allMessage.forEach((msg: any) => {
        newMap.set(msg._id, msg)
      })
      setMessagesMap(newMap)
    }
  }, [messagesData])

  const handleMessageSend = async (e: any, imageFile?: File) => {
    e.preventDefault();
    if (!messageInput.trim() && !imageFile && !selectedChat) return

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
      addMessage(response.message) // 🚀 Add directly to Map

      setMessageInput("")
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (!loading && !isAuth) {
      router.push("/auth/login")
    }
  }, [isAuth, loading])

  if (loading || getChatsLoading) {
    return (
      <RotatingLoader
        className="bg-black min-h-screen text-white flex justify-center items-center"
        classNameLoader="w-[150px] h-[150px] animate-spin text-white"
      />
    )
  }

  return (
    <div className='min-h-screen flex bg-slate-900'>
      
      ........ -- Same AS The /chat/page.tsx

        <ChatMessages
          selectedChat={selectedChat}
          loggedInUser={loggedinUser}
          messages={uniqueMessages} // 🚀 Already deduped
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

export default Page


```