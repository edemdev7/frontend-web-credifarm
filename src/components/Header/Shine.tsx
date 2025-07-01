import { FC } from 'react';
import { motion } from 'framer-motion';

interface MotionDivProps {
  delay: number;
  width: string;
  opacity: number;
}

const Shine: FC<MotionDivProps> = ({ delay, width, opacity }) => (
  <motion.div
    initial={{ opacity, scaleX: 0 }}
    animate={{ opacity: 0, scaleX: 1 }}
    transition={{ duration: 0.15, delay }}
    className={`h-full ${width} bg-blue-600 origin-left absolute left-0 top-0`}
  ></motion.div>
);

export default Shine;
