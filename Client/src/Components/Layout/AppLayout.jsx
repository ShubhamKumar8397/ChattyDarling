import React from 'react'
import { Outlet } from 'react-router-dom'
import Title from '../Shared/Title'
import Header from './Header'
import ChatList from '../Specific/ChatList'
import chats from '../../constants/sampleData'
import Profile from '../Specific/Profile'

const AppLayout = () => WrappedComponents => {
    return (props) => {
        return (
           <>
           <Header/>
            <div className='h-screen grid grid-cols-[250px_1fr_1fr] m-4 gap-4'>
                <div>
                    <ChatList chats={chats}/>
                </div>
                <WrappedComponents {...props}/>
               <div>
                <Profile/>
               </div>
            </div>
           </>
        )
    }

}

export default AppLayout