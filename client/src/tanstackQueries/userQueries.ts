import { getAllUserEndpoint, loginUserEndpoint, registerAccount, resendOtpEndpoint, verifyEmailEndpoint } from "@/endpointsApi/user"
import { loginUser, VerificationUser } from "@/typesTs/auth.types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

type registerData = {
  name: string,
  email: string,
  password: string,
}


export const useUserRegisterQuery = () => {
  return useMutation<
    any,
    Error,
    registerData>
    ({
      mutationFn: (data) => registerAccount(data)
    })
}

export const useVerifyEmailQuery = () => {
  return useMutation<
    any,
    Error,
    VerificationUser>
    ({
      mutationFn: (data) => verifyEmailEndpoint(data)
    })
}

export const useResendOtpQuery = () => {
  return useMutation({
    mutationFn: ({email}:{email :string}) => resendOtpEndpoint({email})
  })
}

export const useLoginUserQuery = () => {
  return useMutation<
  any,
  Error,
  loginUser>
  ({
    mutationFn : (data) => loginUserEndpoint(data)
  })
}

export const useGetAllUsersQuery = () => {
  return useQuery({
    queryFn: getAllUserEndpoint,
    queryKey : ["getAllUsers"]
  })
}