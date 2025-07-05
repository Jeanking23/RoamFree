
'use client';

import AccommodationSearchForm from '@/components/search/accommodation-search-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BedDouble, MapPin, Star, Search, Leaf, Sparkles, Home as HomeIcon, Building, Waves, MountainSnow, Users, DollarSign, Heart, User, Tag, Zap, Gift, CalendarDays, BarChart3, Eye, TvIcon, Layers, Plane, Contact, ShieldCheck, MessageSquare, Video, LocateFixed, CheckCircle, Landmark, Bell } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { allMockStays, type MockStay } from '@/lib/mock-data';
import type { AccommodationSearchFormValues } from '@/components/search/accommodation-search-form';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/context/locale-provider';

const mockPropertyTypes = [
  { name: "Hotel", icon: Building, image: "https://placehold.co/400x300.png", dataAiHint: "hotel building", filterType: "HOTEL" },
  { name: "Apartment", icon: HomeIcon, image: "https://placehold.co/400x300.png", dataAiHint: "apartment building", filterType: "RENTAL" },
  { name: "Resort", icon: Waves, image: "https://placehold.co/400x300.png", dataAiHint: "beach resort", filterType: "HOTEL" },
  { name: "Villa", icon: HomeIcon, image: "https://placehold.co/400x300.png", dataAiHint: "luxury villa", filterType: "RENTAL" },
  { name: "Guest House", icon: BedDouble, image: "https://placehold.co/400x300.png", dataAiHint: "guest house exterior", filterType: "RENTAL" },
];

const mockRecentSearches = [
  { id: "rs1", term: "Bali, Indonesia", filter: { destination: "Bali, Indonesia" } },
  { id: "rs2", term: "Romantic Getaways", filter: { mood: "Romantic" } },
  { id: "rs3", term: "Eco-Friendly Hotels", filter: { ecoFriendly: true, propertyType: "HOTEL" } },
];

const mockTrendingDestinations = [
  { id: "td1", name: "Top Hotels in Paris", image: "https://placehold.co/400x300.png", dataAiHint: "paris eiffel tower", price: "120", rating: 4.7, filter: { destination: "Paris", propertyType: "HOTEL" } },
  { id: "td2", name: "Apartments in Douala", image: "https://placehold.co/400x300.png", dataAiHint: "city douala", price: "80", rating: 4.3, filter: { destination: "Douala", propertyType: "RENTAL" } },
  { id: "td3", name: "Weekend Resorts in Abidjan", image: "https://placehold.co/400x300.png", dataAiHint: "beach abidjan", price: "150", rating: 4.5, filter: { destination: "Abidjan", propertyType: "HOTEL" } },
  { id: "td4", name: "Villas in Aspen", image: "https://placehold.co/400x300.png", dataAiHint: "aspen mountains", price: "300", rating: 4.9, filter: { destination: "Aspen", propertyType: "RENTAL" } },
];

const mockVibes = [
  { name: "Adventure", icon: MountainSnow, filter: { mood: "ADVENTUROUS" } },
  { name: "Relaxation", icon: Waves, filter: { mood: "PEACEFUL" } },
  { name: "Romantic", icon: Heart, filter: { mood: "ROMANTIC" } },
  { name: "Family-Friendly", icon: Users, filter: { propertyType: "RENTAL" } }, 
  { name: "Budget-Friendly", icon: DollarSign, filter: { priceMax: 100 } },
];

const mockNearbyGems = [
  { id: "ng1", name: "Lake House Retreat", image: "https://placehold.co/400x300.png", dataAiHint: "lake house", distance: "30km", type: "Stay", link: "/stays/stay4" }, 
  { id: "ng2", name: "City Park Resort", image: "https://placehold.co/400x300.png", dataAiHint: "city resort", distance: "5km", type: "Stay", link: "/stays/stay5" },
  { id: "ng3", name: "Affordable Guest House", image: "https://placehold.co/400x300.png", dataAiHint: "guest house", distance: "in your city", type: "Stay", link: "/stays/stay6" },
];

