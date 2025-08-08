import { loginUser, registerUser, VerificationUser } from "@/typesTs/auth.types";
import axios from "axios";

const userApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASEURL_USER as string
})


const registerAccount = async (data: registerUser) => {
    try {
        const userResponse = await userApi.post("/register-user", data)
        return userResponse.data;
    } catch (error: unknown) {
        let message = "Something went wrong"
        if (axios.isAxiosError(error)) {
            // Avoid exposing raw server responses directly
            message = error.response?.data?.message || message
        }
        // Always throw proper Error objects
        throw new Error(message)
    }
}

const verifyEmailEndpoint = async (data:VerificationUser) => {
    try {
        if (!data.email || !data.otp) {
            throw Error("Email Not Received")
        }
        const response = await userApi.post("/verify-user", data)
        return response.data
    } catch (error) {
        let message = "Something went wrong"
        if (axios.isAxiosError(error)) {
            // Avoid exposing raw server responses directly
            message = error.response?.data?.message || message
        }
        // Always throw proper Error objects
        throw new Error(message)
        
    }
}

const resendOtpEndpoint = async ({email}:{email :string}) => {
    try {
        if (!email) {
            throw Error("Email Not Received")
        }
        const response = await userApi.post("/resend-otp", {email})
        return response.data
    } catch (error) {
        let message = "Something went wrong"
        if (axios.isAxiosError(error)) {
            // Avoid exposing raw server responses directly
            message = error.response?.data?.message || message
        }
        // Always throw proper Error objects
        throw new Error(message)
        
    }
}

const loginUserEndpoint = async(data:loginUser) => {
    try {
        const response = await userApi.post("/login-user", data,{
            withCredentials: true
        })
        return response.data
    } catch (error) {
        let message = "Login Not Successful Please Try Again"
        if (axios.isAxiosError(error)) {
            // Avoid exposing raw server responses directly
            message = error.response?.data?.message || message
        }
        // Always throw proper Error objects
        throw new Error(message)
    }
}

const getAllUserEndpoint = async() => {
    try {
        const response = await userApi.get("/get-all-users",{
            withCredentials : true
        })
        return response.data
    } catch (error) {
        let message = "Error In fetching Users"
        if (axios.isAxiosError(error)) {
            // Avoid exposing raw server responses directly
            message = error.response?.data?.message || message
        }
        // Always throw proper Error objects
        throw new Error(message)
    }
}

export { registerAccount, verifyEmailEndpoint, resendOtpEndpoint, loginUserEndpoint, getAllUserEndpoint }