"use client"

import { RotatingLoader } from '@/components/shared/Loader'
import { useAppData } from '@/context/AppContext'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const page = () => {

  const router = useRouter()
  const {isAuth, user, loading} = useAppData()

 useEffect(() => {
  if (!loading) {
    if (!isAuth) router.push("/auth/login")
    else router.push("/chat")
  }
}, [loading, isAuth])


  if(loading) return <RotatingLoader className="bg-black min-h-screen text-white flex justify-center items-center" classNameLoader="w-[150px] h-[150px] animate-spin text-white" />

}

export default page