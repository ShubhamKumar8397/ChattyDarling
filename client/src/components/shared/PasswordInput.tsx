import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

// interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
// : React.FC<PasswordInputProps>

const PasswordInput = (props:any) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative w-full">
      <input
        type={showPassword ? 'text' : 'password'}
        className="w-full text-[18px] font-medium  outline-none px-3 py-2 rounded-md  border-1 focus:border-green-400 placeholder:text-[18px]  transition-all duration-300'"
        {...props}
      />
      <span
        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-300"
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </span>
    </div>
  )
}

export default PasswordInput
