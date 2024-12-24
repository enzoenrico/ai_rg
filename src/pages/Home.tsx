import { motion } from 'motion/react'

import { useState, useEffect } from 'react'
import { ModelCanvas } from '../components/ModelCanvas'
import { AnimatedResponse } from '../components/AnimatedResponse'

export const Home = () => {
  const [active, setLoading] = useState(false)
  const [userInput, setUserInput] = useState<string>('')
  const [aiResponse, setAIResponse] = useState<string>('...')

  const callAi = async () => {
    setLoading(true)
    try {
      console.log(userInput)
      const response = await fetch('http://localhost:5000/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Token': 'your-secret-token' // Add the required authentication token
        },
        body: JSON.stringify({
          query: userInput
        })
      })
      const data = await response.json()
      setAIResponse(data.response)
    } catch (error) {
      setAIResponse('connection lost, try again')
      console.error(error)
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
        <form
          className='absolute bottom-5 w-full flex items-center justify-center gap-8'
          onSubmit={e => {
            e.preventDefault()

            callAi()
          }}
        >
          <input
            type='text'
            placeholder='ask?'
            className='w-3/5 p-2 px-4  bg-slate-600/20 border-2 border-red-600 text-white orbitron'
            onChange={e => setUserInput(e.target.value)}
          />{' '}
          <button
            type='submit'
            className='orbitron bg-black border-2 border-white text-white p-2'
          >
            Transform
          </button>
        </form>
        <div className='absolute top-50 text-white px-5'>
          {active ? (
            <p className='font-mono  vt323 text-4xl '>
              <AnimatedResponse text={'loading...'} />
            </p>
          ) : (
            <p className='font-mono  vt323 text-4xl '>
              <AnimatedResponse text={aiResponse} />
            </p>
          )}
        </div>
      </motion.div>
    </>
  )
}
