import { MoveRight } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const login = () => {
  return (
      <>
        <form action="">
          <input
            className='w-full  text-[18px] font-medium outline-none px-3 py-2 rounded-md  border-1 focus:border-green-400 placeholder:text-[18px] mb-3 transition-all duration-300'
            type="text"
            name='email'
            placeholder='Enter Email'
          />
  
          <input
            className='w-full text-[18px] font-medium  outline-none px-3 py-2 rounded-md  border-1 focus:border-green-400 placeholder:text-[18px]  transition-all duration-300'
            type="password"
            name='password'
            placeholder='Enter Password'
          />
  
          <button className='w-full flex justify-center items-center gap-2 text-center bg-green-600 px-2 py-3 rounded-md hover:bg-green-700 cursor-pointer text-xl font-medium transition-all duration-300 mt-4'>
            Signup Now
            <MoveRight className='font-extrabold' />
          </button>
  
          <p className='text-white text-center font-medium mt-3 text-[16px]'>Don't Have An Account ?
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