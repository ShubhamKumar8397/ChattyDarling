import { useAppData } from "@/context/AppContext"
import { useNewChatMutation } from "@/tanstackQueries/chatQueries"
import { useGetAllUsersQuery } from "@/tanstackQueries/userQueries"
import { CornerDownLeft, CornerDownRight, LogOut, MessageCircle, Minus, Plus, Search, User } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

export const ChatSidebar = ({ chats, openSearchUser, setOpenSearchUser, selectedChat, setSelectedChat }: any) => {

  const [searchText, setSearchText] = useState('')

  const { data: allUsers, isLoading: loadingGetUsers } = useGetAllUsersQuery()
  const { mutateAsync: createNewChat, isPending: pendingNewchat } = useNewChatMutation()
  const { user, logoutUser } = useAppData()

  const handleNewChat = async ({ userId }: { userId: string }) => {
    try {
      const response = await createNewChat({ otherUserId: userId })
      toast.success(response.message)
      setOpenSearchUser(false)
      setSearchText("")
      setSelectedChat(null)
    } catch (error: any) {
      console.log(error)
      toast.error(error.message)
    }
  }


  return (
    <aside className="relative h-screen w-80 bg-gray-900 border-r border-gray-700 overflow-x-hidden  px-2 text-white">
      {/* header */}
      <div className='p-6 border-b border-gray-700 flex justify-between '>
        <div>Chatty Bhosdi</div>
        <button
          onClick={() => setOpenSearchUser((prev: boolean) => !prev)}
        >
          {
            openSearchUser ? (
              <Minus className="h-[25px] w-[25px] bg-red-500 rounded-sm hover:bg-red-800 cursor-pointer" />
            ) : (
              <Plus className="h-[25px] w-[25px] bg-green-500 rounded-sm hover:bg-green-800 cursor-pointer" />
            )
          }
        </button>
      </div>

      {/* Logic For Search Users */}
      {
        openSearchUser && (
          !loadingGetUsers && allUsers.data && allUsers.data.length > 0 ?
            <div className="pb-20 overflow-y-auto " >
              {/* // search Input For Users */}
              <div className="relative my-2">
                <div className="absolute left-2 top-1/2 -translate-y-1/2 " >
                  <Search />
                </div>
                <input type="text"
                  placeholder="Search User"
                  className="w-full  px-3 pl-10 py-2 outline-none rounded-md border-1 border-slate-700 text-xl focus:border-1 focus:border-gray-500"
                  onChange={(e: any) => setSearchText(e.target.value)}
                />
              </div>

              {
                /* search for  the users and all users name show here */
                allUsers.data.filter((userData: any) => userData.name.toLowerCase().includes(searchText)).map((user: any) => (
                  !pendingNewchat && (
                    <div className={`w-full p-2 cursor-pointer flex gap-2 mb-1 mt-1 justify-start items-center hover:bg-gray-500 transition-all border-1 border-gray-700 rounded-md`}
                      key={user._id}
                      onClick={() => handleNewChat({ userId: user._id })}
                    >
                      <div>
                        <User className="h-10 w-10 p-2 rounded-full border-1 border-white" />
                      </div>
                      <div className="flex flex-col justify-start ">
                        <p className="text-[16px] font-medium " >{user.name}</p>
                        <p className=" text-sm">Click To Start Chat</p>
                      </div>
                    </div>
                  )
                ))
              }
            </div>
            :
            (
              <h1>Hey here logic of no user found</h1>
            )
        )

      }


      {/* Logic For All Chats::::*/}
      {
        !openSearchUser && (
          chats && chats.data && chats.data.length > 0 ? (
            /* Main Div For Show Chats start here */
            <div className="pb-20 overflow-y-auto overflow-x-hidden ">
              {
                chats.data.map((chat: any) => (
                  <div className={`w-full p-2  mb-1 mt-1 hover:bg-gray-500 transition-all rounded-md
                    ${chat._id === selectedChat?._id ? "bg-blue-600" : ""} `}
                    onClick={() => setSelectedChat(chat)}
                    key={chat._id}
                  >
                    <div className="w-full flex gap-2 justify-start items-start" >
                      <User className="h-10 w-10 p-2 rounded-full border-1 border-white" />
                      <div>
                        <div className="flex justify-between w-full">
                          <p className="text-[16px] font-medium " >{chat.receiverUserData.name}</p>
                          {
                            chat.unseenMessages?.unseenCount > 0 && (
                              <p className="bg-red-500 rounded-full flex items-center justify-center p-[2px] text-center h-[20px] w-[20px]">{chat.unseenMessages?.unseenCount}</p>
                            )
                          }
                        </div>
                        {
                          chat.latestMessage && (
                            <div className="flex gap-1 items-center">
                              {user && chat.latestMessage.sender === user?._id ? (
                                <CornerDownLeft className="text-green-300 h-4 w-4" />
                              ) : (
                                <CornerDownRight className="text-red-600" />
                              )}
                              <span className="text-sm truncate max-w-[200px] overflow-hidden">
                                {chat.latestMessage.text}
                              </span>
                            </div>
                          )
                        }
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>  /* comment ::: Main Div End For show chat */
          ) :
            (
              /* comment :: Logic For No Chats Found */
              <div className="flex flex-col justify-center items-center min-h-1/2 ">
                <MessageCircle className="h-20 w-20 bg-gray-600 p-2 rounded-full text-gray-300 mb-4 " />
                <p className="mb-2 text-gray-300">Start a New Conversation</p>
                <button className="px-3 py-2 text-xl font-normal border-2 border-green-900 rounded-md 
                cursor-pointer bg-green-600 hover:bg-green-900 transition-all duration-300 "
                  onClick={() => setOpenSearchUser((prev: boolean) => !prev)}
                >
                  Click To Start
                </button>
              </div>
            )
        )

      }

      <button className="absolute bottom-4 left-0 px-3 w-full flex justify-start text-xl cursor-pointer items-center gap-2 py-2 outline-none text-red hover:bg-red-700 
      hover:text-white transition-all rounded-md duration-300"
        onClick={() => logoutUser()}
      >
        <LogOut className="h-7 w-7" /> <span>Logout</span>
      </button>


    </aside>
  )
}
