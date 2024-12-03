'use client'

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { HiCalendar, HiBriefcase, HiGift } from "react-icons/hi";
import { api } from './utils/api';

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen gap-16 font-[family-name:var(--font-geist-sans)] bg-black">
      <main className="flex flex-col gap-16 items-center px-8 py-16">
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl"
        >
          <motion.h1 
            className="text-6xl font-bold mb-4 text-white"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Welcome to the Alumni Association Platform
          </motion.h1>
          <motion.p 
            className="text-xl text-white/60 mb-8"
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
              className="rounded-full bg-white text-black font-bold py-3 px-8 
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
          className="w-full max-w-6xl flex justify-center"
        >
          <div className="relative h-[435px] w-[1000px] rounded-xl border border-gray-800">
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
          className="grid md:grid-cols-3 gap-8 w-full max-w-5xl"
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
          />
        </motion.section>

        <motion.section 
          className="text-center max-w-3xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-6 text-white">
            Why Join Our Alumni Network?
          </h2>
          <motion.ul 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left"
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

function FeatureCard({ title, description, link }) {
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
      className="border border-white/10 rounded-lg p-6 hover:border-white/20 transition-colors
        bg-white/5 backdrop-blur-sm"
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
