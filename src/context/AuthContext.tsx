import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'

interface AuthContextType {
  isAuthed: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthed, setIsAuthed] = useState<boolean>(() => {
    return localStorage.getItem('is_authedUser') == 'true'
  })

  useEffect(() => {
    localStorage.setItem('is_authedUser', String(isAuthed))
  }, [isAuthed])

  // login logut logic needs to be moved to separate component
  const login = () => {
    setIsAuthed(true)
    localStorage.setItem('isAuthed', 'true')
  }
  const logout = () => {
    setIsAuthed(false)
    localStorage.removeItem('isAuthed')
  }

  if (AuthContext !== null) {
    return (
      <AuthContext.Provider value={{ isAuthed, login, logout }}>
        {children}
      </AuthContext.Provider>
    )
  }
}

export const useAuth = () => {
  // returns the authentication context for app-scope operations
  const context = useContext<AuthContextType>(AuthContext)
  if (!context)
    throw new Error('[-] useAuth must be used within <AuthProvider>')
  return context
}
