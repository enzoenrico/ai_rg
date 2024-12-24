import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { FC, useEffect, useState } from 'react'

const cursorVariants = {
  blinking: {
    opacity: [0, 0, 1, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatDelay: 0,
      ease: 'linear',
      times: [0, 0.5, 0.5, 1]
    }
  }
}

export const AnimatedResponse: FC<{ text: string }> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState(text)
  const count = useMotionValue(text.length)
  const rounded = useTransform(count, Math.round)
  const displayText = useTransform(rounded, latest =>
    displayedText.slice(0, latest)
  )

  useEffect(() => {
    const animateText = async () => {
      // Delete animation
      if (displayedText !== text) {
        await animate(count, 0, {
          duration: 0.75
        })
        setDisplayedText(text)
      }
      // Write animation
      await animate(count, text.length, {
        duration: 1
      })
    }

    animateText()
  }, [text, count, displayText])

return (
    <motion.span 
        className='inline-flex'
        animate={{
            y: [0, -5, 0] // Float between 0 and -5 pixels
        }}
        transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
        }}
    >
        <motion.span
            className='selection:text-red-600'
            initial={{ color: '#ff0000' }}
            animate={{
                color: '#ffffff'
            }}
            transition={{
                duration: 2
            }}
        >
            {displayText}
        </motion.span>
        <motion.div
            variants={cursorVariants}
            animate='blinking'
            className='inline-block h-6 w-2 translate-y-2 bg-white '
        />
    </motion.span>
)
}
