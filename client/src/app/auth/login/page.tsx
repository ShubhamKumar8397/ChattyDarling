"use client"

import { RotatingLoader } from '@/components/shared/Loader'
import PasswordInput from '@/components/shared/PasswordInput'
import { useAppData } from '@/context/AppContext'
import { useLoginUserQuery } from '@/tanstackQueries/userQueries'
import { loginUser } from '@/typesTs/auth.types'
import { MoveRight } from 'lucide-react'
import Image from 'next/image'
import { redirect, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const login = () => {

  const {user, setUser, isAuth, setIsAuth, loading:contextLoading} = useAppData()
  const { mutateAsync: loginUserMutate, isPending, isError, error } = useLoginUserQuery()
  const router = useRouter()
  const [formdata, setFormdata] = useState<loginUser>(
    {
      email: "",
      password: ""
    }
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formdata.email || !formdata.password) {
      toast.error("Please Enter Details For Login")
      return
    }
    try {
      const response = await loginUserMutate(formdata);
      setUser(response.data),
      setIsAuth(true)
      toast.success(response.message)
    } catch (error: any) {
      toast.error(error.message)
      // setFormdata({
      //   email : "",
      //   password : "",
      // })
    }
  }


  // // Give a look to it sense wrong part
  // if (contextLoading) return <RotatingLoader/>
  // if (isAuth) redirect("/chat")

  return (
    <>
      <form onSubmit={handleLogin}>
        <input
          className='w-full  text-[18px] font-medium outline-none px-3 py-2 rounded-md  border-1 focus:border-green-400 placeholder:text-[18px] mb-3 transition-all duration-300'
          type="text"
          name='email'
          placeholder='Enter Email'
          // value={formdata.email}
          onChange={handleInputChange}
        />

        <PasswordInput
          placeholder="password"
          name="password"
          onChange={handleInputChange}
        // value={formdata.password}
        />

        <button className='w-full flex justify-center items-center gap-2 text-center bg-green-600 px-2 py-3 rounded-md hover:bg-green-700 cursor-pointer text-xl font-medium transition-all duration-300 mt-4'
          type='submit'
        >
          Login Now
          <MoveRight className='font-extrabold' />
        </button>

        <p onClick={() => router.push("/auth/signup")} className='text-white text-center font-medium mt-3 text-[16px]'>Don't Have An Account ?
          <span className='text-green-500 cursor-pointer hover:text-green-400'> SignUp Now</span>
        </p>
      </form>

      <p className='text-gray-300 mt-1 text-center'>OR</p>

      <button className='w-full mt-2 bg-white px-3 py-2 rounded-md flex gap-1 justify-center items-center hover:bg-gray-200 cursor-pointer'>
        <Image
          className='p-1'
          src="/google.png"
          alt="Google Logo"
          width={40}
          height={40}
        />

        <p className='text-black font-medium text-xl '>Login With Google</p>
      </button>
    </>
  )
}

export default login