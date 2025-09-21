"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect } from "react";
import Lenis from "lenis";
import { ScrollCanvas } from "./components/ui/ScrollCanvas";
import {
  Leaf,
  Recycle,
  BarChart3,
  Target,
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import RainbowButton from "./components/ui/RainbowButton";

export default function Home() {
  // Initialize Lenis smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);
  const features = [
    {
      icon: <Leaf className="w-6 h-6" />,
      title: "Environmental Impact",
      description: "Comprehensive carbon footprint and environmental analysis",
    },
    {
      icon: <Recycle className="w-6 h-6" />,
      title: "Circular Economy",
      description: "Optimize recycling and sustainable design strategies",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Data Insights",
      description: "Advanced analytics and interactive visualizations",
    },
  ];

  const stats = [
    { number: "95%", label: "Accuracy Rate" },
    { number: "500+", label: "Assessments" },
    { number: "12", label: "Impact Categories" },
    { number: "24/7", label: "Support" },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Fixed Background Canvas Animation */}
      <div className="fixed inset-0 z-0">
        <ScrollCanvas
          imageCount={230}
          imagePath="/frames/frame_"
          imageExtension=".jpg"
          useGeneratedFrames={false}
          className="w-full h-full"
        />
        {/* Black overlay for readability - stronger */}
        <div className="absolute inset-0 bg-black/77 z-10"></div>
      </div>

      {/* All content with higher z-index */}
      <div className="relative z-20">
        {/* Navigation */}
        <nav className="relative z-10 px-6 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <span className="text-xl font-bold">Dhatu Chakra</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:flex items-center gap-8"
            >
              <a
                href="#features"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#about"
                className="text-gray-400 hover:text-white transition-colors"
              >
                About
              </a>
              <RainbowButton href="/auth/signin" className="bg-white/90">
                Start for free
              </RainbowButton>
            </motion.div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative px-6 py-4 sm:py-2">
          <div className="max-w-7xl mx-auto mt-16 sm:mt-24 lg:mt-32">
            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-center mb-12"
            >
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-normal leading-20 tracking-tight mb-6 text-white drop-shadow-lg">
                Dhatu Chakra
              </h1>
              <p className="text-xl sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                Advanced Life Cycle Assessment for metal industries. Analyze
                environmental impact, optimize sustainability, and scale with
                comprehensive insights.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20"
            >
              <RainbowButton href="/auth/signin" className="bg-white/90">
                Start for free
              </RainbowButton>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white drop-shadow-lg">
                Everything you need for
                <br />
                <span className="text-4xl sm:text-5xl font-light text-gray-300">
                  environmental analysis
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto drop-shadow-md">
                Comprehensive tools for Life Cycle Assessment with real-time
                insights and actionable recommendations.
              </p>
            </motion.div>

            <div className="relative max-w-6xl mx-auto">
              {/* Crazy Minimalist Feature Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 relative">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index * 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.2,
                      type: "spring",
                      bounce: 0.3,
                    }}
                    viewport={{ once: true }}
                    className="relative group"
                  >

                    {/* Diagonal Card */}
                    <motion.div
                      whileHover={{
                        y: -10,
                        transition: { duration: 0.3 },
                      }}
                      className={`
                        relative mt-8 p-8 pb-12 min-h-[280px]
                        bg-white/5 backdrop-blur-sm
                        border border-white/10
                        transform transition-all duration-500
                        group-hover:bg-white/10 group-hover:border-white/20
                        ${
                          index === 0
                            ? "skew-y-1"
                            : index === 1
                            ? "-skew-y-1"
                            : "skew-y-1"
                        }
                      `}
                    >
                      {/* Number */}
                      <div
                        className={`
                        absolute top-4 right-4 w-8 h-8 rounded-full
                        text-xs font-bold flex items-center justify-center
                        ${
                          index === 0
                            ? "bg-emerald-500/30 text-emerald-300"
                            : index === 1
                            ? "bg-blue-500/30 text-blue-300"
                            : "bg-purple-500/30 text-purple-300"
                        }
                      `}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      {/* Content */}
                      <div className="pt-12">
                        <h3 className="text-2xl font-bold mb-4 text-white leading-tight">
                          {feature.title}
                        </h3>
                        <p className="text-gray-300 leading-relaxed text-sm">
                          {feature.description}
                        </p>
                      </div>

                     
                    </motion.div>

                    {/* Connecting Line (except for last item) */}
                    {index < features.length - 1 && (
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: (index + 1) * 0.3 }}
                        viewport={{ once: true }}
                        className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-white/40 to-transparent z-0"
                      />
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Floating Background Elements */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-12 left-1/4 w-32 h-32 border border-white/10 rounded-full"
              />
              <motion.div
                animate={{
                  y: [0, 15, 0],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2,
                }}
                className="absolute -bottom-8 right-1/4 w-24 h-24 border border-white/10 rotate-45"
              />
            </div>
          </div>
        </section>

        <section className="px-6 py-20" id="about">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white drop-shadow-lg">
              Ready to optimize your
              <br />
              <span className="text-4xl sm:text-5xl font-light text-gray-300">
                environmental impact?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-10 drop-shadow-md">
              Join leading manufacturers using Dhatu Chakra for sustainable
              innovation.
            </p>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                <span className="font-semibold">Dhatu Chakra</span>
              </div>
              <div className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Dhatu Chakra. Building sustainable
                futures.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
