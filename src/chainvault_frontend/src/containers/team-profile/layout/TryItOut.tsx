import { Button, Icon } from "@tixia/design-system";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const TryItOut = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-gradient-to-br from-[#FCD535] to-yellow-400 text-black px-6 py-20 flex items-center justify-center rounded-[20px]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-xl"
      >
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
          Ready to try it out?
        </h2>
        <p className="text-lg mb-8">
          Dive into the live app and explore what we’ve built. Test it. Break
          it. Shape the future with us.
        </p>

        <Button
          leftIcon="fxemoji:rocket"
          className="bg-black text-[#FCD535] font-semibold px-6 py-3 rounded-full hover:bg-[#181A20] transition-all"
          onClick={() => navigate("/app")}
        >
          Launch App
        </Button>
      </motion.div>
    </div>
  );
};
