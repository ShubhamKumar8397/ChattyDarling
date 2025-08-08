"use client"
import React, { useEffect, useRef, useState } from 'react'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { redirect, useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { useResendOtpQuery, useVerifyEmailQuery } from '@/tanstackQueries/userQueries';
import { VerificationUser } from '@/typesTs/auth.types';
import {RotatingLoader} from "@/components/shared/Loader"
import { useAppData } from '@/context/AppContext';
import { Skeleton } from '@/components/ui/skeleton';


const VerifyEmail = () => {

    const router = useRouter()
    const searchParam = useSearchParams()
    const paramEmail = searchParam.get("email") as string

    const firstInputRef = useRef<HTMLInputElement | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const [otp, setOtp] = useState("")
    const [resendTime, setResendTime] = useState(Number("31"))


    const { mutateAsync: emailVerificationMutate, isPending: verificationPending, isError: verificationError } = useVerifyEmailQuery()
    const { mutateAsync: resendOtpMutate, isPending, isError } = useResendOtpQuery()
    

    const handleVerifyEmail = async () => {

        if (!(Number(otp))) {
            toast.error("Otp Enter Is Invalid")
            return;
        }
        if (!otp || Number(otp) < 100000 || Number(otp) > 1000000) {
            toast.error("Enter Full Otp")
            return;
        }

        try {
            const data: VerificationUser = {
                email: paramEmail,
                otp,
            }
            const response = await emailVerificationMutate(data)
            toast.success(response.message)
            router.push("/auth/login")
        } catch (error: any) {
            if(error.message.trim().toLowerCase() === "register again"){
                router.push("/auth/signup")
            }
            toast.error(error.message)
        }
    }

    const startResendCountDown = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
        }

        intervalRef.current = setInterval(() => {
            setResendTime((prev) => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current!)
                    intervalRef.current = null
                    setResendTime(31)
                    return 0;
                }
                return prev - 1
            })
        }, 1000)
    }

    const handleResendOtp = async () => {
        if (resendTime != 31) {
            toast.info("Wait Sometime to Resend")
            return;
        }
        try {
            startResendCountDown();
            const response = await resendOtpMutate({ email: paramEmail })
            toast.info(response.message)
        } catch (error: any) {
            if (error.message.trim().toLowerCase() == "please register again") {
                router.push("/auth/signup")
            }
            toast.error(error.message)
        }
    }

    useEffect(() => {
        startResendCountDown()
        firstInputRef.current?.focus();
    }, []);


    return (
            <div>
                <div className='w-full  flex flex-col items-center'>
                    <p className='text-[16px] font-medium ' >OTP Send To</p>
                    <p className='text-[16px] font-medium text-green-500'>{paramEmail}</p>
                    <h1 className='text-xl font-medium mb-5'>Enter 6 Digit OTP</h1 >
                    <InputOTP value={otp} onChange={setOtp} maxLength={6} ref={firstInputRef} >
                        <InputOTPGroup  >
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>

                    <button className='px-3 w-full flex justify-center items-center gap-4 text-[16px] font-medium bg-green-400 py-2 rounded-md mt-6 cursor-pointer hover:bg-green-600 transition-all duration-300 '
                        disabled={verificationPending}
                        onClick={handleVerifyEmail}
                    >
                        {
                            verificationPending ? <span className='flex gap-2'> <RotatingLoader/> Verification... </span>  : " Submit OTP"
                        }
                    </button>
                </div >
                <p className={`${resendTime < 31 ? "block" : "hidden"} text-[16px] text-center mt-3 text-gray-300 `}>
                    Resend Again 00:{resendTime}s
                </p>
                <p className={`${resendTime == 31 ? "block" : "hidden"} text-red-400 text-[18px] font-medium text-end mt-3 cursor-pointer hover:underline transition-all duration-300`}
                    onClick={handleResendOtp}
                >
                    Resend OTP
                </p>
            </div >

    )
}

export default VerifyEmail