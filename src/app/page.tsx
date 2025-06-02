import AccommodationSearchForm from '@/components/search/accommodation-search-form';
import TransportationSearchForm from '@/components/search/transportation-search-form';
import InteractiveMapPlaceholder from '@/components/map/interactive-map-placeholder';
import POIRecommendationForm from '@/components/recommendations/poi-recommendation-form';
import { BedDouble, Car, Compass, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="text-center py-12 bg-gradient-to-br from-primary/10 via-background to-accent/10 rounded-xl shadow-inner border border-primary/20">
        <h1 className="text-5xl md:text-6xl font-headline font-bold text-primary mb-4">
          Discover Your Next Adventure
        </h1>
        <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
          RoamFree helps you find the perfect stay, seamless transport, and exciting local experiences.
        </p>
      </section>

      <section id="stays" className="scroll-mt-20">
        <div className="flex items-center gap-3 mb-6">
          <BedDouble className="h-10 w-10 text-primary" />
          <div>
            <h2 className="text-3xl font-headline font-semibold text-foreground">Find Your Perfect Stay</h2>
            <p className="text-muted-foreground">Search hotels and vacation rentals effortlessly.</p>
          </div>
        </div>
        <AccommodationSearchForm />
      </section>

      <section id="rides" className="scroll-mt-20">
         <div className="flex items-center gap-3 mb-6">
          <Car className="h-10 w-10 text-primary" />
          <div>
            <h2 className="text-3xl font-headline font-semibold text-foreground">Travel With Ease</h2>
            <p className="text-muted-foreground">Book rides and rental cars in one place.</p>
          </div>
        </div>
        <TransportationSearchForm />
      </section>
      
      <div className="grid md:grid-cols-2 gap-12 scroll-mt-20" id="explore">
        <section>
           <div className="flex items-center gap-3 mb-6">
            <Compass className="h-10 w-10 text-primary" />
            <div>
              <h2 className="text-3xl font-headline font-semibold text-foreground">Explore Your Destination</h2>
              <p className="text-muted-foreground">Visualize your trip and discover hidden gems.</p>
            </div>
          </div>
          <InteractiveMapPlaceholder />
        </section>

        <section>
           <div className="flex items-center gap-3 mb-6">
            <Sparkles className="h-10 w-10 text-primary" />
            <div>
              <h2 className="text-3xl font-headline font-semibold text-foreground">AI-Powered Insights</h2>
              <p className="text-muted-foreground">Get smart recommendations for your trip.</p>
            </div>
          </div>
          <POIRecommendationForm />
        </section>
      </div>

    </div>
  );
}
