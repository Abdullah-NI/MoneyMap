import { motion } from 'motion/react';

export const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        duration: 0.3,
        ease: [0, 0, 0.2, 1], // ease-out
      }}
    >
      {children}
    </motion.div>
  );
};