const mockDeals = [
  { id: "deal1", title: "Up to 30% off Resorts", image: "https://placehold.co/400x250.png", dataAiHint: "resort pool", urgency: 75, urgencyText: "75% Claimed!", filter: { propertyType: "HOTEL" } },
  { id: "deal2", title: "Last-minute Apartment Deals - Save 20%", image: "https://placehold.co/400x250.png", dataAiHint: "apartment city", urgency: 3, urgencyText: "Only 3 left!", filter: { propertyType: "RENTAL" } },
  { id: "deal3", title: "Flash Sale: Villas under $100", image: "https://placehold.co/400x250.png", dataAiHint: "villa garden", urgency: 90, urgencyText: "Selling Fast!", filter: { propertyType: "RENTAL", priceMax: 100 } },
];

const translations = {
  notificationTitle: {
    'en-US': 'Enable Notifications?',
    'es-ES': '¿Activar Notificaciones?',
    'fr-FR': 'Activer les notifications ?',
  },
  notificationDescription: {
    'en-US': "Get alerts for exclusive stay deals and price drops near you!",
    'es-ES': '¡Recibe alertas de ofertas exclusivas de estancias y bajadas de precios cerca de ti!',
    'fr-FR': 'Recevez des alertes pour des offres de séjour exclusives et des baisses de prix près de chez vous !',
  },
  enable: { 'en-US': 'Enable', 'es-ES': 'Activar', 'fr-FR': 'Activer' },
  later: { 'en-US': 'Later', 'es-ES': 'Más tarde', 'fr-FR': 'Plus tard' },
  enabledToast: {
    'en-US': 'Notifications Enabled (Demo)',
    'es-ES': 'Notificaciones Activadas (Demo)',
    'fr-FR': 'Notifications Activées (Démo)'
  },
  enabledToastDesc: {
    'en-US': "You'll now receive exclusive deals!",
    'es-ES': '¡Ahora recibirás ofertas exclusivas!',
    'fr-FR': 'Vous recevrez maintenant des offres exclusives !'
  },
  declinedToast: {
    'en-US': 'Notifications Declined (Demo)',
    'es-ES': 'Notificaciones Rechazadas (Demo)',
    'fr-FR': 'Notifications Refusées (Démo)'
  },
  declinedToastDesc: {
    'en-US': 'You can enable them later in settings.',
    'es-ES': 'Puedes activarlas más tarde en la configuración.',
    'fr-FR': 'Vous pourrez les activer plus tard dans les paramètres.'
  }
};


