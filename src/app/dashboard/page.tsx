
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, CarFront, LandPlot, ListPlus, BarChart3, MessageSquare, DollarSign, Eye, Edit3, Trash2, CalendarCheck2, Settings, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Progress } from "@/components/ui/progress";
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

// Mock data - replace with actual data fetching
const mockListings = [
  { id: "prop101", name: "Sunny Beachfront Villa", type: "Stay", status: "Active", bookings: 15, views: 2500, revenue: 7500, image: "https://placehold.co/400x300.png?text=Villa", dataAiHint:"beach villa" },
  { id: "car202", name: "Toyota Camry 2022", type: "Car", status: "Needs Attention", bookings: 5, views: 800, revenue: 600, image: "https://placehold.co/400x300.png?text=Camry", dataAiHint:"sedan car" },
  { id: "land303", name: "Rural Acreage Plot", type: "Land", status: "Draft", bookings: 0, views: 150, revenue: 0, image: "https://placehold.co/400x300.png?text=Land+Plot", dataAiHint:"empty lot" },
];

const mockAnalytics = {
  totalRevenue: 12500,
  totalBookings: 45,
  totalViews: 12750,
  occupancyRate: 75, // For stays
  popularListing: "Sunny Beachfront Villa",
};

export default function DashboardPage() {

  const handleDeleteListing = (listingId: string, listingName: string) => {
    toast({
      title: "Delete Listing (Demo)",
      description: `Listing "${listingName}" has been marked for deletion. This is a placeholder action.`,
      variant: "destructive",
    });
    // In a real app, you'd call an API to delete the listing and update state
  };
  
  const handleToolClick = (toolName: string) => {
    toast({ title: `${toolName} (Demo)`, description: `Accessing the ${toolName.toLowerCase()}. This is a placeholder action.` });
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <Building className="h-10 w-10" />
            Owner Dashboard
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Manage your property, car, and land listings, track performance, and utilize host tools.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 md:p-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mb-6 p-1 h-auto">
              <TabsTrigger value="overview" className="py-2"><BarChart3 className="h-5 w-5 mr-2 md:hidden lg:inline-block" />Overview</TabsTrigger>
              <TabsTrigger value="listings" className="py-2"><ListPlus className="h-5 w-5 mr-2 md:hidden lg:inline-block" />Listings</TabsTrigger>
              <TabsTrigger value="bookings" className="py-2"><CalendarCheck2 className="h-5 w-5 mr-2 md:hidden lg:inline-block" />Bookings</TabsTrigger>
              <TabsTrigger value="messages" className="py-2"><MessageSquare className="h-5 w-5 mr-2 md:hidden lg:inline-block" />Messages</TabsTrigger>
              <TabsTrigger value="tools" className="py-2"><Settings className="h-5 w-5 mr-2 md:hidden lg:inline-block" />Host Tools</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="p-4 md:p-0">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${mockAnalytics.totalRevenue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                    <CalendarCheck2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{mockAnalytics.totalBookings}</div>
                    <p className="text-xs text-muted-foreground">+10 since last week</p>
                  </CardContent>
                </Card>
                 <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{mockAnalytics.totalViews.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">+5% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Occupancy Rate (Stays)</CardTitle>
                    <Building className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{mockAnalytics.occupancyRate}%</div>
                    <Progress value={mockAnalytics.occupancyRate} className="h-2 mt-1" />
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                    <CardTitle>Performance Snapshot</CardTitle>
                    <CardDescription>Your most popular listing is: <strong>{mockAnalytics.popularListing}</strong></CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Detailed charts and reports are coming soon to help you optimize your listings!</p>
                    <div className="mt-4 aspect-video bg-muted rounded-md flex items-center justify-center">
                        <BarChart3 className="h-16 w-16 text-muted-foreground/50" />
                        <p className="ml-4 text-muted-foreground">Analytics Chart Placeholder</p>
                    </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* My Listings Tab */}
            <TabsContent value="listings" className="p-4 md:p-0">
              <div className="flex justify-between items-center mb-6">
                <CardTitle>Manage Your Listings</CardTitle>
                <Button asChild>
                  <Link href="/list-property"><ListPlus className="mr-2 h-4 w-4" /> Add New Listing</Link>
                </Button>
              </div>
              {mockListings.length > 0 ? (
                <div className="space-y-6">
                  {mockListings.map(listing => (
                    <Card key={listing.id} className="flex flex-col md:flex-row gap-4 p-4 items-center hover:shadow-lg transition-shadow">
                      <Image src={listing.image} alt={listing.name} width={150} height={100} className="rounded-md object-cover w-full md:w-auto md:h-24" data-ai-hint={listing.dataAiHint} />
                      <div className="flex-grow">
                        <h4 className="text-lg font-semibold text-primary">{listing.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Type: {listing.type} | Status: <span className={`${listing.status === "Active" ? "text-green-600" : listing.status === "Draft" ? "text-gray-500" : "text-orange-500"}`}>{listing.status}</span>
                        </p>
                        <p className="text-sm">Views: {listing.views} | Bookings: {listing.bookings} | Revenue: ${listing.revenue.toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2 mt-2 md:mt-0 flex-shrink-0">
                        <Button variant="outline" size="sm" onClick={() => toast({title: "View Listing (Demo)"})}><Eye className="mr-1 h-4 w-4" /> View</Button>
                        <Button variant="outline" size="sm" onClick={() => toast({title: "Edit Listing (Demo)"})}><Edit3 className="mr-1 h-4 w-4" /> Edit</Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteListing(listing.id, listing.name)}><Trash2 className="mr-1 h-4 w-4" /> Delete</Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/30 rounded-md">
                  <p className="text-xl font-semibold">You haven't listed anything yet.</p>
                  <Button asChild className="mt-4">
                    <Link href="/list-property">Create Your First Listing</Link>
                  </Button>
                </div>
              )}
            </TabsContent>

             {/* Bookings Tab Placeholder */}
            <TabsContent value="bookings" className="p-4 md:p-0">
              <Card>
                <CardHeader>
                  <CardTitle>Manage Bookings</CardTitle>
                  <CardDescription>View and manage upcoming and past bookings for your listings.</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-12 bg-muted/30 rounded-md">
                  <CalendarCheck2 className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-xl font-semibold">Booking Management Coming Soon</p>
                  <p className="text-muted-foreground">You'll be able to see guest details, manage check-ins, and handle modifications here.</p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Messages Tab Placeholder */}
            <TabsContent value="messages" className="p-4 md:p-0">
              <Card>
                <CardHeader>
                  <CardTitle>Guest & Buyer Messages</CardTitle>
                  <CardDescription>Communicate with your guests and potential buyers directly.</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-12 bg-muted/30 rounded-md">
                  <MessageSquare className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-xl font-semibold">In-App Messaging Coming Soon</p>
                  <p className="text-muted-foreground">A secure way to chat with your clients will be available here.</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Host Tools Tab */}
            <TabsContent value="tools" className="p-4 md:p-0">
                <Card>
                    <CardHeader>
                        <CardTitle>Host & Vendor Tools</CardTitle>
                        <CardDescription>Access tools to optimize your listings and manage operations.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Card className="p-4">
                            <CardTitle className="text-lg mb-2">Automated Pricing Tool (Demo)</CardTitle>
                            <p className="text-sm text-muted-foreground mb-3">Let AI suggest optimal pricing based on demand, season, and local events.</p>
                            <Button onClick={() => handleToolClick("Smart Pricing Tool")}>Access Smart Pricing</Button>
                        </Card>
                        <Card className="p-4">
                            <CardTitle className="text-lg mb-2">Dynamic Availability (Demo)</CardTitle>
                            <p className="text-sm text-muted-foreground mb-3">Set custom rules for your listing's availability.</p>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Switch id="instant-booking" defaultChecked />
                                    <Label htmlFor="instant-booking">Enable Instant Booking</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch id="request-to-book" />
                                    <Label htmlFor="request-to-book">Enable Request to Book</Label>
                                </div>
                                <div>
                                    <Label htmlFor="blackout-dates">Blackout Dates (e.g., MM/DD/YYYY, MM/DD/YYYY)</Label>
                                    <Input id="blackout-dates" placeholder="Enter dates separated by commas" className="mt-1"/>
                                </div>
                            </div>
                            <Button className="mt-3" variant="outline" onClick={() => handleToolClick("Availability Settings")}>Update Availability Settings</Button>
                        </Card>
                        <Card className="p-4">
                            <CardTitle className="text-lg mb-2">Damage & Dispute Resolution (Demo)</CardTitle>
                            <p className="text-sm text-muted-foreground mb-3">Submit photo/video-based damage claims and access mediation services.</p>
                            <Button variant="secondary" onClick={() => handleToolClick("Dispute System")}><AlertTriangle className="mr-2 h-4 w-4"/>Open Dispute System</Button>
                        </Card>
                    </CardContent>
                </Card>
            </TabsContent>

          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
    