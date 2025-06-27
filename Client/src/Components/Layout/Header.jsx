import React from 'react'

const Header = () => {
  return (
    <div className='flex flex-row items-center justify-between'>
        <h1 className='text-2xl text-red-500 border-b-2 border-b-black py-3 px-2'>Chattu</h1>

        <div>
            <ul className='flex flex-row gap-3 mx-7 cursor-pointer'>
                <li className='hover:bg-amber-500 hover:text-black hover:font-bold transition-all'>Seach</li>
                <li className='hover:bg-amber-500 hover:text-black hover:font-bold transition-all'>Notifi</li>
                <li className='hover:bg-amber-500 hover:text-black hover:font-bold transition-all'>NewGroup</li>
            </ul>
        </div>
    </div>
  )
}

export default Header