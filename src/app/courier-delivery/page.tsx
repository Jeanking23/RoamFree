
// src/app/courier-delivery/page.tsx
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Truck, MapPin, User, Package, CalendarDays, Clock, CheckCircle, ShieldCheck, Receipt, Star, UploadCloud, MessageSquare, Navigation, Edit3, Languages, Phone, Mail, Briefcase, ShoppingBag, KeyRound, Info, Send, ListFilter } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import Image from 'next/image';
import { Separator } from "@/components/ui/separator";

const courierBookingSchema = z.object({
  // Sender Details
  senderName: z.string().min(2, "Sender name is required."),
  senderAddress: z.string().min(5, "Sender address is required."),
  senderContact: z.string().min(7, "Sender contact is required."),
  // Receiver Details
  receiverName: z.string().min(2, "Receiver name is required."),
  receiverAddress: z.string().min(5, "Receiver address is required."),
  receiverContact: z.string().min(7, "Receiver contact is required."),
  // Package Details
  packageDescription: z.string().min(5, "Package description is required.").max(200),
  serviceType: z.enum(["LOCAL", "EXPRESS", "BULK", "SECURE"]),
  pickupType: z.enum(["INSTANT", "SCHEDULED"]),
  pickupDate: z.date().optional(),
  pickupTime: z.string().optional(),
  deliveryNotes: z.string().max(300).optional(),
  requireOtpSignature: z.boolean().default(false),
  servicePoint: z.string().optional(),
});

type CourierBookingFormValues = z.infer<typeof courierBookingSchema>;

const mockPackageStatuses = [
    "Processing Request...",
    "Courier Assigned: John D.",
    "Package Picked Up",
    "In Transit - ETA: 35 mins",
    "Nearing Destination",
    "Delivered - Awaiting OTP/Signature",
    "Delivery Confirmed!",
];

const servicePoints = [
    { id: 'sp1', name: 'Downtown Service Point', address: '123 Main St, Downtown, Cityville' },
    { id: 'sp2', name: 'Westside Drop-off Hub', address: '456 Oak Ave, Westside, Cityville' },
    { id: 'sp3', name: 'Airport Logistics Center', address: '789 Airport Rd, Cityville International' },
];


