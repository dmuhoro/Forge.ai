'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

interface StepLogProps {
  steps: string[];
  isGenerating: boolean;
}

export function StepLog({ steps, isGenerating }: StepLogProps) {
  return (
    <div className="py-3 px-4 space-y-2">
      <AnimatePresence>
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          const isActive = isLast && isGenerating;
          return (
            <motion.div
              key={`${step}-${i}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2.5"
            >
              {isActive ? (
                <Loader2 className="w-3.5 h-3.5 text-blue-500 shrink-0 animate-spin" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
              )}
              <span className={`text-xs ${isActive ? 'text-gray-700' : 'text-gray-400'}`}>
                {step}
              </span>
              {isActive && (
                <span className="flex gap-0.5 ml-1">
                  {[0, 0.15, 0.3].map((delay) => (
                    <motion.span
                      key={delay}
                      className="w-1 h-1 rounded-full bg-blue-400"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay }}
                    />
                  ))}
                </span>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
