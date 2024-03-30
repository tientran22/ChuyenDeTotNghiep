import React from 'react'
import { motion } from 'framer-motion'

interface AnimationTextProps {
  text: string
  className?: string
  startDelay?: number // Thêm thuộc tính startDelay vào props
}

const AnimationText: React.FC<AnimationTextProps> = ({ text, className, startDelay }) => {
  return (
    <div className={className}>
      {text.split(' ').map((word, wordIndex) => (
        <React.Fragment key={wordIndex}>
          {word.split('').map((char, charIndex) => (
            <motion.span
              key={`${wordIndex}-${charIndex}`}
              style={{ display: 'inline-block', marginRight: '4px' }}
              initial={{ y: -200, opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
                transition: {
                  duration: 0.5,
                  delay: (wordIndex * text.length + charIndex) * 0.05 + (startDelay || 0), // Thêm startDelay vào delay
                  repeat: Infinity,
                  repeatDelay: 5
                }
              }}
            >
              {char}
            </motion.span>
          ))}
          {wordIndex < text.split(' ').length - 1 && <span>&nbsp;</span>}
        </React.Fragment>
      ))}
    </div>
  )
}

export default AnimationText
