import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AnimatedResponse } from '../components/AnimatedResponse'

export const Auth = () => {
  const navigate = useNavigate()
  const { isAuthed, login, logout } = useAuth()

  const handleLogin = () => {
    login()
    navigate('/')
  }
  const handleLogout = () => {
    logout()
  }

  return (
    <div className='bg-red-950 orbitron w-screen h-screen flex flex-col items-center justify-center gap-4'>
      <div className='vt323 text-4xl'>
        <AnimatedResponse text='log in?' />
      </div>
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
