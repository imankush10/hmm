// components/RainbowButton.jsx (or .tsx)
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const ArrowRight = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M5 12h14"></path>
    <path d="m12 5 7 7-7 7"></path>
  </svg>
);

const RainbowButton = ({ href, children, className, ...props }) => {
  return (
      <Link href={href || "#"} className={`fancy-link ${className}`} {...props}>
        {/* Main subtle glow effect */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400/60 to-transparent"
          style={{ width: "100%" }}
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scale: [0.95, 1.05, 0.95],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Secondary animated glow */}
        <motion.div
          className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-blue-500/40 via-purple-400/50 to-blue-500/40 bg-[length:200%_100%]"
          style={{ width: "100%" }}
          animate={{
            backgroundPosition: ["0% 50%", "200% 50%", "0% 50%"],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Soft blur glow underneath - UPDATED */}
        <motion.div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-[6px] bg-blue-400/60 blur-md rounded-full"
          animate={{
            opacity: [0.7, 1, 0.7],
            scale: [0.8, 1.2, 0.8],
            x: ["-50%", "50%", "-50%"], // Horizontal movement
          }}
          transition={{
            duration: 3, // Faster duration
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <span className="relative z-10 flex items-center space-x-2 font-medium">
          {children}
          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ArrowRight className="ml-2 mr-[-8px] h-3 w-3 stroke-2 transform transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
          </motion.div>
        </span>
      </Link>
  );
};

export default RainbowButton;