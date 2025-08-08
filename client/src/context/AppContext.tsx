"use client"

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export interface User {
    _id: string;
    name: string;
    email: string;
}

export interface Chat {
    _id: string;
    users: string;
    latestMessage: {
        text: string;
        sender: string;
    };
    createdAt: string;
    updatedAt: string;
    unseenCount?: number;
}

export interface Chats {
    _id: string;
    user: User;
    chat: Chat;
}

interface AppContextTyPe {
    user: User | null;
    loading: boolean;
    isAuth: boolean;
    setUser: React.Dispatch<React.SetStateAction<User | null>>
    setIsAuth: React.Dispatch<React.SetStateAction<boolean>>
    logoutUser: () => Promise<void>;
    // fetchChats : () => Promise<void>;
    // chats: Chats[] | null;
    // setChats : React.Dispatch<React.SetStateAction<Chats[] | null>>
    // chatsLoading: boolean;
}


const AppContext = createContext<AppContextTyPe | undefined>(undefined);

interface AppProviderProp {
    children: ReactNode
}

export const AppProvider: React.FC<AppProviderProp> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    async function fetchUser() {
        try {
            const hasToken = Cookies.get("hasToken");
            if (!hasToken) {
                return;
            }
            setLoading(true)
            const response = await axios.get("http://localhost:5000/api/v1/user/get-current-user", {
                withCredentials: true
            })
            setUser(response.data.data)
            setIsAuth(true);
        } catch (error) {
            setIsAuth(false)
            setLoading(false);
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    async function logoutUser() {
        try {
            const hasToken = Cookies.get("hasToken");
            setLoading(true)
            if (!hasToken) {
                setIsAuth(false)
                setUser(null)
                return
            }
            const response = await axios.post("http://localhost:5000/api/v1/user/logout-user", {}, {
                withCredentials: true
            })
            setIsAuth(false);
            setUser(null)
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])


    return (
        <AppContext.Provider value={{ user, setUser, isAuth, setIsAuth, loading, logoutUser }}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppData = (): AppContextTyPe => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppData must be used within App Provider")
    }
    return context;
}