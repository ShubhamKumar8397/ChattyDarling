import React, { memo } from 'react'
import { Link } from 'react-router-dom'

const ChatItem = ({
    avatar=[],
    name,
    _id,
    groupChat = false,
    sameSender,
    isOnline,
    newMessageAlert,
    index= 0,
    handleDeleteChatOption,
}) => {

    if(avatar){
        console.log(avatar)
    }

    return(
        <>
            <Link to={`/chats/${_id}`} c >
            <div className={`${isOnline ? "bg-green-300" : "bg-gray-300"} flex gap-2 mb-3`} >
                
                <div >
                    <img className='w-[80px] h-[80px] rounded-full overflow-hidden object-cover'  src={avatar} alt="" />
                </div>
                <h1 className='font-bold'>{name}</h1>
            </div>
        </Link>
        <Link to={`/chats/${_id}`} >
            <div className={`${isOnline ? "bg-green-300" : "bg-gray-300"} flex gap-2`} >
                
                <div >
                    <img className='w-[80px] h-[80px] rounded-full overflow-hidden object-cover'  src={avatar} alt="" />
                </div>
                <h1 className='font-bold'>{name}</h1>
            </div>
        </Link>
        </>
    )
}

export default memo(ChatItem)