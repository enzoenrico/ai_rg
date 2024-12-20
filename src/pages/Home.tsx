import { motion } from 'motion/react'

import { useState, useEffect } from 'react'
import { ModelCanvas } from '../components/ModelCanvas'
import { FaSpinner } from 'react-icons/fa6'
import { AnimatedResponse } from '../components/AnimatedResponse'

export const Home = () => {
  const [active, setLoading] = useState(false)
  const [userInput, setUserInput] = useState<string>('')
  const [aiResponse, setAIResponse] = useState<string>('...')

  const callAi = async () => {
    setLoading(true)
    try {
      console.log(userInput)
      await new Promise(resolve > setTimeout(resolve, 2000))
      setAIResponse(userInput)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(
      () => setAIResponse('talk to your digital self'),
      1500
    )
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <motion.div
        className='h-screen w-screen flex items-center justify-center relative bg-red-900'
        initial={{ opacity: 0, color: '#ff0000' }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3 }}
      >
        <ModelCanvas loading={active} setLoading={setLoading} />
        <div className='absolute bottom-5 w-full flex items-center justify-center gap-8'>
          <input
            type='text'
            placeholder='hello'
            className='w-3/5 p-2 px-4  bg-slate-600/20 border-2 border-red-600 text-white orbitron'
            onChange={e => setUserInput(e.target.value)}
          />
          <button
            type='button'
            className='orbitron bg-black border-2 border-white text-white p-2 '
            onClick={callAi}
          >
            Transform
          </button>
        </div>
        <div className='absolute top-50 text-white px-5'>
          {active ? (
            <motion.p className='font-mono orbitron vt323 text-4xl '>
              <AnimatedResponse text={'loading...'} />
            </motion.p>
          ) : (
            <motion.p className='font-mono orbitron vt323 text-4xl '>
              <AnimatedResponse text={aiResponse} />
            </motion.p>
          )}
        </div>
      </motion.div>
    </>
  )
}