export default function HomePage() {
  const router = useRouter();
  const { currency, language } = useLocale();
  const featuredStays = allMockStays.slice(0, 6);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);

  const t = (key: keyof typeof translations) => {
    return translations[key][language.code as keyof typeof translations[keyof typeof translations]] || translations[key]['en-US'];
  };

  useEffect(() => {
    // This effect runs only on the client, after hydration
    const timer = setTimeout(() => {
      // Check if window is defined (ensuring it's client-side) and if the prompt hasn't been dismissed
      if (typeof window !== 'undefined' && !localStorage.getItem('notificationPromptDismissed')) {
        setShowNotificationPrompt(true);
      }
    }, 5000); // Delay of 5 seconds

    // Cleanup function to clear the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []);


  const handleFilterAndNavigate = (filters: Partial<AccommodationSearchFormValues & { priceMax?: number }>) => {
    const queryParams = new URLSearchParams();
    if (filters.destination) queryParams.set('destination', filters.destination);
    if (filters.propertyType && filters.propertyType !== 'ANY') queryParams.set('propertyType', filters.propertyType);
    if (filters.mood && filters.mood !== 'ANY') queryParams.set('mood', filters.mood);
    if (filters.priceMax) queryParams.set('priceMax', filters.priceMax.toString());
    if (filters.ecoFriendly) queryParams.set('ecoFriendly', 'true');
    if (filters.wheelchairAccessible) queryParams.set('wheelchairAccessible', 'true');
    router.push(`/stays/search?${queryParams.toString()}`);
  };
  
  const handleNotificationPrompt = (enable: boolean) => {
    if (enable) {
      toast({ title: t('enabledToast'), description: t('enabledToastDesc') });
    } else {
      toast({ title: t('declinedToast'), description: t('declinedToastDesc') });
    }
    if (typeof window !== 'undefined') localStorage.setItem('notificationPromptDismissed', 'true');
    setShowNotificationPrompt(false);
  };


  return (
    <div className="space-y-12 md:space-y-16">
      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-primary/10 via-background to-background rounded-xl shadow-sm -mx-4 px-4 md:mx-0 md:px-0">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-4 leading-tight">
            Find Your Perfect Stay
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
            Discover amazing places to stay for your next adventure, from cozy cabins to luxury villas.
          </p>
          <div className="max-w-4xl mx-auto bg-card p-3 md:p-4 rounded-xl shadow-lg border">
            <AccommodationSearchForm onSearch={() => { /* This prop is for navigating, handled by the form itself */ }} />
          </div>
        </div>
      </section>

      {/* AI Trip Planner Offer */}
      <section className="container mx-auto px-4">
        <Card className="bg-accent/10 border-accent/30 shadow-md hover:shadow-lg transition-shadow rounded-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-headline text-accent-foreground flex items-center gap-2">
              <Sparkles className="h-7 w-7 text-accent" />Plan smarter with AI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Unlock promotions, exclusive deals &amp; personalized specials for your next trip with our AI-powered planner.
            </p>
          </CardContent>
          <CardFooter>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-sm hover:shadow-md transition-shadow" asChild>
              <Link href="/ai-trip-planner">Start Planning</Link>
            </Button>
          </CardFooter>
        </Card>
      </section>

      {/* Browse by Property Type */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-headline font-semibold text-foreground mb-6 flex items-center">
          <HomeIcon className="mr-3 h-7 w-7 text-primary" />
          Browse by Property Type
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-5 md:overflow-x-visible no-scrollbar">
          {mockPropertyTypes.map(prop => (
            <Card 
              key={prop.name} 
              className="overflow-hidden cursor-pointer group rounded-lg min-w-[45vw] sm:min-w-[30vw] md:min-w-0 flex-shrink-0"
              onClick={() => handleFilterAndNavigate({ propertyType: prop.filterType as "HOTEL" | "RENTAL" | "ANY" })}
            >
              <div className="relative h-32 sm:h-40 w-full overflow-hidden rounded-t-lg">
                <Image src={prop.image} alt={prop.name} layout="fill" objectFit="cover" data-ai-hint={prop.dataAiHint} className="group-hover:scale-105 transition-transform duration-300 ease-in-out"/>
                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              <CardContent className="p-3 text-center bg-card rounded-b-lg">
                <prop.icon className="h-6 w-6 text-primary mx-auto mb-1.5 group-hover:text-accent transition-colors" />
                <p className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">{prop.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      {/* Featured Stays Section */}
      <section id="stays-section" className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-headline font-semibold text-foreground flex items-center mb-3 sm:mb-0">
            <BedDouble className="mr-3 h-7 w-7 text-primary" />
            Featured Stays
          </h2>
           <Button variant="link" asChild className="text-primary hover:text-primary/80 text-md">
              <Link href="/stays/search">View All Stays &rarr;</Link>
            </Button>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-x-visible no-scrollbar">
            {featuredStays.map((stay) => {
              const convertedPrice = stay.pricePerNight * currency.rate;
              return (
                <Card key={stay.id} className="overflow-hidden flex flex-col group rounded-lg w-[80vw] sm:w-[45vw] md:w-full flex-shrink-0">
                  <Link href={`/stays/${stay.id}`} className="block">
                    <div className="relative w-full h-56 overflow-hidden rounded-t-lg">
                      <Image
                        src={stay.image}
                        alt={stay.name}
                        layout="fill"
                        objectFit="cover"
                        data-ai-hint={stay.dataAiHint}
                        className="group-hover:scale-105 transition-transform duration-300 ease-in-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                      <Badge variant={stay.isEcoFriendly ? "default" : "secondary"} className={`absolute top-2 right-2 ${stay.isEcoFriendly ? 'bg-green-600 border-green-700 text-white' : 'bg-card/80 text-card-foreground/90 border-border'}`}>
                        {stay.isEcoFriendly && <Leaf className="mr-1 h-3 w-3" />}
                        {stay.category}
                      </Badge>
                    </div>
                  </Link>
                  <CardHeader className="pb-2 pt-3">
                    <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors duration-300">
                      <Link href={`/stays/${stay.id}`}>{stay.name}</Link>
                    </CardTitle>
                    <CardDescription className="flex items-center text-xs pt-0.5">
                      <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" /> {stay.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow py-2">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xl font-bold text-primary">
                        {currency.symbol}{convertedPrice.toFixed(2)}
                        <span className="text-xs font-normal text-muted-foreground"> / night</span>
                      </p>
                      {stay.rating && (
                        <div className="flex items-center gap-1 text-md">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="font-semibold text-foreground">{stay.rating}</span>
                        </div>
                      )}
                    </div>
                    {stay.moods && stay.moods.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {stay.moods.map(mood => <Badge key={mood} variant="outline" className="text-xs px-1.5 py-0.5">{mood}</Badge>)}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="p-3 bg-muted/30 rounded-b-lg">
                    <Button asChild className="w-full bg-accent hover:bg-accent/80 text-accent-foreground font-medium py-2.5 text-sm rounded-md shadow-sm hover:shadow-md transition-all">
                      <Link href={`/stays/${stay.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
      </section>

      {/* Your Recent Searches */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-headline font-semibold text-foreground mb-6 flex items-center">
          <Search className="mr-3 h-7 w-7 text-primary" />
          Your Recent Searches
        </h2>
        <div className="flex flex-wrap gap-3">
          {mockRecentSearches.map(search => (
            <Button 
              key={search.id} 
              variant="outline" 
              className="bg-muted/50 hover:bg-muted border-border hover:border-primary/50 text-foreground hover:text-primary"
              onClick={() => handleFilterAndNavigate(search.filter as any)}
            >
              {search.term}
            </Button>
          ))}
        </div>
      </section>

      {/* Trending Destinations Near You */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-headline font-semibold text-foreground mb-6 flex items-center">
          <Sparkles className="mr-3 h-7 w-7 text-primary" />
          Trending Near You (Demo Location)
        </h2>
        <div className="flex gap-6 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-x-visible no-scrollbar">
          {mockTrendingDestinations.map(dest => {
              const convertedPrice = parseFloat(dest.price) * currency.rate;
              return (
                <Card key={dest.id} className="overflow-hidden group rounded-lg cursor-pointer w-[70vw] sm:w-full flex-shrink-0" onClick={() => handleFilterAndNavigate(dest.filter as any)}>
                  <div className="relative h-48 w-full">
                    <Image src={dest.image} alt={dest.name} layout="fill" objectFit="cover" data-ai-hint={dest.dataAiHint} className="group-hover:scale-105 transition-transform duration-300 ease-in-out"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-3 text-white">
                        <h3 className="font-semibold text-lg">{dest.name}</h3>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Starts from <strong className="text-primary">{currency.symbol}{convertedPrice.toFixed(0)}</strong></span>
                      <span className="flex items-center gap-1"><Star className="h-4 w-4 text-yellow-400 fill-yellow-400"/> {dest.rating}</span>
                    </div>
                  </CardContent>
                </Card>
              )
          })}
        </div>
      </section>
      
      {/* Quick & Easy Trip Planner (Pick a Vibe) */}
      <section className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-headline font-semibold text-foreground mb-2">
          Pick a Vibe &amp; Explore
        </h2>
        <p className="text-muted-foreground mb-6">
          Quick &amp; easy trip planner — Pick a vibe and explore top destinations in Cameroon!
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {mockVibes.map(vibe => (
            <Button 
              key={vibe.name} 
              variant="outline" 
              size="lg" 
              className="bg-card hover:bg-accent/20 hover:border-accent text-foreground hover:text-accent-foreground shadow-sm border-border min-w-[150px] py-6 flex-col items-center h-auto group"
              onClick={() => handleFilterAndNavigate(vibe.filter as any)}
            >
              <vibe.icon className="h-7 w-7 mb-1.5 text-primary group-hover:text-accent transition-colors" />
              {vibe.name}
            </Button>
          ))}
        </div>
      </section>

      {/* Explore Destinations Closer to Home */}
       <section className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-headline font-semibold text-foreground mb-2 text-center">
          Nearby Gems
        </h2>
        <p className="text-muted-foreground mb-6 text-center">
          You don’t have to go far for your next trip.
        </p>
        <div className="flex gap-6 overflow-x-auto pb-4 sm:grid sm:grid-cols-3 sm:overflow-x-visible no-scrollbar">
          {mockNearbyGems.map(gem => (
            <Link key={gem.id} href={gem.link} passHref className="w-[80vw] sm:w-full flex-shrink-0">
              <Card className="overflow-hidden group rounded-lg cursor-pointer h-full">
                <div className="relative h-56 w-full">
                  <Image src={gem.image} alt={gem.name} layout="fill" objectFit="cover" data-ai-hint={gem.dataAiHint} className="group-hover:scale-105 transition-transform duration-300 ease-in-out"/>
                   <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg text-foreground group-hover:text-primary">{gem.name}</h3>
                  <p className="text-sm text-muted-foreground">{gem.distance}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Travel More, Spend Less */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-headline font-semibold text-foreground mb-2 text-center">
          Save While You Travel
        </h2>
        <p className="text-muted-foreground mb-6 text-center">
          Travel more, spend less — discover discounts based on your preferences.
        </p>
        <div className="flex gap-6 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:overflow-x-visible no-scrollbar">
          {mockDeals.map(deal => (
            <Card key={deal.id} className="overflow-hidden group rounded-lg cursor-pointer w-[80vw] md:w-full flex-shrink-0" onClick={() => handleFilterAndNavigate(deal.filter as any)}>
               <div className="relative h-40 w-full">
                 <Image src={deal.image} alt={deal.title} layout="fill" objectFit="cover" data-ai-hint={deal.dataAiHint} className="group-hover:scale-105 transition-transform duration-300 ease-in-out"/>
                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10"></div>
                 <div className="absolute bottom-0 left-0 p-4">
                    <h3 className="font-bold text-xl text-white">{deal.title}</h3>
                 </div>
              </div>
              <CardContent className="p-4">
                <Progress value={deal.urgency} className="h-2 mb-2 [&>div]:bg-accent" />
                <p className="text-sm font-medium text-accent-foreground text-center">{deal.urgencyText}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Notification Prompt */}
      {showNotificationPrompt && (
        <div className="fixed bottom-20 right-5 z-50 md:bottom-5">
          <Card className="w-80 shadow-xl border-primary/50 bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2"><Bell className="h-5 w-5 text-primary"/>{t('notificationTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>{t('notificationDescription')}</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => handleNotificationPrompt(false)}>{t('later')}</Button>
              <Button size="sm" onClick={() => handleNotificationPrompt(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">{t('enable')}</Button>
            </CardFooter>
          </Card>
        </div>
      )}

    </div>
  );
}
