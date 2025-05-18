import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen min-w-screen flex items-center justify-center px-6 overflow-hidden">
      <div className="relative z-10 max-w-4xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-extrabold leading-tight mb-6"
        >
          Own Your Data. <span className="text-[#FCD535]">Forever.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-lg md:text-xl text-[#848E9C] mb-8"
        >
          <b className="text-[#FCD535]">ChainVault</b> is a blockchain-powered storage system built on the
          Internet Computer — offering secure, decentralized file storage with optional AI-generated summaries.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <button
            onClick={() => navigate("/app")}
            // variant="primary"
            className="bg-[#FCD535] text-black font-semibold px-6 py-3 hover:bg-yellow-400 transition-all rounded-full"
          >
            <div className="flex items-center gap-2">
              <Icon icon="fxemoji:rocket" />
              Launch App
            </div>
          </button>
        </motion.div>
      </div>
    </section>
  );
};
