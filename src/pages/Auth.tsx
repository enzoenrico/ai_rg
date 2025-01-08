import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AnimatedResponse } from '../components/AnimatedResponse'
import { motion } from 'motion/react'

export const Auth = () => {
  const navigate = useNavigate()
  const { isAuthed, login, logout } = useAuth()

  const handleLogin = () => {
    // change with the actual content
    login({ email: '', password: '' })
    navigate('/')
  }
  const handleLogout = () => {
    logout()
  }

  return (
    <div className='bg-red-950 orbitron w-screen h-screen flex flex-col items-center justify-center gap-4'>
      <div className='vt323 text-4xl'>
        <AnimatedResponse text='insert the twitter handle' />
      </div>
      <motion.input
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        placeholder='i.e ky0uko___'
        name='twitter_name'
        id='twitter_name'
        className='  bg-black text-white p-2 border-2'
      />
      <button
        onClick={handleLogin}
        className='border-red-900 hover:border-red-800 border-2 text-white p-5 bg-black '
      >
        <p className='flex items-center'>
          login with {isAuthed ? '(Already logged in)' : ' '}
          {/* <FaXTwitter /> */}
        </p>
      </button>
      <button onClick={handleLogout} className='bg-white px-5 py-2 '>
        Logout
      </button>
    </div>
  )
}
