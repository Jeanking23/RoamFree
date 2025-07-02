
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserCircle, History, Settings, ShieldCheck, FileText, Heart, KeyRound, Building, CreditCard, Video, Bell, Car, Receipt, ThumbsUp, Star, FileUp } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { toast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

// Mock data - replace with actual data fetching
const mockUser = {
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  joinDate: "2023-01-15",
  isIdVerified: false, 
  isVideoIdVerified: false, // New
  mfaEnabled: false,
  preferences: {
    travelStyle: "Adventure, Cultural",
    dietaryNeeds: "Vegetarian",
    interests: "Hiking, Photography, Local Markets",
    pricingAlerts: true,
    receivePushNotifications: true, // New
  },
  walletBalance: 75.50, 
  driverLicenseUploaded: false, // New
};

const mockBookingHistory = [
  { id: "bk123", type: "Stay", name: "Beachfront Villa, Bali", date: "2024-03-10 - 2024-03-17", price: 1200, status: "Completed" },
  { id: "cr456", type: "Car Rental", name: "Toyota Camry, LAX", date: "2024-04-05 - 2024-04-08", price: 250, status: "Upcoming" },
  { id: "at789", type: "Attraction", name: "Eiffel Tower Summit", date: "2023-11-20", price: 50, status: "Completed" },
  { id: "ride001", type: "Ride", name: "Airport Transfer JFK", date: "2024-05-01", price: 65, status: "Completed" },
  { id: "courier001", type: "Courier", name: "Document Delivery", date: "2024-05-10", price: 15, status: "Delivered" }, // New
];

const mockSavedListings = [
  { id: "stay001", type: "Stay", name: "Mountain Cabin Retreat", location: "Aspen, CO", image: "https://placehold.co/300x200.png?text=Cabin", dataAiHint: "cabin mountain" },
  { id: "car002", type: "Car", name: "Jeep Wrangler", location: "Moab, UT", image: "https://placehold.co/300x200.png?text=Jeep", dataAiHint: "jeep offroad" },
];

const mockSavedDrivers = [
    { id: "drv001", name: "John B.", vehicle: "Toyota Prius", rating: 4.8, lastTrip: "2024-05-01"},
    { id: "drv002", name: "Maria S.", vehicle: "Honda CR-V", rating: 4.9, lastTrip: "2024-03-20"},
];

export default function ProfilePage() {
  const [lastLoginTime, setLastLoginTime] = useState('');

  useEffect(() => {
    // Set time only on the client-side after mounting to prevent hydration mismatch
    setLastLoginTime(new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}));
  }, []);

  const handleIdVerification = () => {
    toast({ title: "ID Verification (Demo)", description: "Starting ID verification process. This would typically involve uploading documents." });
  };
  
  const handleVideoIdVerification = () => {
    toast({ title: "Video ID Verification (Demo)", description: "Starting video-based ID verification. You might be asked to record a short video and show your ID." });
  };

  const handleMfaSetup = () => {
    toast({ title: "MFA Setup (Demo)", description: "Navigating to Multi-Factor Authentication setup." });
  };
  
  const handleSaveChanges = (section: string) => {
    toast({ title: "Changes Saved (Demo)", description: `Your ${section} have been updated.`});
  };

  const handleTopUpWallet = () => {
    toast({ title: "Top Up Wallet (Demo)", description: "Proceeding to wallet top-up options (e.g., Credit Card, PayPal). Multi-currency options coming soon." });
  };
  
  const handleUploadLicense = () => {
    toast({ title: "Upload Driver's License (Demo)", description: "Opening file upload for driver's license. This is for car rental verification."});
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <UserCircle className="h-10 w-10" />
            My Profile &amp; Account
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Manage your personal information, preferences, bookings, security, and wallet.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 md:p-6">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mb-6 p-1 h-auto">
              <TabsTrigger value="profile" className="py-2"><UserCircle className="h-5 w-5 mr-2 md:hidden lg:inline-block" />Profile</TabsTrigger>
              <TabsTrigger value="history" className="py-2"><History className="h-5 w-5 mr-2 md:hidden lg:inline-block" />History</TabsTrigger>
              <TabsTrigger value="preferences" className="py-2"><Settings className="h-5 w-5 mr-2 md:hidden lg:inline-block" />Preferences</TabsTrigger>
              <TabsTrigger value="security" className="py-2"><ShieldCheck className="h-5 w-5 mr-2 md:hidden lg:inline-block" />Security</TabsTrigger>
              <TabsTrigger value="wallet" className="py-2"><CreditCard className="h-5 w-5 mr-2 md:hidden lg:inline-block" />Wallet</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="p-4 md:p-0">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>View and update your personal details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={mockUser.name} />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue={mockUser.email} readOnly />
                     <p className="text-xs text-muted-foreground mt-1">Email cannot be changed here.</p>
                  </div>
                  <div>
                    <Label htmlFor="joinDate">Joined RoamFree</Label>
                    <Input id="joinDate" defaultValue={new Date(mockUser.joinDate).toLocaleDateString()} readOnly />
                  </div>
                   <div className="pt-2">
                    <Label htmlFor="driverLicense">Driver's License (for Car Rentals)</Label>
                    {mockUser.driverLicenseUploaded ? (
                        <p className="text-sm text-green-600 flex items-center"><ShieldCheck className="h-4 w-4 mr-1"/>License on File (Demo)</p>
                    ) : (
                        <Button variant="outline" size="sm" onClick={handleUploadLicense} className="mt-1">
                            <FileUp className="mr-2 h-4 w-4"/> Upload License (Demo)
                        </Button>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                   <Button onClick={() => handleSaveChanges("personal information")}>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="p-4 md:p-0">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                        <CardTitle>My Booking History</CardTitle>
                        <CardDescription>Review your past and upcoming bookings for stays, cars, attractions, rides, and courier services.</CardDescription>
                        </CardHeader>
                        <CardContent>
                        {mockBookingHistory.length > 0 ? (
                            <ul className="space-y-4">
                            {mockBookingHistory.map(booking => (
                                <li key={booking.id} className="p-4 border rounded-md hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div>
                                    <h4 className="font-semibold text-lg text-primary">{booking.name}</h4>
                                    <p className="text-sm text-muted-foreground">Type: {booking.type}</p>
                                    <p className="text-sm text-muted-foreground">Date: {booking.date}</p>
                                    </div>
                                    <div className="text-right">
                                    <p className="font-semibold text-lg">${booking.price}</p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${booking.status === "Completed" || booking.status === "Delivered" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                                        {booking.status}
                                    </span>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" className="mt-3 mr-2">View Details (Demo)</Button>
                                {(booking.type === "Ride" || booking.type === "Courier") && <Button variant="link" size="sm" className="mt-3 px-0">View Receipt (Demo) <Receipt className="ml-1 h-4 w-4"/></Button>}
                                </li>
                            ))}
                            </ul>
                        ) : (
                            <p>You have no booking history yet.</p>
                        )}
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4 text-center">
                            <p className="text-sm text-muted-foreground">Showing last {mockBookingHistory.length} bookings. <Link href="#" className="text-primary hover:underline">View all (Demo)</Link></p>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><ThumbsUp className="h-5 w-5 text-primary"/>Favorite Drivers (Demo)</CardTitle>
                            <CardDescription>Manage your list of preferred drivers for quick rebooking.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {mockSavedDrivers.length > 0 ? (
                                <ul className="space-y-3">
                                    {mockSavedDrivers.map(driver => (
                                        <li key={driver.id} className="p-3 border rounded-md flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold">{driver.name} <span className="text-xs text-muted-foreground">({driver.vehicle})</span></p>
                                                <p className="text-xs text-muted-foreground">Rating: {driver.rating} <Star className="inline h-3 w-3 text-yellow-400 fill-yellow-400"/> | Last trip: {driver.lastTrip}</p>
                                            </div>
                                            <Button variant="outline" size="sm">Rebook (Demo)</Button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-muted-foreground">You haven't saved any favorite drivers yet.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>

            <TabsContent value="preferences" className="p-4 md:p-0">
              <Card>
                <CardHeader>
                  <CardTitle>Travel & Notification Preferences</CardTitle>
                  <CardDescription>Help us tailor recommendations and alerts for you.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="travelStyle">Travel Style</Label>
                    <Input id="travelStyle" defaultValue={mockUser.preferences.travelStyle} placeholder="e.g., Adventure, Luxury, Budget-friendly"/>
                  </div>
                  <div>
                    <Label htmlFor="dietaryNeeds">Dietary Needs/Preferences</Label>
                    <Input id="dietaryNeeds" defaultValue={mockUser.preferences.dietaryNeeds} placeholder="e.g., Vegetarian, Gluten-free"/>
                  </div>
                  <div>
                    <Label htmlFor="interests">Interests &amp; Hobbies</Label>
                    <Textarea id="interests" defaultValue={mockUser.preferences.interests} placeholder="e.g., Hiking, Museums, Nightlife, Shopping"/>
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch id="pricing-alerts" defaultChecked={mockUser.preferences.pricingAlerts} />
                    <Label htmlFor="pricing-alerts">Enable AI Predictive Pricing Alerts (Demo)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="push-notifications" defaultChecked={mockUser.preferences.receivePushNotifications} />
                    <Label htmlFor="push-notifications">Receive Push Notifications (Trip reminders, price drops, etc. - Demo)</Label>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground">More preference options (e.g., preferred airline, hotel chains) coming soon!</p>
                    <p className="text-sm text-muted-foreground">Group travel coordination features will appear under 'My Trips' (Coming Soon).</p>
                  </div>
                </CardContent>
                 <CardFooter className="border-t px-6 py-4">
                   <Button onClick={() => handleSaveChanges("preferences")}>Save Preferences</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="p-4 md:p-0">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security options. AI Smart Fraud Detection is active (Demo).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <h4 className="font-medium">Standard ID Verification</h4>
                      <p className={`text-sm ${mockUser.isIdVerified ? "text-green-600" : "text-orange-600"}`}>
                        Status: {mockUser.isIdVerified ? "Verified" : "Not Verified"}
                      </p>
                       {!mockUser.isIdVerified && <p className="text-xs text-muted-foreground">Verification is required for listing properties or making certain bookings.</p>}
                    </div>
                    {!mockUser.isIdVerified && <Button onClick={handleIdVerification}>Verify ID (Demo)</Button>}
                    {mockUser.isIdVerified && <ShieldCheck className="h-6 w-6 text-green-600" />}
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <h4 className="font-medium">Video ID Verification</h4>
                       <p className={`text-sm ${mockUser.isVideoIdVerified ? "text-green-600" : "text-muted-foreground"}`}>
                        Status: {mockUser.isVideoIdVerified ? "Video Verified" : "Not Verified"}
                      </p>
                      <p className="text-xs text-muted-foreground">Enhance trust with video-based verification (Demo).</p>
                    </div>
                    {!mockUser.isVideoIdVerified && 
                        <Button variant="outline" onClick={handleVideoIdVerification}><Video className="mr-2 h-4 w-4"/>Start Video Verification (Demo)</Button>
                    }
                    {mockUser.isVideoIdVerified && <ShieldCheck className="h-6 w-6 text-green-600" />}
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <h4 className="font-medium">Multi-Factor Authentication (MFA)</h4>
                      <p className={`text-sm ${mockUser.mfaEnabled ? "text-green-600" : "text-muted-foreground"}`}>
                        Status: {mockUser.mfaEnabled ? "Enabled" : "Disabled"}
                      </p>
                       {!mockUser.mfaEnabled && <p className="text-xs text-muted-foreground">Enhance your account security by enabling MFA.</p>}
                    </div>
                    <Switch checked={mockUser.mfaEnabled} onCheckedChange={handleMfaSetup} id="mfa-switch"/>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                     <h4 className="font-medium">Password</h4>
                     <p className="text-sm text-muted-foreground mb-2">It's a good practice to use a strong, unique password.</p>
                     <Button variant="outline">Change Password (Demo)</Button>
                  </div>
                   <p className="text-xs text-muted-foreground">Blockchain-based verification for property ownership proof is a future feature.</p>
                </CardContent>
                 <CardFooter className="border-t px-6 py-4">
                   <p className="text-xs text-muted-foreground">Last login: Today at <span suppressHydrationWarning>{lastLoginTime}</span> (Simulated)</p>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="wallet" className="p-4 md:p-0">
              <Card>
                <CardHeader>
                  <CardTitle>My RoamFree Wallet</CardTitle>
                  <CardDescription>Manage your funds for seamless payments across the platform. Buy Now, Pay Later options (e.g. Klarna, Afterpay) available for select services (Demo).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-md bg-muted/50">
                    <Label>Current Balance</Label>
                    <p className="text-3xl font-bold text-primary">${mockUser.walletBalance.toFixed(2)}</p>
                  </div>
                  <Button onClick={handleTopUpWallet} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
                    <CreditCard className="mr-2 h-4 w-4"/> Top Up Wallet (Demo)
                  </Button>
                  <div>
                    <h4 className="font-medium mt-4">Wallet Features (Demo / Coming Soon)</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                      <li>View transaction history</li>
                      <li>Store funds in multiple currencies (e.g., USD, EUR, GBP)</li>
                      <li>Withdraw funds to your bank account</li>
                      <li>Pay using Klarna, Afterpay, or other Buy Now, Pay Later services for eligible bookings.</li>
                      <li>Secure Payment & Escrow for high-value transactions (e.g., property, car sales).</li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                   <p className="text-xs text-muted-foreground">Wallet transactions are secure and encrypted.</p>
                </CardFooter>
              </Card>
            </TabsContent>

          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
