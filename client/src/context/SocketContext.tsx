"use client"

import { ReactNode, useContext, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"
import { createContext } from "react"
import { useAppData } from "./AppContext"


interface SocketContextType {
    socket: Socket | null
    onlineUsers : String[];
}


const SocketContext = createContext<SocketContextType>({
    socket: null,
    onlineUsers : []
})

interface ProviderProps {
    children: ReactNode
}

export const SocketProvider = ({ children }: ProviderProps) => {
    const [socket, setSocket] = useState<Socket | null>(null)
    const { user } = useAppData()
    const [onlineUsers, setOnlineUsers] = useState<string[]>([])

    useEffect(() => {
        if (!user?._id) return
        console.log(user._id)
        // connect socket to bakckend io
        const newSocket = io("http://localhost:5000",{
            query:{
                userId : user._id
            }
        })

        console.log(newSocket)
        setSocket(newSocket)

        // get The online users array
        newSocket.on("getOnlineUser",(users:string[]) => {
            setOnlineUsers(users)
        })

        return () => {
            newSocket.disconnect()
        }
    }, [user?._id])

    return <SocketContext.Provider  value={{socket, onlineUsers}} >
        {children}
    </SocketContext.Provider>

}

export const SocketData = () => useContext(SocketContext)