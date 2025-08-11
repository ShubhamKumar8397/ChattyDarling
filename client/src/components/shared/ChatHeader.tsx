import { MessageCircle, UserCircle } from 'lucide-react'
import React from 'react'

const ChatHeader = ({ selectedChat, onlineUsers }: any) => {
  return (
    <div className='my-3 bg-gray-800 rounded-lg border border-gray-700 p-3'>
      <div className='flex items-center gap-4'>
        {
          selectedChat ? (
            <>
              <div className='relative'>
                <div className='w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center'>
                  <UserCircle className='w-8 h-8 text-gray-300' />
                  {
                    onlineUsers.includes(selectedChat.receiverUserId) && (
                      <div className='absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full
                              bg-green-500 border-2 border-gray-500'>
                        <span className='absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full
                              bg-green-500 border-2 border-gray-500 animate-ping' >

                      </span>
                      </div>
                    )
                  }
                </div>
                {/* online User Interface define here */}
              </div>

              <div className='flex-1' >
                <h2 className='text-2xl font-medium text-white'>
                  {selectedChat?.receiverUserData?.name}
                </h2>
              </div>
            </>
          ) :
            (
              <>
                <div className='flex items-center gap-4'>
                  <div className='w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center'>
                    <MessageCircle className='w-8 h-8 text-gray-300' />
                  </div>
                  <div>
                    <h1 className='text-xl font-medium text-gray-300' >Select A Conversation</h1>
                    <p className='text-sm font-medium text-gray-400' >Choose a Chat From The Sidebar</p>
                  </div>
                </div>
              </>
            )
        }

      </div>
    </div>
  )
}

export default ChatHeader