import React from 'react'
import { motion } from 'framer-motion'

export const PageWrapper = ({children}) => {
  return (
    <motion.div
       initial={{opacity: 0,y:20 }}
       animate={{opacity:1,y:0}}
       exit={{opacity:0,y:-20}}
       ransition={{duration: 0.4 ,ease:"easeInOut"}}>
        {children}
       </motion.div>
  )
}
