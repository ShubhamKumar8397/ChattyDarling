import { BookHeart } from "lucide-react";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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