import axios from "axios";

const chatApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASEURL_CHAT
})

export const getAllChatsEndpoint = async () => {
    try {
        const response = await chatApi.get("/get-all-chats", {
            withCredentials: true
        })

        return response.data
    } catch (error) {
        console.log(error)
        let message = "Chats Not Fetched"
        if (axios.isAxiosError(error)) {
            // Avoid exposing raw server responses directly
            message = error.response?.data?.message || message
        }
        // Always throw proper Error objects
        throw new Error(message)
    }
}

export const creatNewChatEndpoint = async ({ otherUserId }: { otherUserId: string }) => {
    try {
        const response = await chatApi.post("/new-chat", { otherUserId }, {
            withCredentials: true
        })
        return response.data
    } catch (error) {
        console.log(error)
        let message = "New Chat Not Formed"
        if (axios.isAxiosError(error)) {
            // Avoid exposing raw server responses directly
            message = error.response?.data?.message || message
        }
        // Always throw proper Error objects
        throw new Error(message)
    }
}

export const sendMessageEndpoint = async (data:any) => {
    try {
        const response = await chatApi.post("/send-message", data, {
            withCredentials: true
        })
        return response.data
        console.log(response)
    } catch (error) {
        console.log(error)
        let message = "New Chat Not Formed"
        if (axios.isAxiosError(error)) {
            // Avoid exposing raw server responses directly
            message = error.response?.data?.message || message
        }
        // Always throw proper Error objects
        throw new Error(message)
    }
}

export const getAllMessagesEndpoint = async ({ chatId }: { chatId: string }) => {
    try {
        const response = await chatApi.get(`/get-all-messages/${chatId}`, {
            withCredentials: true
        })
        return response.data
    } catch (error) {
        console.log(error)
        let message = "Messages Not Fetched"
        if (axios.isAxiosError(error)) {
            // Avoid exposing raw server responses directly
            message = error.response?.data?.message || message
        }
        // Always throw proper Error objects
        throw new Error(message)
    }
}