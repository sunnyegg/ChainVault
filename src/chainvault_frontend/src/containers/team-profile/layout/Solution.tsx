import { motion } from "framer-motion";

export const Solution = () => {
  return (
    <section className="min-h-screen bg-[#0B0E11] text-[#EAECEF] px-6 py-20 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-5xl text-center"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[#FCD535]">
          Our Solution
        </h2>
        <p className="text-lg text-[#EAECEF] mb-10">
          ChainVault provides a trustless, on-chain file storage system. Built
          on the Internet Computer, it delivers high-speed decentralized storage
          while offering intelligent content understanding.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "On-Chain File Storage",
              desc: "Data is stored and served directly from smart contracts — no gateways, no central servers.",
            },
            {
              title: "Immutable & Verifiable",
              desc: "All files are cryptographically anchored and auditable for tamper resistance.",
            },
            {
              title: "Seamless Access",
              desc: "Log in via wallet. Upload and access your content with a simple interface.",
            },
          ].map(({ title, desc }, index) => (
            <motion.div
              key={index}
              className="bg-[#181A20] p-6 rounded-xl border border-[#2C2F36]"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-[#FCD535] mb-2">
                {title}
              </h3>
              <p className="text-[#A0AEC0] text-sm">{desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
