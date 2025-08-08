import { creatNewChatEndpoint, getAllChatsEndpoint, getAllMessagesEndpoint } from "@/endpointsApi/chat.endpoint"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"


export const useGetAllChatsQuery = ()  => {
    return useQuery({
        queryFn : getAllChatsEndpoint,
        queryKey:["getAllChats"]
    })
}

export const useNewChatMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn : ({otherUserId}:{otherUserId : string} ) => creatNewChatEndpoint({otherUserId}),
        onSuccess:() => {
            queryClient.invalidateQueries({queryKey : ["getAllChats"]})
        }
    })  
}

export const useGetAllMessagesQuery = ({chatId}:{chatId:string}) => {
    return useQuery({
        queryFn:() => getAllMessagesEndpoint({chatId}), 
        queryKey:["getAllMessage", chatId],    // if chatId change new Data fetches
        enabled: !!chatId,     // ✅ Only run when chatId exists
        // staleTime: 0,                        // ✅ Always fetch fresh
        // cacheTime: 0                         // ✅ Optional: don't keep cache
    })
}