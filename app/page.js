'use client'

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { HiCalendar, HiBriefcase, HiGift } from "react-icons/hi";
import { api } from './utils/api';

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <main className="flex flex-col items-center py-8 md:py-16 space-y-12 md:space-y-16">
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl px-4"
        >
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Welcome to the Alumni Association Platform
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-white/60 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Stay connected, grow your network, and support your alma mater
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/auth"
              className="rounded-full bg-white text-black font-bold py-2 px-6 md:py-3 md:px-8 
                transition-all duration-300 hover:bg-white/90"
            >
              Join Now
            </Link>
          </motion.div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-6xl flex justify-center px-4"
        >
          <div className="relative w-full aspect-video max-w-[1000px] rounded-xl border border-gray-800">
            <Image
              src="/screen.png"
              alt="Alumni Association Platform Screenshot"
              fill
              className="object-contain"
              priority
              quality={100}
            />
          </div>
        </motion.section>

        <motion.section 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, staggerChildren: 0.2 }}
        >
          <FeatureCard
            title="Upcoming Events"
            description="Discover and participate in alumni events, reunions, and networking opportunities."
            link="/events"
          />
          <FeatureCard
            title="Job Opportunities"
            description="Explore career opportunities or post job openings for fellow alumni."
            link="/jobs"
          />
          <FeatureCard
            title="Make a Donation"
            description="Support your alma mater and contribute to its growth and development."
            link="/donations"
            className="sm:col-span-2 md:col-span-1"
          />
        </motion.section>

        <motion.section 
          className="text-center max-w-3xl px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">
            Why Join Our Alumni Network?
          </h2>
          <motion.ul 
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 text-left"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <BenefitItem text="Expand your professional network" />
            <BenefitItem text="Access exclusive job opportunities" />
            <BenefitItem text="Attend special alumni events" />
            <BenefitItem text="Mentor current students" />
            <BenefitItem text="Stay updated with university news" />
          </motion.ul>
        </motion.section>
      </main>
    </div>
  );
}

function FeatureCard({ title, description, link, className }) {
  const getIcon = (title) => {
    switch (title) {
      case "Upcoming Events":
        return <HiCalendar className="w-8 h-8 text-white/70" />;
      case "Job Opportunities":
        return <HiBriefcase className="w-8 h-8 text-white/70" />;
      case "Make a Donation":
        return <HiGift className="w-8 h-8 text-white/70" />;
      default:
        return null;
    }
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.03, y: -5 }}
      className={`border border-white/10 rounded-lg p-6 hover:border-white/20 transition-colors
        bg-white/5 backdrop-blur-sm ${className}`}
    >
      <div className="mb-4">
        {getIcon(title)}
      </div>
      <h2 className="text-2xl font-bold mb-2 text-white">
        {title}
      </h2>
      <p className="text-white/60 mb-4">{description}</p>
      <Link 
        href={link} 
        className="text-white/70 hover:text-white flex items-center gap-2 group transition-colors"
      >
        Learn more 
        <span className="transform transition-transform group-hover:translate-x-1">→</span>
      </Link>
    </motion.div>
  );
}

function BenefitItem({ text }) {
  return (
    <motion.li 
      variants={{
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0 }
      }}
      className="flex items-center p-4 rounded-lg bg-white/5 
        transition-colors border border-white/10 hover:bg-white/10 text-white/70"
    >
      <motion.svg 
        whileHover={{ scale: 1.2, rotate: 180 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="w-5 h-5 mr-3 text-white/70" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          d="M5 13l4 4L19 7"
        />
      </motion.svg>
      {text}
    </motion.li>
  );
}
