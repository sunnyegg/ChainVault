import { motion } from "framer-motion";

export const Problem = () => {
  return (
    <section className="min-h-screen bg-[#181A20] text-[#EAECEF] px-6 py-20 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-3xl text-center"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[#FCD535]">
          The Problem
        </h2>
        <p className="text-lg md:text-xl text-[#EAECEF] mb-6">
          Our digital data lives on fragile ground. Files are locked in
          centralized servers, vulnerable to hacks, takedowns, and silent
          deletions. There's no guarantee of privacy, persistence, or true
          ownership.
        </p>
        <p className="text-base text-[#848E9C]">
          For students, creators, developers, and businesses alike, this leads
          to limited trust and broken workflows — especially when relying on
          centralized notes, documents, and file-sharing systems.
        </p>
      </motion.div>
    </section>
  );
};
