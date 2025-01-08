import { motion } from 'motion/react'

import { useState, useEffect } from 'react'
import { ModelCanvas } from '../components/ModelCanvas'
import { AnimatedResponse } from '../components/AnimatedResponse'
import { UserInformation } from '../tweet_conn/interfaces'
import { ClosestUsers } from '../components/ClosestUsers'

export const Home = () => {
  const [parsedData, setParsedData] = useState<
    Array<{
      name: string
      pfp: string
    }>
  >([])
  const [active, setActive] = useState(false)
  const [userInput, setUserInput] = useState<string>('')
  const [aiResponse, setAIResponse] = useState<string>('...')

  const formatClosest = (
    data: UserInformation
  ): Array<{ name: string; pfp: string }> => {
    console.log(data)
    if (data.closestConnections) {
      const closest = data.closestConnections
      const parsed = closest.map(user => {
        return { name: user.name, pfp: user.pfp }
      })
      return parsed
    }
    return []
  }

  const callAi = async () => {
    setActive(true)
    try {
      console.log(userInput)
      const response = await fetch(`http://localhost:3000/user/${userInput}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data: { status: string; message: UserInformation } =
        await response.json()
      console.log(data)
      if (data.status == 'server error') {
        throw new Error()
      }
      const closest = formatClosest(data.message)
      setParsedData(closest)
      console.log(parsedData)
      setAIResponse(data.message.name)
    } catch (error) {
      setAIResponse('connection lost, try again')
      console.error(error)
    } finally {
      setActive(false)
    }
  }

  const selectedLoadingMessage = () => {
    const messages = [
      'asking...',
      'connecting to user...',
      'intercepting signals...',
      'decoding fragments...',
      'parsing echoes...',
      'gathering whispers...',
      'analyzing frequencies...',
      'seeking patterns...'
    ]

    const selectedMessage =
      messages[Math.floor(Math.random() * messages.length)]
    console.log(selectedMessage)

    return selectedMessage
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
        <ModelCanvas
          loading={active}
          setLoading={(value: boolean) => setActive(value)}
        />
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
            Send message
          </button>
        </form>
        <div className='absolute top-50 text-white px-5'>
          {active ? (
            <p className='font-mono  vt323 text-4xl '>
              <AnimatedResponse text={selectedLoadingMessage()} />
            </p>
          ) : (
            <p className='font-mono  vt323 text-4xl '>
              <AnimatedResponse text={aiResponse} />
              {parsedData.length === 0 ? null : (
                <div className='flex flex-col gap-4'>
                  {/* fix here!!! */}
                  {/* {parsedData.map(user => (
                    <div className='flex flex-col gap-2'>
                      <img src={user.pfp} />
                      <span>{user.name}</span>
                    </div>
                  ))} */}
                  <ClosestUsers users={parsedData} />
                </div>
              )}
            </p>
          )}
        </div>
      </motion.div>
    </>
  )
}
