
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Gift, Users, Copy, CheckCircle, DollarSign, ShoppingBag } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

// Helper CarFront icon if not available globally
const CarFront = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
    <path d="M12 10V7h1.8c.4 0 .9.1 1.2.3"/>
    <path d="M5 10h1"/>
    <circle cx="7" cy="17" r="2"/>
    <path d="M9 17h6"/>
    <circle cx="17" cy="17" r="2"/>
  </svg>
);

// Mock data
const mockLoyaltyData = {
  points: 1250,
  tier: "Gold Explorer",
  nextTierPoints: 2500,
  nextTierName: "Platinum Voyager",
  referralCode: "ROAMFREEALEX",
  referralsMade: 3,
  referralBonus: "100 points per successful referral",
};

const mockRedeemOptions = [
  { id: "rdm001", name: "$10 Off Next Booking", pointsRequired: 500, icon: DollarSign },
  { id: "rdm002", name: "Free Airport Lounge Pass", pointsRequired: 1500, icon: ShoppingBag },
  { id: "rdm003", name: "Upgrade on Car Rental", pointsRequired: 1000, icon: CarFront }, // Using CarFront from lucide
];


export default function LoyaltyPage() {
  const [loyaltyData, setLoyaltyData] = useState(mockLoyaltyData);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(loyaltyData.referralCode);
    toast({ title: "Referral Code Copied!", description: `${loyaltyData.referralCode} copied to clipboard.` });
  };

  const handleRedeemPoints = (optionName: string, points: number) => {
    if (loyaltyData.points >= points) {
      // Simulate point deduction
      setLoyaltyData(prev => ({ ...prev, points: prev.points - points }));
      toast({ title: "Redeemed Successfully!", description: `You've redeemed "${optionName}". Points updated.`});
    } else {
      toast({ title: "Not Enough Points", description: `You need ${points - loyaltyData.points} more points to redeem "${optionName}".`, variant: "destructive"});
    }
  };


  const pointsToNextTier = loyaltyData.nextTierPoints - loyaltyData.points;
  const progressToNextTier = Math.max(0, Math.min(100, (loyaltyData.points / loyaltyData.nextTierPoints) * 100));


  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <Award className="h-10 w-10" />
            Loyalty & Referral Program
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Earn points, get rewards, and share the joy of travel with RoamFree.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {/* Loyalty Status Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Award className="h-6 w-6 text-yellow-500" /> Your Loyalty Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-accent/10 rounded-md">
                <div>
                  <p className="text-4xl font-bold text-accent-foreground">{loyaltyData.points.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Available Points</p>
                </div>
                <div className="text-right mt-2 sm:mt-0">
                  <p className="text-xl font-semibold text-accent-foreground">{loyaltyData.tier}</p>
                  <p className="text-xs text-muted-foreground">Current Tier</p>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress to {loyaltyData.nextTierName}</span>
                  <span>{loyaltyData.points}/{loyaltyData.nextTierPoints} points</span>
                </div>
                <Progress value={progressToNextTier} className="w-full h-3" />
                <p className="text-xs text-muted-foreground mt-1">
                  {pointsToNextTier > 0 ? `${pointsToNextTier.toLocaleString()} points needed for next tier.` : "You're at the highest tier!"}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">Keep booking with RoamFree to earn more points and unlock exclusive benefits for each tier!</p>
            </CardContent>
          </Card>

          {/* Redeem Points Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Gift className="h-6 w-6 text-primary" /> Redeem Your Points</CardTitle>
              <CardDescription>Use your points for exciting rewards and discounts.</CardDescription>
            </CardHeader>
            <CardContent>
              {mockRedeemOptions.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockRedeemOptions.map(option => (
                    <Card key={option.id} className="p-4 flex flex-col items-center text-center">
                      <option.icon className="h-12 w-12 text-accent mb-3" />
                      <h4 className="font-semibold text-lg mb-1">{option.name}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{option.pointsRequired.toLocaleString()} Points</p>
                      <Button 
                        size="sm" 
                        onClick={() => handleRedeemPoints(option.name, option.pointsRequired)}
                        disabled={loyaltyData.points < option.pointsRequired}
                      >
                        Redeem
                      </Button>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No redemption options available at the moment. Check back soon!</p>
              )}
            </CardContent>
             <CardFooter>
                 <p className="text-xs text-muted-foreground">More redemption options coming soon!</p>
             </CardFooter>
          </Card>

          {/* Referral Program Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Users className="h-6 w-6 text-primary" /> Refer & Earn</CardTitle>
              <CardDescription>Share RoamFree with friends and earn bonus points for both of you!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="referralCode">Your Unique Referral Code</Label>
                <div className="flex gap-2 mt-1">
                  <Input id="referralCode" value={loyaltyData.referralCode} readOnly />
                  <Button variant="outline" onClick={handleCopyToClipboard}><Copy className="mr-2 h-4 w-4" /> Copy</Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{loyaltyData.referralBonus}.</p>
              <div className="p-3 bg-muted/50 rounded-md">
                <p className="font-medium">You've successfully referred <span className="text-primary font-bold">{loyaltyData.referralsMade}</span> friends!</p>
                <p className="text-xs text-muted-foreground">Keep sharing to earn more rewards.</p>
              </div>
              <div className="flex gap-2">
                <Button className="bg-green-600 hover:bg-green-700 text-white">Share on WhatsApp (Demo)</Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Share on Facebook (Demo)</Button>
              </div>
            </CardContent>
          </Card>

        </CardContent>
      </Card>
    </div>
  );
}

