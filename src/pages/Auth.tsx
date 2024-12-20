import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AnimatedResponse } from '../components/AnimatedResponse'
import { useEffect, useState } from 'react'

export const Auth = () => {
  const navigate = useNavigate()
  const { isAuthed, login, logout } = useAuth()
  const [welcomeMessage, setWelcomeMessage] = useState('...')

  useEffect(() => {
    const timer = setTimeout(() => setWelcomeMessage('Welcome...'), 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleLogin = () => {
    login()
    navigate('/')
  }
  const handleLogout = () => {
    logout()
  }

  return (
    <div className='bg-red-950 w-screen h-screen flex flex-col items-center justify-center gap-4'>
      <p className='font-mono orbitron vt323 text-4xl '>
        <AnimatedResponse text={welcomeMessage} />
      </p>
      <button
        onClick={handleLogin}
        className='border-red-900 hover:border-red-800 border-2 text-white p-5 bg-black '
      >
        Login {isAuthed ? '(Already logged in)' : ''}
      </button>
      <button onClick={handleLogout} className='bg-white px-5 py-2 '>
        Logout
      </button>
    </div>
  )
}
