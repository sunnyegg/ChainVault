// import { Card } from "@tixia/design-system";
import { motion } from "framer-motion";
// import Image from "next/image";
export const Team = () => {
  const members = [
    { name: "Jordan", role: "Backend Developer" },
    { name: "Adila", role: "Backend Developer" },
    { name: "Firnaz", role: "Frontend Developer" },
    { name: "Yoga", role: "Backend Developer" },
  ];

  return (
    <section className="min-h-screen bg-[#181A20] text-[#EAECEF] px-6 py-20 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-5xl text-center"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-8 text-[#FCD535]">
          Meet the Team
        </h2>
        <div
          // variant="outline"
          className="w-full min-h-[500px] flex flex-col justify-end items-center bg-cover bg-center pb-10 rounded-[20px] p-5"
          style={{ backgroundImage: "url('/team.PNG')" }}
        >
          <div className="grid md:grid-cols-4 gap-8">
            {members.map((member, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="bg-[#0B0E11] p-6 rounded-xl border border-[#2C2F36]"
              >
                <div className="text-xl font-semibold text-[#FCD535]">
                  {member.name}
                </div>
                <div className="text-sm text-[#A0AEC0]">{member.role}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};
