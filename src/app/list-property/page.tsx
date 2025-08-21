// src/app/list-property/page.tsx
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Building, Info, Lightbulb, CheckCircle, MapPin } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import InteractiveMapPlaceholder from "@/components/map/interactive-map-placeholder"; // Placeholder for map component

const listingSteps = [
  { id: "name", title: "Basic Info" },
  { id: "location", title: "Location" },
  { id: "details", title: "Details" },
  { id: "photos", title: "Photos" },
  { id: "pricing", title: "Pricing & Availability" },
  { id: "publish", title: "Publish" },
];

const NameStep = () => (
  <div className="grid md:grid-cols-2 gap-8 items-start">
    <div>
      <CardHeader className="p-0">
        <CardTitle className="text-3xl font-headline text-primary">What's the name of your place?</CardTitle>
        <CardDescription className="pt-2">Give your property a name that stands out to guests.</CardDescription>
      </CardHeader>
      <CardContent className="p-0 pt-6">
        <div className="space-y-2">
          <Label htmlFor="property-name" className="text-base">Property Name</Label>
          <Input id="property-name" placeholder="e.g., Sunny Beachfront Villa" className="text-lg h-12" />
        </div>
      </CardContent>
    </div>
    <div className="space-y-6">
       <Card className="bg-muted/30 border-dashed">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><Lightbulb className="h-5 w-5 text-yellow-400" />What should I consider when choosing a name?</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />Keep it short and catchy</li>
                    <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />Avoid abbreviations</li>
                    <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />Stick to the facts</li>
                </ul>
            </CardContent>
       </Card>
       <Card className="bg-muted/30 border-dashed">
             <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><Info className="h-5 w-5 text-primary"/>Why do I need to name my property?</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">The name is the first thing guests see. A good name can make your listing memorable.
                <br/><strong className="text-foreground">Do not use your property's address as the name.</strong>
                </p>
            </CardContent>
       </Card>
    </div>
  </div>
);

const LocationStep = () => {
    const [address, setAddress] = useState("");

    return (
        <div className="grid md:grid-cols-2 gap-8 h-full">
            <Card className="flex flex-col">
                 <CardHeader>
                    <CardTitle className="text-2xl font-headline text-primary">Where is your property?</CardTitle>
                    <CardDescription>Enter the address so guests can find you.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 flex-grow">
                     <div>
                        <Label htmlFor="address-search">Find Your Address</Label>
                        <Input 
                            id="address-search" 
                            placeholder="Start typing your street address..." 
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="apt-suite">Apartment or floor number (Optional)</Label>
                        <Input id="apt-suite" placeholder="e.g., Apt 3B" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="country">Country/Region</Label>
                            <Select defaultValue="US">
                                <SelectTrigger id="country"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="US">United States</SelectItem>
                                    <SelectItem value="CA">Canada</SelectItem>
                                    <SelectItem value="CM">Cameroon</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div>
                            <Label htmlFor="city">City</Label>
                            <Input id="city" placeholder="e.g., Camden" />
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="state">State</Label>
                            <Select defaultValue="DE">
                                <SelectTrigger id="state"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DE">Delaware</SelectItem>
                                    <SelectItem value="CA">California</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div>
                            <Label htmlFor="zip">Zip Code</Label>
                            <Input id="zip" placeholder="e.g., 19934" />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 pt-2">
                        <Checkbox id="update-pin" defaultChecked />
                        <Label htmlFor="update-pin" className="text-sm font-normal">Update the address by moving the pin on the map.</Label>
                    </div>
                     <p className="text-xs text-muted-foreground">If the pin isn't quite right, you can drag it to the correct location.</p>
                </CardContent>
            </Card>
            <div className="h-full min-h-[400px] md:min-h-0 rounded-lg overflow-hidden">
                <InteractiveMapPlaceholder pickup={address} />
            </div>
        </div>
    );
};


export default function ListPropertyPage() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < listingSteps.length - 1) {
        setCurrentStep(prev => prev + 1);
    } else {
        toast({ title: "Listing Submitted (Demo)", description: "Your property is now pending review."});
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const progress = ((currentStep + 1) / listingSteps.length) * 100;

  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden flex flex-col h-[85vh]">
        <CardHeader className="bg-primary/10 border-b z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-semibold text-primary">List Your Property</h1>
            </div>
          </div>
          <div className="pt-4">
             <Progress value={progress} className="w-full h-2" />
             <div className="flex justify-between text-xs text-muted-foreground mt-1">
                {listingSteps.map((step, index) => (
                    <span key={step.id} className={cn(
                        "font-medium",
                        index === currentStep && "text-primary",
                        index < currentStep && "text-primary/70"
                    )}>
                        {step.title}
                    </span>
                ))}
             </div>
          </div>
        </CardHeader>
        <div className="p-6 md:p-8 flex-grow flex flex-col">
            <AnimatePresence mode="wait">
                 <motion.div
                    key={currentStep}
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flex-grow flex flex-col"
                 >
                    {currentStep === 0 && <NameStep />}
                    {currentStep === 1 && <LocationStep />}
                    {/* Add other steps as components here */}
                    {currentStep > 1 && (
                        <div className="flex-grow flex items-center justify-center">
                            <p className="text-muted-foreground">Step {currentStep + 1} content goes here.</p>
                        </div>
                    )}
                 </motion.div>
            </AnimatePresence>
        </div>
        <CardFooter className="border-t p-4 flex justify-between bg-muted/50 mt-auto z-10">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
                <ArrowLeft className="mr-2 h-4 w-4"/> Back
            </Button>
            <Button onClick={nextStep}>
                {currentStep === listingSteps.length - 1 ? 'Publish Listing' : 'Continue'}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
