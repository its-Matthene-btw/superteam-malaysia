import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/home/Hero';
import EventSection from '@/components/home/EventSection';
import CommunityCarousel from '@/components/home/CommunityCarousel';
import WallOfLove from '@/components/home/WallOfLove';
import FaqCtaSection from '@/components/home/FaqCtaSection';
import Footer from '@/components/layout/Footer';
import { stats } from '@/lib/data';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      
      {/* Framed Mission Layout */}
      <section id="mission" className="bg-black">
        {/* Row 1 */}
        <div className="w-full border-b border-white/10">
          <div className="max-w-[1400px] mx-auto min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_1.5fr_1fr] border-x border-white/10">
            <div className="flex flex-col justify-between p-10 lg:p-20 border-b lg:border-b-0 border-white/10">
              <h2 className="text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tighter">Builder<br />Support</h2>
              <div className="hidden lg:block font-code text-sm tracking-[4px] text-muted-foreground font-bold">[ 01 / 05 ]</div>
            </div>
            <div className="flex items-center justify-center relative min-h-[400px] lg:min-h-0">
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="shape-sphere"></div>
                <div className="base-podium"></div>
              </div>
            </div>
            <div className="flex flex-col justify-end p-10 lg:p-20 border-t lg:border-t-0 border-white/10">
              <p className="text-lg text-muted-foreground leading-relaxed max-w-sm">
                Superteam Malaysia helps developers, designers, and founders start building in the Solana ecosystem. Through mentorship, collaboration, and guidance from experienced community members, we help builders move from learning to launching real products.
              </p>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="w-full border-b border-white/10">
          <div className="max-w-[1400px] mx-auto min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_1.5fr_1fr] border-x border-white/10">
            <div className="flex flex-col justify-between p-10 lg:p-20 border-b lg:border-b-0 border-white/10">
              <h2 className="text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tighter">Events &<br />Hackathons</h2>
              <div className="hidden lg:block font-code text-sm tracking-[4px] text-muted-foreground font-bold">[ 02 / 05 ]</div>
            </div>
            <div className="flex items-center justify-center relative min-h-[400px] lg:min-h-0">
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="shape-card"></div>
              </div>
            </div>
            <div className="flex flex-col justify-end p-10 lg:p-20 border-t lg:border-t-0 border-white/10">
              <p className="text-lg text-muted-foreground leading-relaxed max-w-sm">
                We host workshops, meetups, and hackathons that bring the Malaysian Web3 community together. These events help builders learn new skills, meet collaborators, and turn ideas into working prototypes and projects.
              </p>
            </div>
          </div>
        </div>

        {/* Row 3 */}
        <div className="w-full border-b border-white/10">
          <div className="max-w-[1400px] mx-auto min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_1.5fr_1fr] border-x border-white/10">
            <div className="flex flex-col justify-between p-10 lg:p-20 border-b lg:border-b-0 border-white/10">
              <h2 className="text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tighter">Grants &<br />Funding</h2>
              <div className="hidden lg:block font-code text-sm tracking-[4px] text-muted-foreground font-bold">[ 03 / 05 ]</div>
            </div>
            <div className="flex items-center justify-center relative min-h-[400px] lg:min-h-0">
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="orbit-mission"></div>
                <div className="shape-globe-mission"></div>
              </div>
            </div>
            <div className="flex flex-col justify-end p-10 lg:p-20 border-t lg:border-t-0 border-white/10">
              <p className="text-lg text-muted-foreground leading-relaxed max-w-sm">
                Superteam connects builders with grants and funding opportunities across the Solana ecosystem. Whether launching a startup or building an open-source tool, we help talented builders access the resources needed to grow their projects.
              </p>
            </div>
          </div>
        </div>

        {/* Row 4 */}
        <div className="w-full border-b border-white/10">
          <div className="max-w-[1400px] mx-auto min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_1.5fr_1fr] border-x border-white/10">
            <div className="flex flex-col justify-between p-10 lg:p-20 border-b lg:border-b-0 border-white/10">
              <h2 className="text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tighter">Bounties &<br />Opportunities</h2>
              <div className="hidden lg:block font-code text-sm tracking-[4px] text-muted-foreground font-bold">[ 04 / 05 ]</div>
            </div>
            <div className="flex items-center justify-center relative min-h-[400px] lg:min-h-0">
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="shape-coin coin-1"></div>
                <div className="shape-coin coin-2"></div>
              </div>
            </div>
            <div className="flex flex-col justify-end p-10 lg:p-20 border-t lg:border-t-0 border-white/10">
              <p className="text-lg text-muted-foreground leading-relaxed max-w-sm">
                Members can earn by contributing to real projects through ecosystem bounties and freelance opportunities. Builders can work with leading Solana teams while gaining experience and getting rewarded for their contributions.
              </p>
            </div>
          </div>
        </div>

        {/* Row 5 */}
        <div className="w-full border-b border-white/10">
          <div className="max-w-[1400px] mx-auto min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_1.5fr_1fr] border-x border-white/10">
            <div className="flex flex-col justify-between p-10 lg:p-20 border-b lg:border-b-0 border-white/10">
              <h2 className="text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tighter">Education &<br />Learning</h2>
              <div className="hidden lg:block font-code text-sm tracking-[4px] text-muted-foreground font-bold">[ 05 / 05 ]</div>
            </div>
            <div className="flex items-center justify-center relative min-h-[400px] lg:min-h-0">
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="shape-pyramid"></div>
              </div>
            </div>
            <div className="flex flex-col justify-end p-10 lg:p-20 border-t lg:border-t-0 border-white/10">
              <p className="text-lg text-muted-foreground leading-relaxed max-w-sm">
                We provide workshops, learning sessions, and community resources to help builders develop the skills needed to succeed in Web3. From beginners learning Solana development to experienced contributors leveling up their expertise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full bg-white/5 relative py-24 md:py-32 px-6 overflow-hidden border-y border-white/10">
        <div className="bg-watermark">S</div>
        <div className="max-w-[1400px] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-[2.5fr_7.5fr] gap-10 md:gap-16">
          <div className="stats-header">
            <h2 className="text-5xl font-headline font-bold tracking-tight">In numbers</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-y-16 md:gap-y-20">
            {stats.map((stat, idx) => (
              <div key={idx} className="stat-cell group">
                <div className="flex items-start gap-3">
                  <stat.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors mt-0.5" />
                  <span className="text-sm font-medium text-muted-foreground leading-tight uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
                <div className="text-5xl md:text-6xl font-headline font-bold tracking-tighter mt-10 group-hover:solana-text-gradient transition-all duration-300">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <EventSection />
      <CommunityCarousel />
      <WallOfLove />
      <FaqCtaSection />
      <Footer />
    </main>
  );
}
