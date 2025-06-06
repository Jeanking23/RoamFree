
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserCircle, History, Settings, ShieldCheck, FileText, Heart, KeyRound, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { toast } from '@/hooks/use-toast';

// Mock data - replace with actual data fetching
const mockUser = {
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  joinDate: "2023-01-15",
  isVerified: true,
  mfaEnabled: false,
  preferences: {
    travelStyle: "Adventure, Cultural",
    dietaryNeeds: "Vegetarian",
    interests: "Hiking, Photography, Local Markets",
  }
};

const mockBookingHistory = [
  { id: "bk123", type: "Stay", name: "Beachfront Villa, Bali", date: "2024-03-10 - 2024-03-17", price: 1200, status: "Completed" },
  { id: "cr456", type: "Car Rental", name: "Toyota Camry, LAX", date: "2024-04-05 - 2024-04-08", price: 250, status: "Upcoming" },
  { id: "at789", type: "Attraction", name: "Eiffel Tower Summit", date: "2023-11-20", price: 50, status: "Completed" },
];

const mockSavedListings = [
  { id: "stay001", type: "Stay", name: "Mountain Cabin Retreat", location: "Aspen, CO", image: "https://placehold.co/300x200.png?text=Cabin", dataAiHint: "cabin mountain" },
  { id: "car002", type: "Car", name: "Jeep Wrangler", location: "Moab, UT", image: "https://placehold.co/300x200.png?text=Jeep", dataAiHint: "jeep offroad" },
];

export default function ProfilePage() {

  const handleIdVerification = () => {
    toast({ title: "ID Verification", description: "Starting ID verification process (placeholder)." });
  };

  const handleMfaSetup = () => {
    toast({ title: "MFA Setup", description: "Navigating to MFA setup (placeholder)." });
  };
  
  const handleSaveChanges = (section: string) => {
    toast({ title: "Changes Saved", description: `Your ${section} have been updated (simulation).`});
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <UserCircle className="h-10 w-10" />
            My Profile & Account
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Manage your personal information, preferences, bookings, and security settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 md:p-6">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6 p-1 h-auto">
              <TabsTrigger value="profile" className="py-2"><UserCircle className="h-5 w-5 mr-2 md:hidden lg:inline-block" />Profile Details</TabsTrigger>
              <TabsTrigger value="history" className="py-2"><History className="h-5 w-5 mr-2 md:hidden lg:inline-block" />Booking History</TabsTrigger>
              <TabsTrigger value="preferences" className="py-2"><Settings className="h-5 w-5 mr-2 md:hidden lg:inline-block" />Preferences</TabsTrigger>
              <TabsTrigger value="security" className="py-2"><ShieldCheck className="h-5 w-5 mr-2 md:hidden lg:inline-block" />Security</TabsTrigger>
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
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                   <Button onClick={() => handleSaveChanges("personal information")}>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="p-4 md:p-0">
              <Card>
                <CardHeader>
                  <CardTitle>My Booking History</CardTitle>
                  <CardDescription>Review your past and upcoming bookings.</CardDescription>
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
                              <span className={`text-xs px-2 py-0.5 rounded-full ${booking.status === "Completed" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                                {booking.status}
                              </span>
                            </div>
                          </div>
                           <Button variant="outline" size="sm" className="mt-3">View Details</Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>You have no booking history yet.</p>
                  )}
                </CardContent>
                <CardFooter className="border-t px-6 py-4 text-center">
                    <p className="text-sm text-muted-foreground">Showing last {mockBookingHistory.length} bookings. <Link href="#" className="text-primary hover:underline">View all</Link></p>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="p-4 md:p-0">
              <Card>
                <CardHeader>
                  <CardTitle>Travel Preferences</CardTitle>
                  <CardDescription>Help us tailor recommendations for you.</CardDescription>
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
                    <Label htmlFor="interests">Interests & Hobbies</Label>
                    <Textarea id="interests" defaultValue={mockUser.preferences.interests} placeholder="e.g., Hiking, Museums, Nightlife, Shopping"/>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground">More preference options (e.g., preferred airline, hotel chains) coming soon!</p>
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
                  <CardDescription>Manage your account security options.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <h4 className="font-medium">Identity Verification</h4>
                      <p className={`text-sm ${mockUser.isVerified ? "text-green-600" : "text-orange-600"}`}>
                        Status: {mockUser.isVerified ? "Verified" : "Not Verified"}
                      </p>
                       {!mockUser.isVerified && <p className="text-xs text-muted-foreground">Verification is required for listing properties or making certain bookings.</p>}
                    </div>
                    {!mockUser.isVerified && <Button onClick={handleIdVerification}>Verify ID</Button>}
                    {mockUser.isVerified && <ShieldCheck className="h-6 w-6 text-green-600" />}
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
                     <Button variant="outline">Change Password</Button>
                  </div>
                </CardContent>
                 <CardFooter className="border-t px-6 py-4">
                   <p className="text-xs text-muted-foreground">Last login: Today at {new Date().toLocaleTimeString()} (Simulated)</p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

    