export default function CourierDeliveryPage() {
  const [bookingResult, setBookingResult] = useState<{ cost?: string; trackingId?: string } | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [currentPackageStatusIndex, setCurrentPackageStatusIndex] = useState(-1);
  const [showRating, setShowRating] = useState(false);

  const form = useForm<CourierBookingFormValues>({
    resolver: zodResolver(courierBookingSchema),
    defaultValues: {
      senderName: "", senderAddress: "", senderContact: "",
      receiverName: "", receiverAddress: "", receiverContact: "",
      packageDescription: "", serviceType: "LOCAL", pickupType: "INSTANT",
      deliveryNotes: "", requireOtpSignature: false,
    },
  });

  const pickupType = form.watch("pickupType");

  useEffect(() => {
    if (currentPackageStatusIndex >= 0 && currentPackageStatusIndex < mockPackageStatuses.length -1) {
        const timer = setTimeout(() => {
            setCurrentPackageStatusIndex(prev => prev + 1);
        }, 3000); // Simulate status update every 3 seconds
        return () => clearTimeout(timer);
    } else if (currentPackageStatusIndex === mockPackageStatuses.length -1) {
        setShowRating(true);
    }
  }, [currentPackageStatusIndex]);


  async function onSubmit(data: CourierBookingFormValues) {
    setIsBooking(true);
    setBookingResult(null);
    setCurrentPackageStatusIndex(-1);
    setShowRating(false);
    console.log("Courier Booking Submitted:", data);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const randomCost = (Math.random() * 30 + 5).toFixed(2);
    const randomTrackingId = `RF${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    
    setBookingResult({ cost: randomCost, trackingId: randomTrackingId });
    setCurrentPackageStatusIndex(0); // Start status updates
    toast({ title: "Booking Request Sent!", description: `Estimated cost: $${randomCost}. Tracking ID: ${randomTrackingId}` });
    setIsBooking(false);
    // form.reset(); // Optionally reset form
  }

  const handleReportIssue = () => {
    toast({ title: "Report Issue (Demo)", description: "Opening issue reporting system for your delivery."});
  }
  
  const handleRateCourier = (rating: number) => {
    toast({ title: "Courier Rated (Demo)", description: `You rated the courier ${rating} stars. Thank you for your feedback!`});
    setShowRating(false); // Hide rating after submission
  }


  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <Truck className="h-8 w-8" />
            Courier &amp; Delivery Services
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Send packages, documents, or items quickly and reliably. Options for instant or scheduled delivery.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><User className="h-5 w-5 text-primary"/>Sender Details</CardTitle></CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="senderName" render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="Sender's full name" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="senderContact" render={({ field }) => (<FormItem><FormLabel>Contact (Phone/Email)</FormLabel><FormControl><Input placeholder="Sender's phone or email" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField
                        control={form.control}
                        name="servicePoint"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Pickup from Service Point (Optional)</FormLabel>
                             <Select onValueChange={(value) => {
                                field.onChange(value);
                                const selectedPoint = servicePoints.find(p => p.id === value);
                                if (selectedPoint) {
                                    form.setValue('senderAddress', selectedPoint.address, { shouldValidate: true });
                                }
                             }} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Or select a drop-off location" /></SelectTrigger></FormControl>
                              <SelectContent>
                                {servicePoints.map(point => (
                                    <SelectItem key={point.id} value={point.id}>{point.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField control={form.control} name="senderAddress" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Pickup Address</FormLabel><FormControl><Input placeholder="Full pickup address" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><User className="h-5 w-5 text-primary"/>Receiver Details</CardTitle></CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="receiverName" render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="Receiver's full name" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="receiverContact" render={({ field }) => (<FormItem><FormLabel>Contact (Phone/Email)</FormLabel><FormControl><Input placeholder="Receiver's phone or email" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="receiverAddress" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Delivery Address</FormLabel><FormControl><Input placeholder="Full delivery address" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><Package className="h-5 w-5 text-primary"/>Package &amp; Service Details</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <FormField control={form.control} name="packageDescription" render={({ field }) => (<FormItem><FormLabel>Package Description</FormLabel><FormControl><Textarea placeholder="e.g., Important documents, Small electronics, Box of keys" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField
                        control={form.control} name="serviceType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Select service type" /></SelectTrigger></FormControl>
                              <SelectContent>
                                <SelectItem value="LOCAL">Local Courier (Same-day)</SelectItem>
                                <SelectItem value="EXPRESS">Express Courier (1-2 hours)</SelectItem>
                                <SelectItem value="BULK">Bulk Delivery (Multiple/Heavy items)</SelectItem>
                                <SelectItem value="SECURE">Secure Courier (ID Verified - for sensitive items)</SelectItem>
                              </SelectContent>
                            </Select>
                            {field.value === "SECURE" && <FormDescription className="text-primary">Secure Courier uses ID-verified couriers.</FormDescription>}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control} name="pickupType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pickup Option</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Select pickup type" /></SelectTrigger></FormControl>
                              <SelectContent>
                                <SelectItem value="INSTANT">Instant Pickup</SelectItem>
                                <SelectItem value="SCHEDULED">Scheduled Pickup</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {pickupType === "SCHEDULED" && (
                        <div className="grid md:grid-cols-2 gap-4">
                           <FormField control={form.control} name="pickupDate" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Pickup Date</FormLabel><FormControl><Input type="date" {...field} onChange={(e) => field.onChange(new Date(e.target.value))} /></FormControl><FormMessage /></FormItem> )} />
                           <FormField control={form.control} name="pickupTime" render={({ field }) => ( <FormItem><FormLabel>Pickup Time</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        </div>
                      )}
                      <FormField control={form.control} name="deliveryNotes" render={({ field }) => (<FormItem><FormLabel>Delivery Notes (Optional)</FormLabel><FormControl><Textarea placeholder="e.g., Leave at front desk, Call upon arrival" {...field} /></FormControl><FormMessage /></FormItem>)} />
                       <FormField
                        control={form.control} name="requireOtpSignature"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 shadow-sm">
                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            <FormLabel className="font-normal">Require OTP / Signature for Delivery Verification</FormLabel>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                  <Button type="submit" disabled={isBooking || currentPackageStatusIndex !== -1} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    <span><Send className="mr-2 h-4 w-4" /> {isBooking ? "Processing..." : "Request Courier & Get Estimate"}</span>
                  </Button>
                </form>
              </Form>
            </div>

            <div className="lg:col-span-1 space-y-6">
              {bookingResult && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Receipt className="h-5 w-5 text-primary"/>Booking Confirmation (Demo)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p><strong>Estimated Cost:</strong> ${bookingResult.cost}</p>
                    <p><strong>Tracking ID:</strong> {bookingResult.trackingId}</p>
                    <p className="text-sm text-muted-foreground">Payment will be processed upon confirmation. (Demo)</p>
                    <Button className="w-full mt-2" onClick={() => toast({title: "Payment Gateway (Demo)", description:"Proceeding to secure payment..."})}>Proceed to Payment (Demo)</Button>
                  </CardContent>
                </Card>
              )}

              {currentPackageStatusIndex !== -1 && bookingResult?.trackingId && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Navigation className="h-5 w-5 text-primary"/>Live Package Tracking (Demo)</CardTitle>
                    <CardDescription>Tracking ID: {bookingResult.trackingId}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="aspect-video bg-muted rounded-md flex items-center justify-center border">
                       <Image src={`https://placehold.co/400x225.png`} alt="Live map placeholder" width={400} height={225} className="object-cover w-full h-full" data-ai-hint="city map courier route"/>
                    </div>
                    <p className="font-semibold text-lg">Current Status:</p>
                    <p className="text-primary animate-pulse">{mockPackageStatuses[currentPackageStatusIndex]}</p>
                    {currentPackageStatusIndex === mockPackageStatuses.length -1 && (
                        <>
                         <div className="flex items-center gap-2 text-green-600 pt-2"> <CheckCircle className="h-5 w-5"/>Package Delivered Successfully!</div>
                         <p className="text-sm text-muted-foreground">Photo proof of delivery and receipt sent via email/app notification (Demo).</p>
                         <div className="flex items-center gap-2 mt-2">
                            <UploadCloud className="h-5 w-5 text-muted-foreground"/>
                            <span className="text-sm text-muted-foreground">View Photo Proof (Demo)</span>
                         </div>
                        </>
                    )}
                  </CardContent>
                </Card>
              )}
              
              {showRating && bookingResult?.trackingId && (
                <Card className="mt-4 border-accent">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Star className="h-5 w-5 text-accent"/>Rate Your Courier (Demo)</CardTitle>
                        <CardDescription>How was your delivery experience with Tracking ID: {bookingResult.trackingId}?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-center gap-1">
                            {[1,2,3,4,5].map(star => (
                                <Button key={star} variant="ghost" size="icon" onClick={() => handleRateCourier(star)}>
                                    <Star className="h-7 w-7 text-yellow-400 hover:fill-yellow-400"/>
                                </Button>
                            ))}
                        </div>
                        <Textarea placeholder="Add comments about your experience (optional)..." />
                        <Button variant="outline" className="w-full" onClick={handleReportIssue}>
                            <MessageSquare className="mr-2 h-4 w-4"/> Report an Issue
                        </Button>
                    </CardContent>
                </Card>
              )}
              
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><ShieldCheck className="h-5 w-5 text-primary"/>Courier Service Info</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div>
                    <h4 className="font-semibold text-foreground mb-1 flex items-center gap-1"><ListFilter className="h-4 w-4"/>Service Types:</h4>
                    <ul className="list-disc list-inside pl-4">
                      <li><strong>Local Courier:</strong> Same-day within city.</li>
                      <li><strong>Express Courier:</strong> Delivery in 1-2 hours.</li>
                      <li><strong>Bulk Delivery:</strong> For multiple or heavier items.</li>
                      <li><strong>Secure Courier:</strong> ID-verified for sensitive packages.</li>
                    </ul>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1 flex items-center gap-1"><ShoppingBag className="h-4 w-4"/>Courier Categories:</h4>
                     <ul className="list-disc list-inside pl-4">
                        <li><strong>Personal:</strong> Documents, food, small items.</li>
                        <li><strong>Business:</strong> Office deliveries, contracts.</li>
                        <li><strong>Rental Support:</strong> Forgotten items, key returns.</li>
                    </ul>
                  </div>
                   <Separator />
                  <p className="flex items-center gap-1"><Languages className="h-4 w-4"/>Multi-language notifications available (Demo).</p>
                  <p className="flex items-center gap-1"><Edit3 className="h-4 w-4"/>Are you a courier? <a href="#" className="text-primary hover:underline">Access Courier Dashboard (Coming Soon)</a>.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
