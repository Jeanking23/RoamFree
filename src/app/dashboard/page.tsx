
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, CarFront, LandPlot, ListPlus, BarChart3, MessageSquare, DollarSign, Eye, Edit3, Trash2, CalendarCheck2, Settings, AlertTriangle, ShieldCheck, Users, FileText, Wrench, LayoutDashboard, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Progress } from "@/components/ui/progress";
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator'; 
import { useState } from 'react';
import withAuth from '@/components/auth/with-auth';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Mock data - replace with actual data fetching
const mockListings = [
  { id: "prop101", name: "Sunny Beachfront Villa", type: "Stay", status: "Active", bookings: 15, views: 2500, revenue: 7500, image: "https://placehold.co/400x300.png?text=Villa", dataAiHint:"beach villa" },
  { id: "car202", name: "Toyota Camry 2022", type: "Car Rental", status: "Needs Attention", bookings: 5, views: 800, revenue: 600, image: "https://placehold.co/400x300.png?text=Camry", dataAiHint:"sedan car" },
  { id: "land303", name: "Rural Acreage Plot", type: "Land for Sale", status: "Draft", bookings: 0, views: 150, revenue: 0, image: "https://placehold.co/400x300.png?text=Land+Plot", dataAiHint:"empty lot" },
  { id: "carSale404", name: "Honda Civic 2019", type: "Car for Sale", status: "Active", offers: 3, views: 1200, askingPrice: 17500, image: "https://placehold.co/400x300.png?text=Civic+Sale", dataAiHint: "honda civic" },
];

const mockAnalytics = {
  totalRevenue: 12500,
  totalBookings: 45,
  totalViews: 12750,
  occupancyRate: 75, // For stays
  popularListing: "Sunny Beachfront Villa",
};

const chartData = mockListings
  .filter(l => l.type.includes('Rental') || l.type === 'Stay')
  .map(l => ({
    name: l.name.split(' ')[0], // Use a shorter name for the chart label
    revenue: l.revenue,
    bookings: l.bookings,
    views: l.views,
  }));

