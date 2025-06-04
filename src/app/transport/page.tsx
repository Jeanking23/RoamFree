
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  CircleDot,
  SquareDot,
  CalendarDays,
  Clock,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';

const destinationSuggestions = [
  {
    id: 1,
    name: 'Philadelphia International Airport (PHL)',
    address: '8000 Essington Ave, Philadelphia, PA',
  },
  {
    id: 2,
    name: 'William H. Gray III 30th Street Amtrak Train Station',
    address: '2955 Market St, Philadelphia, PA',
  },
];

export default function TransportPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Page Navigation */}
      <nav className="mb-8">
        <ul className="flex flex-wrap justify-center md:justify-start items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <li>
            <Link href="#" className="hover:text-primary font-medium text-primary">
              Request a ride
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:text-primary">
              Reserve a ride
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:text-primary">
              See prices
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:text-primary">
              Explore ride options
            </Link>
          </li>
        </ul>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-1 space-y-6">
          <h1 className="text-4xl font-bold text-foreground">Request a ride</h1>

          <div className="relative space-y-2 bg-white p-4 rounded-lg shadow">
            {/* Pickup */}
            <div className="flex items-center space-x-3">
              <CircleDot className="h-6 w-6 text-black flex-shrink-0" />
              <Input
                placeholder="Pickup location"
                className="bg-gray-100 border-0 focus-visible:ring-primary text-base h-12"
              />
            </div>

            {/* Vertical line */}
            {/* Adjust height based on actual content, this is an approximation */}
            <div className="absolute left-[11px] top-[38px] h-[calc(100%-76px)] min-h-[20px] w-0.5 bg-gray-300 z-0"></div>
            
            {/* Dropoff */}
            <div className="flex items-center space-x-3 pt-1"> {/* Added pt-1 for slight spacing if needed */}
              <SquareDot className="h-6 w-6 text-black flex-shrink-0" />
              <Input
                placeholder="Dropoff location"
                className="bg-gray-100 border-0 focus-visible:ring-primary text-base h-12"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 bg-white p-4 rounded-lg shadow">
            <Button
              variant="outline"
              className="bg-gray-100 border-0 justify-start text-foreground hover:bg-gray-200 h-12 text-base"
            >
              <CalendarDays className="mr-2 h-5 w-5 text-muted-foreground" /> Today
            </Button>
            <Button
              variant="outline"
              className="bg-gray-100 border-0 justify-start text-foreground hover:bg-gray-200 h-12 text-base"
            >
              <Clock className="mr-2 h-5 w-5 text-muted-foreground" /> Now{' '}
              <ChevronDown className="ml-auto h-5 w-5 text-muted-foreground" />
            </Button>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-sm font-medium text-muted-foreground mb-3">
              Destination suggestions
            </h2>
            <div className="space-y-4">
              {destinationSuggestions.map((suggestion) => (
                <div key={suggestion.id} className="flex items-start space-x-3 cursor-pointer group">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground group-hover:text-primary">
                      {suggestion.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {suggestion.address}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button className="w-full bg-black text-white hover:bg-gray-800 py-3 h-12 text-base font-medium">
            See prices
          </Button>
        </div>

        {/* Right Column: Map */}
        <div className="lg:col-span-2 h-[400px] md:h-[600px] lg:h-auto">
          <Image
            src="https://placehold.co/800x1000.png"
            alt="Map of Philadelphia"
            width={800}
            height={1000}
            className="rounded-lg object-cover w-full h-full shadow-md"
            data-ai-hint="city map Philadelphia"
          />
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-3xl font-bold text-foreground mb-6">Suggestions</h2>
        {/* Placeholder for suggestion cards/list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <Card key={i} className="p-6">
              <CardContent className="p-0">
                <h3 className="font-semibold mb-2">Suggested Item {i}</h3>
                <p className="text-sm text-muted-foreground">More details about suggestion {i} will appear here.</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
