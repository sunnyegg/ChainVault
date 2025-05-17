import { motion } from "framer-motion";

export const HowItWorks = () => {
  return (
    <section className="min-h-screen bg-[#181A20] text-[#EAECEF] px-6 py-20 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl text-center"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-8 text-[#FCD535]">
          How It Works
        </h2>
        <p className="text-lg text-[#EAECEF] mb-8">
          ChainVault simplifies decentralized storage with just a few intuitive
          steps. No blockchain experience required. Built for both technical and
          non-technical users.
        </p>
        <ol className="space-y-8 text-left">
          {[
            "Connect your crypto wallet or authenticate via email using Internet Identity.",
            "Upload any file, note, or document through our secure Web3 interface.",
            "Choose to generate an AI summary for your content (e.g. notes, articles).",
            "Your data is stored and verifiable on the Internet Computer — forever.",
            "You can retrieve, share, or manage your content anytime with full transparency.",
          ].map((step, idx) => (
            <li key={idx} className="border-l-4 pl-4 border-[#FCD535] text-lg">
              <span className="font-semibold text-[#FCD535]">
                Step {idx + 1}:
              </span>{" "}
              {step}
            </li>
          ))}
        </ol>
      </motion.div>
    </section>
  );
};
