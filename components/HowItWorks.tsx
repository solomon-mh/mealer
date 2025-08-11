import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { FaUserEdit, FaClipboardList, FaConciergeBell } from "react-icons/fa";

const HowItWorks = () => {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const stepHover = {
    scale: 1.03,
    y: -5,
    transition: { duration: 0.3 },
  };

  const iconHover = {
    rotate: [0, 10, -10, 0],
    transition: { duration: 0.7 },
  };

  return (
    <section id="how-it-works" className="-mt-16 mb-24 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-gray-200 mb-4">How It Works</h2>
        <p className="text-xl font-medium mb-2">
          Your journey to better eating starts here
        </p>
        <div className="w-24 h-1 bg-gray-500 mx-auto mt-4 rounded-full" />
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 px-4"
      >
        {/* Step 1 */}
        <motion.div
          variants={item}
          whileHover={stepHover}
          className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-xl p-8 transition-transform duration-300 border-[2px] border-gray-500"
        >
          <motion.div
            whileHover={iconHover}
            className="bg-gray-500 text-white rounded-full h-20 w-20 flex items-center justify-center mb-6 mx-auto shadow-lg"
          >
            <FaUserEdit className="h-8 w-8" />
          </motion.div>
          <div className="relative flex flex-wrap items-center gap-4 mb-6">
            <span className="text-5xl font-bold text-emerald-100">01</span>
            <h3 className="text-2xl font-bold text-gray-100 relative z-10">
              Create Profile
            </h3>
          </div>
          <p className="text-gray-200 text-lg leading-relaxed">
            Sign up in seconds and tell us about your dietary preferences,
            allergies, and goals.
          </p>
          <div className="mt-6 h-1 w-16 bg-gray-400 mx-auto rounded-full" />
        </motion.div>

        {/* Step 2 */}
        <motion.div
          variants={item}
          whileHover={stepHover}
          className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-xl p-8 transition-all duration-100 border-[2px] border-gray-500 transform lg:translate-y-8"
        >
          <motion.div
            whileHover={iconHover}
            className="bg-gray-600 text-white rounded-full h-20 w-20 flex items-center justify-center mb-6 mx-auto shadow-lg"
          >
            <FaClipboardList className="h-8 w-8" />
          </motion.div>
          <div className="relative flex flex-wrap items-center gap-4 mb-6">
            <span className="text-5xl font-bold text-emerald-100">02</span>
            <h3 className="text-2xl font-bold text-gray-100 relative z-10">
              Set Preferences
            </h3>
          </div>
          <p className="text-gray-200 text-lg leading-relaxed">
            Customize your nutrition targets, cooking time, and favorite
            cuisines.
          </p>
          <div className="mt-6 h-1 w-16 bg-gray-500 mx-auto rounded-full" />
        </motion.div>

        {/* Step 3 */}
        <motion.div
          variants={item}
          whileHover={stepHover}
          className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-xl p-8 transition-all duration-100 border-[2px] border-gray-500"
        >
          <motion.div
            whileHover={iconHover}
            className="bg-gray-700 text-white rounded-full h-20 w-20 flex items-center justify-center mb-6 mx-auto shadow-lg"
          >
            <FaConciergeBell className="h-8 w-8" />
          </motion.div>
          <div className="relative flex flex-wrap items-center gap-4 mb-6">
            <span className="text-5xl font-bold text-emerald-100">03</span>
            <h3 className="text-2xl font-bold text-gray-100 relative z-10">
              Enjoy Meals
            </h3>
          </div>
          <p className="text-gray-200 text-lg leading-relaxed">
            Receive your AI-generated meal plan with recipes and shopping list.
          </p>
          <div className="mt-6 h-1 w-16 bg-gray-600 mx-auto rounded-full" />
        </motion.div>
      </motion.div>

      {/* Animated connector lines - only visible on desktop */}
      <div className="hidden mt-14 md:block max-w-2xl mx-auto relative h-0">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 origin-left"
          style={{ width: "calc(100% - 80px)", margin: "0 auto" }}
        />
      </div>
    </section>
  );
};

export default HowItWorks;
