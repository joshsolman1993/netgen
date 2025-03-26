import { motion, AnimatePresence } from "framer-motion";

type Props = {
  visible: boolean;
};

export default function ZoneDiscoverEffect({ visible }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <div className="bg-black/80 backdrop-blur-sm text-cyan-300 border border-cyan-500 rounded-xl px-8 py-6 text-3xl font-bold shadow-xl animate-pulse">
            ✅ ZÓNA FELFEDEZVE
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
