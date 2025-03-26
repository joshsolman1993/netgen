import { motion, AnimatePresence } from "framer-motion";

export default function RewardPopup({
  show,
  onClose,
  reward,
}: {
  show: boolean;
  onClose: () => void;
  reward: { coin?: number; item?: string };
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-cyan-900 border border-cyan-400 text-white px-6 py-4 rounded-xl shadow-xl z-50"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-xl font-bold mb-2">🎉 Küldetés teljesítve!</h2>
          <p className="text-cyan-200 mb-1">
            {reward.coin && (
              <span className="text-green-400 font-mono">
                +{reward.coin} ₿ coin
              </span>
            )}
          </p>
          {reward.item && (
            <p className="text-yellow-300">🎁 Tárgy: {reward.item}</p>
          )}

          <button
            onClick={onClose}
            className="mt-3 text-sm text-cyan-400 underline hover:text-cyan-200"
          >
            Bezárás
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
