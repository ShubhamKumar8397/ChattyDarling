

export type registerUser = {
    name : string,
    email : string,
    password : string,
}

export type VerificationUser = {
    email : string,
    otp : string,
}

export type loginUser = {
    email :string,
    password : string,
}