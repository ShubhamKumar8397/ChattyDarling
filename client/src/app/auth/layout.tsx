"use client"

import { RotatingLoader } from "@/components/shared/Loader";
import { useAppData } from "@/context/AppContext";
import { BookHeart } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect } from "react";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {

    const { isAuth, loading } = useAppData();

    useEffect(() => {
        if (!loading && isAuth) {
            redirect("/chat")
        }
    }, [isAuth])

    if (loading) return <RotatingLoader className="bg-black min-h-screen text-white flex justify-center items-center" classNameLoader="w-[150px] h-[150px] animate-spin text-white" />


    return (
        <>
            <div className="h-screen w-screen bg-black text-white flex justify-center items-center">
                <div className='min-w-[300px] max-w-[350px] h-auto  px-5 py-6  border-2 border-green-600 rounded-2xl '>
                    <div className="flex flex-col items-center justify-center  gap-1  p-2 mb-3">
                        <BookHeart className="w-[60px] h-[60px] bg-black text-red-400 border-2 border-green-400 rounded-full p-2" />
                        <h1 className="font-medium text-2xl text-green-400" >Chatty Darling</h1>
                    </div>
                    {children}
                </div>

            </div>
        </>
    )
}