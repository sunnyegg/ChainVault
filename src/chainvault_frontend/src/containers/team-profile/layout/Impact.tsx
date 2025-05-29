import { motion } from "framer-motion";

export const Impact = () => {
  return (
    <section className="min-h-screen bg-[#0B0E11] text-[#EAECEF] px-6 py-20 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-4xl text-center"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[#FCD535]">
          Why It Matters
        </h2>
        <p className="text-lg text-[#EAECEF] mb-10">
          ChainVault isn't just a storage protocol. It's a movement toward real
          digital freedom. We’re reshaping how individuals and teams control
          their data, forever.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              label: "Fully On-Chain",
              value: "100%",
              desc: "No third-party cloud or IPFS dependency. True blockchain persistence.",
            },
            {
              label: "Data Ownership",
              value: "User-Centric",
              desc: "Only you control your files. No gatekeepers. No lock-in.",
            },
          ].map(({ label, value, desc }, idx) => (
            <div
              key={idx}
              className="bg-[#181A20] p-6 rounded-lg border border-[#2C2F36]"
            >
              <div className="text-3xl md:text-4xl font-bold text-[#FCD535]">
                {value}
              </div>
              <div className="mt-2 text-[#A0AEC0] font-medium">{label}</div>
              <p className="mt-2 text-sm text-[#848E9C]">{desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
