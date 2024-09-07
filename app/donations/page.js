import DonationForm from './DonationForm';

export default function Donations() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen gap-16 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-16 items-center px-8 py-16">
        <section className="text-center max-w-3xl">
          <h1 className="text-5xl font-bold mb-4">Make a Donation</h1>
          <p className="text-xl text-gray-400 mb-8">Support your alma mater and contribute to its growth and development</p>
        </section>

        <DonationForm />
      </main>
    </div>
  );
}