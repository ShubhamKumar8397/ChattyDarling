import React, { useState } from 'react'
import Container from '@mui/material/Container'



const Login = () => {

  const [isLogin, setIsLogin] = useState(false)
  const [avatar, setAvatar] = useState("")
  const [preview, setPreview] = useState(null);

  const HandleAvatarChange = (e) => {
    const file = e.target.files[0]
    if(file){
      setAvatar(file)
      setPreview(URL.createObjectURL(file));
    }
  }

  const [formData, setFormData] = useState({ username: "", password: "", fullName: "" })

  const handleFormDataChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLogin = (e) => {
    e.preventDefault()
    console.log(formData)
  }

  const handleSignup = (e) => {
    e.preventDefault
  }
  return (
    <Container component={"main"} maxWidth="lg" >
      <div className='bg-gray-600 m-4 p-4 rounded-lg flex flex-col max-w-2xl'>
        {
          isLogin ?
            <>
              <form onSubmit={handleLogin}>
                <h1 className='text-white text-2xl font-bold m-4 text-center'>
                  Login
                </h1>


                <input
                  required="true"
                  type="text"
                  placeholder="Username"
                  name='username'
                  value={formData.username}
                  onChange={handleFormDataChange}
                  className='border-white border-2 px-2 py-1 rounded-lg text-white m-2'
                />

                <input
                  required="true"
                  type="text"
                  placeholder="Password"
                  value={formData.password}
                  name='password'
                  onChange={handleFormDataChange}
                  className='border-white border-2 px-2 py-1 rounded-lg text-white m-2'
                />

                <button
                  type='submit'
                  className="px-3 py-2 bg-green-500 mt-4 rounded-sm text-xl font-bold text-white cursor-pointer"
                >
                  Login
                </button>
              </form>

              <button
                type='submit'
                onClick={() => setIsLogin((prev) => !prev)}
                className='border-none mt-4 underline font-semibold text-white text-xl cursor-pointer'>
                Create Your Account SignUp
              </button>


            </>
            :
            <>
              <form action="" onSubmit={handleSignup}>
                <h1 className='text-white text-2xl font-bold m-4 text-center'>
                  SignUp
                </h1>

                <div>
                  <label htmlFor="avatar" >
                    <img htmlFor="avatar" className='p-4 w-[90px] ' src={avatar ? preview : "/SvgIcons/cameraIcon.svg"} alt="bhsodiwalw" />
                  </label>
                  <input 
                  onChange={HandleAvatarChange}
                  name='avatar' 
                  type="file" className='hidden' 
                  id="avatar" />
                </div>

                <input
                  onChange={handleFormDataChange}
                  required="true"
                  type="text"
                  placeholder="Enter Your Name"
                  name='fullName'
                  value={formData.fullName}
                  className='border-white border-2 px-2 py-1 rounded-lg text-white m-2'
                />

                <input
                  required="true"
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  name='username'
                  onChange={handleFormDataChange}
                  className='border-white border-2 px-2 py-1 rounded-lg text-white m-2'
                />

                <input
                  required="true"
                  type="text"
                  placeholder="Password"
                  value={formData.password}
                  name='password'
                  onChange={handleFormDataChange}
                  className='border-white border-2 px-2 py-1 rounded-lg text-white m-2'
                />

                <button
                  type='submit'
                  className="px-3 py-2 bg-green-500 mt-4 rounded-sm text-xl font-bold text-white cursor-pointer"
                >
                  Signup
                </button>
              </form>
              <button
                onClick={() => setIsLogin((prev) => !prev)}
                className='border-none mt-4 underline font-semibold text-white text-xl cursor-pointer'>
                Login To Your Account
              </button>

            </>
        }
      </div>
    </Container>
  )
}

export default Login