import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import Link from "next/link";

const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        yoyo: Infinity,
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  return (
    <section className="relative overflow-hidden text-white rounded-2xl mb-12 p-8 md:p-12 text-center">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full opacity-10"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          backgroundImage:
            "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />
      {/* Content */}
      <motion.div
        className="relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-4xl md:text-6xl font-bold font-sans mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-emerald-100"
          variants={itemVariants}
        >
          AI-Powered Meal Planning
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed"
          variants={itemVariants}
        >
          Your personalized nutrition assistant that learns your tastes, dietary
          needs, and lifestyle to create perfect meal plans.
        </motion.p>

        <motion.div variants={itemVariants}>
          <Link
            href="/sign-up"
            className="inline-block bg-white text-emerald-600 font-semibold px-8 py-4 rounded-full"
          >
            <motion.span
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="block"
            >
              Start Your Journey →
            </motion.span>
          </Link>
        </motion.div>

        <motion.div
          className="mt-10 flex justify-center space-x-4"
          variants={itemVariants}
        >
          <div className="flex items-center text-sm">
            <span className="mr-2">✅</span> Dietary Customization
          </div>
          <div className="flex items-center text-sm">
            <span className="mr-2">✅</span> Smart Grocery Lists
          </div>
          <div className="flex items-center text-sm">
            <span className="mr-2">✅</span> Time-Saving Recipes
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
