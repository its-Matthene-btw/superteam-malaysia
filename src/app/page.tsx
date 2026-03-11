import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/home/Hero';
import EventSection from '@/components/home/EventSection';
import EcosystemPartners from '@/components/home/EcosystemPartners';
import Footer from '@/components/layout/Footer';
import { stats, faqs } from '@/lib/data';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      
      {/* Mission Section */}
      <section id="mission" className="py-24 px-4 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-headline font-bold mb-8">Our <span className="solana-text-gradient">Mission</span></h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Superteam is a global cooperative of operators, developers, and designers who are building on the Solana ecosystem. 
            Our mission is to help the most talented builders in Malaysia launch and scale the next generation of 
            decentralized applications, providing them with the resources, community, and capital they need to succeed.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-headline font-bold mb-12 text-center">Frequently Asked <span className="solana-text-gradient">Questions</span></h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className="glass px-6 rounded-2xl border-white/5">
                <AccordionTrigger className="hover:no-underline font-headline font-bold py-6">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <EventSection />
      <EcosystemPartners />
      <Footer />
    </main>
  );
}
