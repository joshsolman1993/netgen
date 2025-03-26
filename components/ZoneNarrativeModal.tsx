import { motion } from "framer-motion";

type Props = {
  text: string;
  onClose: () => void;
};

export default function ZoneNarrativeModal({ text, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="max-w-xl mx-auto text-cyan-200 border border-cyan-500 rounded-lg p-6 shadow-lg bg-gray-900 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-cyan-400 hover:text-white text-xl"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-3">📜 Zóna-narratíva</h2>
        <p className="text-sm whitespace-pre-line">{text}</p>
      </motion.div>
    </div>
  );
}
