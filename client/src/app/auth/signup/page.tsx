"use client"
import { MoveRight } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'

import { useUserRegisterQuery } from '@/tanstackQueries/userQueries'
import { toast } from 'react-toastify'
import { registerSchema } from '@/lib/zodValidators'
import PasswordInput from '@/components/shared/PasswordInput'
import { useRouter } from 'next/navigation'
import { RotatingLoader } from '@/components/shared/Loader'



const signup = () => {

  const router = useRouter()
  const { mutateAsync: createAccount, isPending: SignupPending, error } = useUserRegisterQuery()

  const [formdata, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  // handle form data
  const handleFormdata = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  // handle Register User
  const handleRegisterUser = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const result = registerSchema.safeParse(formdata)

      // show toast error if formdata fills wrong
      if (!result.success) {
        const formatted = result.error.format()

        Object.entries(formatted).forEach(([field, value]: [any, any]) => {
          if (value._errors && value._errors.length > 0) {
            toast.error(value?._errors[0])
          }
        })
        return;
      }

      // now CreateAccount
      const response = await createAccount(formdata);
      router.push(`/auth/verifyEmail?email=${formdata.email}`)
      toast.info("OTP Sent To Your Email")

    } catch (error: any) {
      console.log(error)
      toast.error(error?.message)
    }

  }


  return (
    <>
      <form onSubmit={(e) => handleRegisterUser(e)} >
        <input
          className='w-full text-[18px] font-medium  outline-none px-3 py-2 rounded-md  border-1 focus:border-green-400 placeholder:text-[18px] mb-3 transition-all duration-300'
          type="text"
          name='name'
          placeholder='Enter Name'
          onChange={handleFormdata}
        />

        <input
          className='w-full  text-[18px] font-medium outline-none px-3 py-2 rounded-md  border-1 focus:border-green-400 placeholder:text-[18px] mb-3 transition-all duration-300'
          type="text"
          name='email'
          placeholder='Enter Email'
          onChange={handleFormdata}
        />

        <PasswordInput
          placeholder="password"
          name="password"
          onChange={handleFormdata}
        />


        <button
          type='submit'
          disabled={SignupPending}
          className='w-full flex items-center justify-center gap-2 text-center bg-green-600 px-2 py-3 rounded-md hover:bg-green-700 cursor-pointer text-xl font-medium transition-all duration-300 mt-4'>

          {
            SignupPending ?
              <span className='flex flex-row gap-2 items-center justify-center'> <RotatingLoader /> Signin In... </span> :
              <span className='flex flex-row gap-2 items-center justify-center'> Signup Now <MoveRight className='font-extrabold' /></span>
          }

        </button>

        <p onClick={() => router.push("/auth/login")} className='text-white text-center font-medium mt-3 text-[16px]'>Already Have An Account ?
          <span className='text-green-500 cursor-pointer hover:text-green-400'> Login Now</span>
        </p>
      </form>

      <p className='text-gray-300 mt-1 text-center'>OR</p>

      <button className='w-full mt-2 bg-white px-3 py-2 rounded-md flex gap-1 justify-center items-center hover:bg-gray-200 cursor-pointer'

      >
        <Image

          className='p-1'
          src="/google.png"
          alt="Google Logo"
          width={40}
          height={40}
        />

        <p className='text-black font-medium text-xl '>SignUp With Google</p>
      </button>
    </>
  )
}



export default signup;