const chartConfig = {
  revenue: {
    label: "Revenue ($)",
    color: "hsl(var(--chart-1))",
  },
  bookings: {
    label: "Bookings",
    color: "hsl(var(--chart-2))",
  },
  views: {
    label: "Views",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;


function DashboardPage() {
  const [blackoutDates, setBlackoutDates] = useState('');

  const handleDeleteListing = (listingId: string, listingName: string) => {
    toast({
      title: "Delete Listing",
      description: `Listing "${listingName}" has been marked for deletion. This is a placeholder action.`,
      variant: "destructive",
    });
  };
  
  const handleToolClick = (toolName: string) => {
    toast({ title: `${toolName}`, description: `Accessing the ${toolName.toLowerCase()}.` });
  };
  
  const handleBookingAction = (action: string, clientName: string) => {
    toast({ title: `Action: ${action}`, description: `The request from ${clientName} has been processed.` });
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <LayoutDashboard className="h-10 w-10" />
            Partner Dashboard
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Manage your listings and services. Access tools and analytics to grow your business with RoamFree.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 md:p-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mb-6 p-1 h-auto">
              <TabsTrigger value="overview">
                <span className="flex items-center gap-2"><BarChart3 className="h-5 w-5 md:hidden lg:inline-block" />Overview</span>
              </TabsTrigger>
              <TabsTrigger value="listings">
                <span className="flex items-center gap-2"><ListPlus className="h-5 w-5 md:hidden lg:inline-block" />Listings</span>
              </TabsTrigger>
              <TabsTrigger value="bookings">
                <span className="flex items-center gap-2"><CalendarCheck2 className="h-5 w-5 md:hidden lg:inline-block" />Bookings/Offers</span>
              </TabsTrigger>
              <TabsTrigger value="messages">
                <span className="flex items-center gap-2"><MessageSquare className="h-5 w-5 md:hidden lg:inline-block" />Messages</span>
              </TabsTrigger>
              <TabsTrigger value="tools">
                <span className="flex items-center gap-2"><Settings className="h-5 w-5 md:hidden lg:inline-block" />Partner Tools</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="p-4 md:p-0">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue (Rentals)</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${mockAnalytics.totalRevenue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Bookings (Rentals)</CardTitle>
                    <CalendarCheck2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{mockAnalytics.totalBookings}</div>
                    <p className="text-xs text-muted-foreground">+10 since last week</p>
                  </CardContent>
                </Card>
                 <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Listing Views</CardTitle>
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
                    <CardDescription>Your most popular rental listing is: <strong>{mockAnalytics.popularListing}</strong></CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                      <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="name"
                          tickLine={false}
                          tickMargin={10}
                          axisLine={false}
                          tickFormatter={(value) => value.slice(0, 10)}
                        />
                         <YAxis />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
                        <Bar dataKey="bookings" fill="var(--color-bookings)" radius={4} />
                      </BarChart>
                    </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="listings" className="p-4 md:p-0">
              <div className="flex justify-between items-center mb-6">
                <CardTitle>Manage Your Listings</CardTitle>
                <div className="flex gap-2">
                    <Button asChild size="sm">
                        <Link href="/list-property"><span><ListPlus className="mr-2 h-4 w-4" />Add Property/Rental</span></Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                        <Link href="/cars-for-sale/new"><span><CarFront className="mr-2 h-4 w-4" />List Car for Sale</span></Link>
                    </Button>
                 </div>
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
                        {listing.type.includes("Sale") ?
                           <p className="text-sm">Offers: {listing.offers || 0} | Asking: ${listing.askingPrice?.toLocaleString() || 'N/A'}</p>
                           :
                           <p className="text-sm">Views: {listing.views} | Bookings: {listing.bookings} | Revenue: ${listing.revenue?.toLocaleString()}</p>
                        }
                      </div>
                      <div className="flex gap-2 mt-2 md:mt-0 flex-shrink-0">
                        <Button variant="outline" size="sm" onClick={() => toast({title: "View Listing"})}><span><Eye className="mr-1 h-4 w-4" />View</span></Button>
                        <Button variant="outline" size="sm" onClick={() => toast({title: "Edit Listing"})}><span><Edit3 className="mr-1 h-4 w-4" />Edit</span></Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteListing(listing.id, listing.name)}><span><Trash2 className="mr-1 h-4 w-4" />Delete</span></Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/30 rounded-md">
                  <p className="text-xl font-semibold">You haven't listed anything yet.</p>
                  <Link href="/list-property" passHref legacyBehavior>
                    <Button asChild className="mt-4">
                      <a>Create Your First Listing</a>
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>

            <TabsContent value="bookings" className="p-4 md:p-0">
                <Card>
                    <CardHeader>
                        <CardTitle>Manage Bookings &amp; Offers</CardTitle>
                        <CardDescription>Review and respond to new requests for your listings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Mock Booking Request */}
                        <Card className="bg-muted/50">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg font-semibold flex justify-between items-center">
                                    <span>Booking Request: Sunny Beachfront Villa</span>
                                    <span className="text-sm font-normal text-muted-foreground">2 hours ago</span>
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2 pt-1">
                                    <Avatar className="h-6 w-6"><AvatarFallback>EM</AvatarFallback></Avatar>
                                    <span>Emily R. &bull; 2 Guests</span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-sm space-y-1">
                                <p><strong className="text-foreground">Dates:</strong> Aug 15, 2024 - Aug 20, 2024</p>
                                <p><strong className="text-foreground">Payout:</strong> $1,250.00</p>
                            </CardContent>
                            <CardFooter className="flex gap-2">
                                <Button size="sm" onClick={() => handleBookingAction("Approved", "Emily R.")}>Approve</Button>
                                <Button size="sm" variant="outline" onClick={() => handleBookingAction("Declined", "Emily R.")}>Decline</Button>
                                <Button size="sm" variant="ghost">Message Emily</Button>
                            </CardFooter>
                        </Card>
                        {/* Mock Offer */}
                        <Card className="bg-muted/50">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg font-semibold flex justify-between items-center">
                                    <span>New Offer: Honda Civic 2019</span>
                                    <span className="text-sm font-normal text-muted-foreground">8 hours ago</span>
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2 pt-1">
                                    <Avatar className="h-6 w-6"><AvatarFallback>MK</AvatarFallback></Avatar>
                                    <span>Michael K.</span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-sm space-y-1">
                                <p><strong className="text-foreground">Offer Amount:</strong> $17,200.00</p>
                                <p><strong className="text-foreground">Asking Price:</strong> $17,500.00</p>
                            </CardContent>
                             <CardFooter className="flex gap-2">
                                <Button size="sm" onClick={() => handleBookingAction("Accepted", "Michael K.")}>Accept Offer</Button>
                                <Button size="sm" variant="outline" onClick={() => handleBookingAction("Countered", "Michael K.")}>Counter-offer</Button>
                                <Button size="sm" variant="ghost">Message Michael</Button>
                            </CardFooter>
                        </Card>
                         {/* Mock Completed Booking */}
                        <Card className="opacity-70">
                             <CardHeader className="pb-3">
                                <CardTitle className="text-lg font-semibold flex justify-between items-center">
                                    <span className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-600"/>Completed: Toyota Camry 2022</span>
                                    <span className="text-sm font-normal text-muted-foreground">1 day ago</span>
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2 pt-1">
                                    <Avatar className="h-6 w-6"><AvatarFallback>LD</AvatarFallback></Avatar>
                                    <span>Linda Davis</span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-sm">
                                <p><strong className="text-foreground">Dates:</strong> July 10, 2024 - July 12, 2024</p>
                                <p><strong className="text-foreground">Payout:</strong> $165.00</p>
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="messages" className="p-4 md:p-0">
              <Card>
                <CardHeader>
                  <CardTitle>Guest, Renter &amp; Buyer Messages</CardTitle>
                  <CardDescription>Communicate with your clients directly.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-4 p-4">
                    {/* Mock Message 1 */}
                    <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <Avatar>
                        <AvatarImage src="https://placehold.co/40x40.png" alt="John K." data-ai-hint="person avatar" />
                        <AvatarFallback>JK</AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center">
                          <p className="font-semibold">John K.</p>
                          <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">Regarding Sunny Beachfront Villa: Hi, I have a question about the check-in time...</p>
                      </div>
                    </div>
                    {/* Mock Message 2 */}
                    <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer bg-primary/10 border-l-4 border-primary">
                       <Avatar>
                        <AvatarImage src="https://placehold.co/40x40.png" alt="Jane D." data-ai-hint="person avatar" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center">
                          <p className="font-semibold">Jane D. (New Offer)</p>
                          <p className="text-xs text-muted-foreground">5 hours ago</p>
                        </div>
                        <p className="text-sm text-muted-foreground truncate font-medium text-primary">New offer received for Honda Civic 2019: $17,200</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                 <CardFooter className="border-t p-4">
                    <Button variant="outline" className="w-full">View All Messages</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="tools" className="p-4 md:p-0">
                <Card>
                    <CardHeader>
                        <CardTitle>Partner Tools</CardTitle>
                        <CardDescription>Access tools to optimize your listings and manage operations.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Card className="p-4">
                            <CardTitle className="text-lg mb-2 flex items-center gap-2"><DollarSign className="h-5 w-5"/>Automated Pricing Tool</CardTitle>
                            <p className="text-sm text-muted-foreground mb-3">Let AI suggest optimal pricing based on demand, season, and local events for rentals. Get valuation insights for sale items.</p>
                            <Button onClick={() => handleToolClick("Smart Pricing Tool")}>Access Smart Pricing</Button>
                        </Card>
                        <Card className="p-4">
                            <CardTitle className="text-lg mb-2 flex items-center gap-2"><CalendarCheck2 className="h-5 w-5"/>Dynamic Availability (Rentals)</CardTitle>
                            <p className="text-sm text-muted-foreground mb-3">Set custom rules for your rental listing's availability. Sync with Airbnb/Booking.com.</p>
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
                                    <Input 
                                      id="blackout-dates" 
                                      placeholder="Enter dates separated by commas" 
                                      className="mt-1"
                                      value={blackoutDates}
                                      onChange={(e) => setBlackoutDates(e.target.value)}
                                    />
                                </div>
                            </div>
                            <Button className="mt-3" variant="outline" onClick={() => handleToolClick("Availability Settings")}>Update Availability Settings</Button>
                        </Card>
                        <Card className="p-4">
                            <CardTitle className="text-lg mb-2 flex items-center gap-2"><AlertTriangle className="h-5 w-5"/>Damage &amp; Dispute Resolution</CardTitle>
                            <p className="text-sm text-muted-foreground mb-3">Submit photo/video-based damage claims for rentals and access mediation services.</p>
                            <Button variant="secondary" onClick={() => handleToolClick("Dispute System")}><span><Wrench className="mr-2 h-4 w-4"/>Open Dispute System</span></Button>
                        </Card>
                         <Card className="p-4">
                            <CardTitle className="text-lg mb-2 flex items-center gap-2"><Users className="h-5 w-5"/>Tenant/Buyer Screening</CardTitle>
                            <p className="text-sm text-muted-foreground mb-3">Optional tools to verify ID, income, or rental history for tenants, or buyer credibility for sales.</p>
                            <Button variant="outline" onClick={() => handleToolClick("Screening Tools")}>Access Screening Tools</Button>
                        </Card>
                        <Card className="p-4">
                            <CardTitle className="text-lg mb-2 flex items-center gap-2"><FileText className="h-5 w-5"/>Document Management</CardTitle>
                            <p className="text-sm text-muted-foreground mb-3">Upload and manage legal documents for properties for sale (title deeds, zoning certs). Manage digital lease agreements for rentals.</p>
                            <Button variant="outline" onClick={() => handleToolClick("Document Management")}>Manage Documents</Button>
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
    
export default withAuth(DashboardPage);

    