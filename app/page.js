import Image from "next/image";
import Link from "next/link";
import { api } from './utils/api';  // Updated import statement

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen gap-16 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-16 items-center px-8 py-16">
        <section className="text-center max-w-3xl">
          <h1 className="text-5xl font-bold mb-4">Welcome to the Alumni Association Platform</h1>
          <p className="text-xl text-gray-400 mb-8">Stay connected, grow your network, and support your alma mater</p>
          <Link
            href="/auth"
            className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 transition-colors"
          >
            Join Now
          </Link>
        </section>

        <section className="grid md:grid-cols-3 gap-8 w-full max-w-5xl">
          <FeatureCard
            // icon="/icons/calendar.svg"
            title="Upcoming Events"
            description="Discover and participate in alumni events, reunions, and networking opportunities."
            link="/events"
          />
          <FeatureCard
            // icon="/icons/briefcase.svg"
            title="Job Opportunities"
            description="Explore career opportunities or post job openings for fellow alumni."
            link="/jobs"
          />
          <FeatureCard
            // icon="/icons/heart.svg"
            title="Make a Donation"
            description="Support your alma mater and contribute to its growth and development."
            link="/donations"
          />
        </section>

        <section className="text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-6">Why Join Our Alumni Network?</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <BenefitItem text="Expand your professional network" />
            <BenefitItem text="Access exclusive job opportunities" />
            <BenefitItem text="Attend special alumni events" />
            <BenefitItem text="Mentor current students" />
            <BenefitItem text="Stay updated with university news" />
          </ul>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description, link }) {
  return (
    <div className="border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
      {/* <Image src={icon} alt="" width={24} height={24} className="mb-4" /> */}
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-gray-400 mb-4">{description}</p>
      <Link href={link} className="text-blue-500 hover:text-blue-400">
        Learn more →
      </Link>
    </div>
  );
}

function BenefitItem({ text }) {
  return (
    <li className="flex items-center">
      <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
      </svg>
      {text}
    </li>
  );
}

// Update this function to use the api object
async function fetchUserData() {
  try {
    const userData = await api.user.getProfile();
    // Handle the user data
  } catch (error) {
    console.error('Error fetching user data:', error);
    // Handle the error (e.g., redirect to login page)
  }
}
