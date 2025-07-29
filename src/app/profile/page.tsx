
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserCircle, History, Settings, ShieldCheck, FileText, Heart, KeyRound, Building, CreditCard, Video, Bell, Car, Receipt, ThumbsUp, Star, FileUp, PlusCircle, MoreHorizontal, AlertCircle, Lock } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';
import { toast } from '@/hooks/use-toast';
import { useState, useEffect, useRef } from 'react';
import { useLocale } from '@/context/locale-provider';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import withAuth from '@/components/auth/with-auth';
import { useAuth } from '@/context/auth-provider';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { changePassword } from '@/lib/auth';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';


// Mock data - replace with actual data fetching
const mockUser = {
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  joinDate: "2023-01-15",
  isIdVerified: false, 
  isVideoIdVerified: false,
  mfaEnabled: false,
  preferences: {
    travelStyle: "Adventure, Cultural",
    dietaryNeeds: "Vegetarian",
    interests: "Hiking, Photography, Local Markets",
    pricingAlerts: true,
    receivePushNotifications: true,
  },
  walletBalance: 75.50,
  driverLicenseUploaded: false,
};

const mockBookingHistory = [
  { id: "bk123", type: "Stay", name: "Beachfront Villa, Bali", date: "2024-03-10 - 2024-03-17", price: 1200, status: "Completed" },
  { id: "cr456", type: "Car Rental", name: "Toyota Camry, LAX", date: "2024-04-05 - 2024-04-08", price: 250, status: "Upcoming" },
  { id: "at789", type: "Attraction", name: "Eiffel Tower Summit", date: "2023-11-20", price: 50, status: "Completed" },
  { id: "ride001", type: "Ride", name: "Airport Transfer JFK", date: "2024-05-01", price: 65, status: "Completed" },
  { id: "courier001", type: "Courier", name: "Document Delivery", date: "2024-05-10", price: 15, status: "Delivered" },
];

const mockSavedDrivers = [
    { id: "drv001", name: "John B.", vehicle: "Toyota Prius", rating: 4.8, lastTrip: "2024-05-01"},
    { id: "drv002", name: "Maria S.", vehicle: "Honda CR-V", rating: 4.9, lastTrip: "2024-03-20"},
];

const mockWalletTransactions = [
    { id: 'txn1', date: '2024-05-10', description: 'Courier: Document Delivery', amount: -15.00 },
    { id: 'txn2', date: '2024-05-05', description: 'Wallet Top-up', amount: 100.00 },
    { id: 'txn3', date: '2024-05-01', description: 'Ride: Airport Transfer JFK', amount: -65.00 },
];

interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  expiry: string;
  isDefault?: boolean;
}

const initialPaymentMethods: PaymentMethod[] = [
    { id: 'pm1', type: 'Visa', last4: '4242', expiry: '12/26', isDefault: true },
    { id: 'pm2', type: 'MasterCard', last4: '5555', expiry: '08/25', isDefault: false },
];


const translations = {
  // Main titles
  myProfile: { 'en-US': 'My Profile & Account', 'es-ES': 'Mi Perfil y Cuenta', 'fr-FR': 'Mon Profil et Compte' },
  manageInfo: { 'en-US': 'Manage your personal information, preferences, bookings, security, and wallet.', 'es-ES': 'Gestiona tu información personal, preferencias, reservas, seguridad y monedero.', 'fr-FR': 'Gérez vos informations personnelles, préférences, réservations, sécurité et portefeuille.' },
  // Tabs
  profile: { 'en-US': 'Profile', 'es-ES': 'Perfil', 'fr-FR': 'Profil' },
  history: { 'en-US': 'History', 'es-ES': 'Historial', 'fr-FR': 'Historique' },
  preferences: { 'en-US': 'Preferences', 'es-ES': 'Preferencias', 'fr-FR': 'Préférences' },
  security: { 'en-US': 'Security', 'es-ES': 'Seguridad', 'fr-FR': 'Sécurité' },
  wallet: { 'en-US': 'Wallet', 'es-ES': 'Monedero', 'fr-FR': 'Portefeuille' },
  // Profile tab
  personalInfo: { 'en-US': 'Personal Information', 'es-ES': 'Información Personal', 'fr-FR': 'Informations Personnelles' },
  viewAndUpdate: { 'en-US': 'View and update your personal details.', 'es-ES': 'Ver y actualizar tus datos personales.', 'fr-FR': 'Voir et mettre à jour vos informations personnelles.' },
  fullName: { 'en-US': 'Full Name', 'es-ES': 'Nombre Completo', 'fr-FR': 'Nom Complet' },
  emailAddress: { 'en-US': 'Email Address', 'es-ES': 'Dirección de Email', 'fr-FR': 'Adresse E-mail' },
  joinedDate: { 'en-US': 'Joined RoamFree', 'es-ES': 'Miembro desde', 'fr-FR': 'Membre depuis' },
  driversLicense: { 'en-US': "Driver's License (for Car Rentals)", 'es-ES': 'Licencia de Conducir (para Alquiler de Coches)', 'fr-FR': "Permis de Conduire (pour Location de Voiture)" },
  uploadLicense: { 'en-US': "Upload License (Demo)", 'es-ES': 'Subir Licencia (Demo)', 'fr-FR': 'Télécharger le Permis (Démo)' },
  saveChanges: { 'en-US': 'Save Changes', 'es-ES': 'Guardar Cambios', 'fr-FR': 'Enregistrer les Modifications' },
  // Wallet tab
  myWallet: { 'en-US': 'My RoamFree Wallet', 'es-ES': 'Mi Monedero RoamFree', 'fr-FR': 'Mon Portefeuille RoamFree' },
  manageFunds: { 'en-US': 'Manage your funds for seamless payments across the platform. Buy Now, Pay Later options (e.g. Klarna, Afterpay) available for select services (Demo).', 'es-ES': 'Gestiona tus fondos para pagos fluidos en toda la plataforma. Opciones de Compra Ahora, Paga Después (ej. Klarna, Afterpay) disponibles para servicios seleccionados (Demo).', 'fr-FR': 'Gérez vos fonds pour des paiements fluides sur toute la plateforme. Options Achetez Maintenant, Payez Plus Tard (ex. Klarna, Afterpay) disponibles pour certains services (Démo).' },
  currentBalance: { 'en-US': 'Current Balance', 'es-ES': 'Saldo Actual', 'fr-FR': 'Solde Actuel' },
  topUpWallet: { 'en-US': 'Top Up Wallet', 'es-ES': 'Recargar Monedero', 'fr-FR': 'Recharger le Portefeuille' },
};


// Main Profile Page Component
function ProfilePage() {
  const { language, currency } = useLocale();

  const t = (key: keyof typeof translations) => {
    const langCode = language.code as keyof typeof translations[keyof typeof translations];
    return translations[key][langCode] || translations[key]['en-US'];
  };

  const walletBalanceInUSD = mockUser.walletBalance;
  const convertedBalance = walletBalanceInUSD * currency.rate;

  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <UserCircle className="h-10 w-10" />
            {t('myProfile')}
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            {t('manageInfo')}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 md:p-6">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mb-6 p-1 h-auto">
              <TabsTrigger value="profile" className="py-2"><UserCircle className="h-5 w-5 mr-2 md:hidden lg:inline-block" />{t('profile')}</TabsTrigger>
              <TabsTrigger value="history" className="py-2"><History className="h-5 w-5 mr-2 md:hidden lg:inline-block" />{t('history')}</TabsTrigger>
              <TabsTrigger value="preferences" className="py-2"><Settings className="h-5 w-5 mr-2 md:hidden lg:inline-block" />{t('preferences')}</TabsTrigger>
              <TabsTrigger value="security" className="py-2"><ShieldCheck className="h-5 w-5 mr-2 md:hidden lg:inline-block" />{t('security')}</TabsTrigger>
              <TabsTrigger value="wallet" className="py-2"><CreditCard className="h-5 w-5 mr-2 md:hidden lg:inline-block" />{t('wallet')}</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="p-4 md:p-0"><ProfileTab t={t} /></TabsContent>
            <TabsContent value="history" className="p-4 md:p-0"><HistoryTab /></TabsContent>
            <TabsContent value="preferences" className="p-4 md:p-0"><PreferencesTab /></TabsContent>
            <TabsContent value="security" className="p-4 md:p-0"><SecurityTab /></TabsContent>
            <TabsContent value="wallet" className="p-4 md:p-0"><WalletTab t={t} convertedBalance={convertedBalance} currency={currency} /></TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default withAuth(ProfilePage);


// Sub-components for each tab
const ProfileTab = ({ t }: { t: (key: keyof typeof translations) => string }) => {
  const { user } = useAuth();
  const handleSaveChanges = (section: string) => toast({ title: "Changes Saved (Demo)", description: `Your ${section} have been updated.`});
  const handleUploadLicense = () => toast({ title: "Upload Driver's License (Demo)", description: "Opening file upload for driver's license. This is for car rental verification."});

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('personalInfo')}</CardTitle>
        <CardDescription>{t('viewAndUpdate')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="name">{t('fullName')}</Label>
          <Input id="name" defaultValue={user?.displayName || ''} />
        </div>
        <div>
          <Label htmlFor="email">{t('emailAddress')}</Label>
          <Input id="email" type="email" defaultValue={user?.email || ''} readOnly />
            <p className="text-xs text-muted-foreground mt-1">Email cannot be changed here.</p>
        </div>
        <div>
          <Label htmlFor="joinDate">{t('joinedDate')}</Label>
          <Input id="joinDate" defaultValue={user?.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : ''} readOnly />
        </div>
          <div className="pt-2">
          <Label htmlFor="driverLicense">{t('driversLicense')}</Label>
          {mockUser.driverLicenseUploaded ? (
              <p className="text-sm text-green-600 flex items-center"><ShieldCheck className="h-4 w-4 mr-1"/>License on File (Demo)</p>
          ) : (
              <Button variant="outline" size="sm" onClick={handleUploadLicense} className="mt-1">
                  <FileUp className="mr-2 h-4 w-4"/> {t('uploadLicense')}
              </Button>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
          <Button onClick={() => handleSaveChanges("personal information")}>{t('saveChanges')}</Button>
      </CardFooter>
    </Card>
  );
};

const HistoryTab = () => (
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
);

const PreferencesTab = () => {
  const [travelStyle, setTravelStyle] = useState(mockUser.preferences.travelStyle);
  const [dietaryNeeds, setDietaryNeeds] = useState(mockUser.preferences.dietaryNeeds);
  const [interests, setInterests] = useState(mockUser.preferences.interests);
  const [pricingAlerts, setPricingAlerts] = useState(mockUser.preferences.pricingAlerts);
  const [pushNotifications, setPushNotifications] = useState(mockUser.preferences.receivePushNotifications);

  const handleSaveChanges = () => {
    // Here you would typically send the data to your backend API
    console.log("Saving preferences:", { travelStyle, dietaryNeeds, interests, pricingAlerts, pushNotifications });
    toast({ title: "Preferences Saved (Demo)", description: "Your preferences have been updated." });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Travel & Notification Preferences</CardTitle>
        <CardDescription>Help us tailor recommendations and alerts for you.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="travelStyle">Travel Style</Label>
          <Input id="travelStyle" value={travelStyle} onChange={(e) => setTravelStyle(e.target.value)} placeholder="e.g., Adventure, Luxury, Budget-friendly"/>
        </div>
        <div>
          <Label htmlFor="dietaryNeeds">Dietary Needs/Preferences</Label>
          <Input id="dietaryNeeds" value={dietaryNeeds} onChange={(e) => setDietaryNeeds(e.target.value)} placeholder="e.g., Vegetarian, Gluten-free"/>
        </div>
        <div>
          <Label htmlFor="interests">Interests &amp; Hobbies</Label>
          <Textarea id="interests" value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="e.g., Hiking, Museums, Nightlife, Shopping"/>
        </div>
        <div className="flex items-center space-x-2 pt-2">
          <Switch id="pricing-alerts" checked={pricingAlerts} onCheckedChange={setPricingAlerts} />
          <Label htmlFor="pricing-alerts">Enable AI Predictive Pricing Alerts (Demo)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="push-notifications" checked={pushNotifications} onCheckedChange={setPushNotifications} />
          <Label htmlFor="push-notifications">Receive Push Notifications (Trip reminders, price drops, etc. - Demo)</Label>
        </div>
        <div className="pt-2">
          <p className="text-sm text-muted-foreground">More preference options (e.g., preferred airline, hotel chains) coming soon!</p>
          <p className="text-sm text-muted-foreground">Group travel coordination features will appear under 'My Trips' (Coming Soon).</p>
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button onClick={handleSaveChanges}>Save Preferences</Button>
      </CardFooter>
    </Card>
  );
};


const passwordChangeSchema = z.object({
  currentPassword: z.string().min(6, 'Password must be at least 6 characters.'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters.'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "New passwords don't match.",
  path: ['confirmPassword'],
});
type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>;


const SecurityTab = () => {
  const [isIdVerified, setIsIdVerified] = useState(mockUser.isIdVerified);
  const [mfaEnabled, setMfaEnabled] = useState(mockUser.mfaEnabled);

  // State for Video Verification
  const [isVideoIdVerified, setIsVideoIdVerified] = useState(mockUser.isVideoIdVerified);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  const passwordForm = useForm<PasswordChangeFormValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });


  useEffect(() => {
    if (!isVideoDialogOpen) {
      // Stop video stream when dialog closes
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      return;
    }

    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings.',
        });
      }
    };

    getCameraPermission();
  }, [isVideoDialogOpen]);

  const handleVideoVerification = () => {
    setIsVerifying(true);
    // Simulate a verification process
    setTimeout(() => {
      setIsVerifying(false);
      setIsVideoIdVerified(true);
      setIsVideoDialogOpen(false);
      toast({ title: "Video Verified!", description: "Your identity has been successfully verified via video." });
    }, 2500); // Simulate 2.5 second verification
  };

  const handleMfaSetup = (checked: boolean) => {
    setMfaEnabled(checked);
    toast({ title: "MFA Setup (Demo)", description: `MFA has been ${checked ? 'enabled' : 'disabled'}.` });
  };

  const handleIdSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setIsIdVerified(true);
      toast({ title: "ID Verified!", description: "Your identity has been successfully verified." });
    }, 1000);
  };

  async function onPasswordChangeSubmit(values: PasswordChangeFormValues) {
    const result = await changePassword(values.currentPassword, values.newPassword);
    if ('error' in result) {
      toast({
        title: 'Password Change Failed',
        description: result.error,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Your password has been changed successfully.',
      });
      setIsPasswordDialogOpen(false);
      passwordForm.reset();
    }
  }


  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>Manage your account security options. AI Smart Fraud Detection is active (Demo).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-md">
            <div>
              <h4 className="font-medium">Standard ID Verification</h4>
              <p className={`text-sm ${isIdVerified ? "text-green-600" : "text-orange-600"}`}>Status: {isIdVerified ? "Verified" : "Not Verified"}</p>
              {!isIdVerified && <p className="text-xs text-muted-foreground">Verification is required for listing properties or making certain bookings.</p>}
            </div>
            {!isIdVerified ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Verify ID</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Verify Your Identity</DialogTitle>
                    <DialogDescription>
                      Please upload a photo of your government-issued ID. This is a simulation.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleIdSubmit}>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="id-number">ID Number</Label>
                        <Input id="id-number" placeholder="e.g., A1234567" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="id-photo">Upload ID Photo</Label>
                        <Input id="id-photo" type="file" required />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                      <DialogClose asChild><Button type="submit">Submit for Verification</Button></DialogClose>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            ) : (
              <ShieldCheck className="h-6 w-6 text-green-600" />
            )}
          </div>
          <div className="flex items-center justify-between p-4 border rounded-md">
            <div>
              <h4 className="font-medium">Video ID Verification</h4>
              <p className={`text-sm ${isVideoIdVerified ? "text-green-600" : "text-muted-foreground"}`}>Status: {isVideoIdVerified ? "Video Verified" : "Not Verified"}</p>
              <p className="text-xs text-muted-foreground">Enhance trust with video-based verification.</p>
            </div>
            {!isVideoIdVerified ? (
                <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline"><Video className="mr-2 h-4 w-4"/>Start Video Verification</Button>
                    </DialogTrigger>
                    <DialogContent>
                         <DialogHeader>
                            <DialogTitle>Live Video Verification</DialogTitle>
                            <DialogDescription>Please center your face in the frame.</DialogDescription>
                        </DialogHeader>
                        <div className="my-4 aspect-video bg-muted rounded-md flex items-center justify-center overflow-hidden">
                            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                            {hasCameraPermission === false && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Camera Access Required</AlertTitle>
                                    <AlertDescription>
                                        Please allow camera access to use this feature.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                        <DialogFooter>
                            <DialogClose asChild><Button variant="outline" disabled={isVerifying}>Cancel</Button></DialogClose>
                            <Button onClick={handleVideoVerification} disabled={!hasCameraPermission || isVerifying}>
                                {isVerifying ? "Verifying..." : "Start Verification"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
             ) : (
                <ShieldCheck className="h-6 w-6 text-green-600" />
             )}
          </div>
          <div className="flex items-center justify-between p-4 border rounded-md">
            <div>
              <h4 className="font-medium">Multi-Factor Authentication (MFA)</h4>
              <p className={`text-sm ${mfaEnabled ? "text-green-600" : "text-muted-foreground"}`}>Status: {mfaEnabled ? "Enabled" : "Disabled"}</p>
              {!mfaEnabled && <p className="text-xs text-muted-foreground">Enhance your account security by enabling MFA.</p>}
            </div>
            <Switch checked={mfaEnabled} onCheckedChange={handleMfaSetup} id="mfa-switch"/>
          </div>
          <div className="p-4 border rounded-md">
              <h4 className="font-medium">Password</h4>
              <p className="text-sm text-muted-foreground mb-2">It's a good practice to use a strong, unique password.</p>
               <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline">Change Password</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change Your Password</DialogTitle>
                        <DialogDescription>
                            Enter your current password and a new password below.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...passwordForm}>
                        <form onSubmit={passwordForm.handleSubmit(onPasswordChangeSubmit)} className="space-y-4 py-4">
                            <FormField control={passwordForm.control} name="currentPassword" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Current Password</FormLabel>
                                    <FormControl><Input type="password" icon={<Lock className="h-4 w-4" />} {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                             <FormField control={passwordForm.control} name="newPassword" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl><Input type="password" icon={<Lock className="h-4 w-4" />} {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={passwordForm.control} name="confirmPassword" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm New Password</FormLabel>
                                    <FormControl><Input type="password" icon={<Lock className="h-4 w-4" />} {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <DialogFooter>
                                <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                                <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
                                    {passwordForm.formState.isSubmitting ? "Changing..." : "Change Password"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
          </div>
          <p className="text-xs text-muted-foreground">Blockchain-based verification for property ownership proof is a future feature.</p>
        </CardContent>
      </Card>
    </>
  );
};

const WalletTab = ({ t, convertedBalance, currency }: { t: (key: string) => string; convertedBalance: number; currency: any }) => {
  const [topUpAmount, setTopUpAmount] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>(initialPaymentMethods.find(p => p.isDefault)?.id || initialPaymentMethods[0].id);
  
  // States for the "Add Card" dialog
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState("");
  const [newCardExpiry, setNewCardExpiry] = useState("");
  const [newCardCVC, setNewCardCVC] = useState("");


  const handleTopUpWallet = () => {
    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter a valid amount to top up.", variant: "destructive" });
      return;
    }
    const selectedMethod = paymentMethods.find(p => p.id === selectedPaymentId);
    toast({ title: "Top Up Successful (Demo)", description: `Successfully added ${currency.symbol}${amount.toFixed(2)} to your wallet using your ${selectedMethod?.type} card.` });
    setTopUpAmount(""); // Reset amount
  };

  const handleSetDefault = (methodId: string) => {
    setPaymentMethods(prev => prev.map(m => ({ ...m, isDefault: m.id === methodId })));
    toast({ title: "Default Card Updated", description: "Your default payment method has been changed." });
  };

  const handleRemoveCard = (methodId: string) => {
    setPaymentMethods(prev => {
        const newMethods = prev.filter(m => m.id !== methodId);
        // If the removed card was default, set the first one as new default if exists
        if (newMethods.length > 0 && prev.find(m => m.id === methodId)?.isDefault) {
            newMethods[0].isDefault = true;
        }
        return newMethods;
    });
    toast({ title: "Card Removed", description: "The payment method has been removed." });
  };
  
  const handleSaveCard = () => {
    if (newCardNumber.length < 16 || newCardExpiry.length < 4 || newCardCVC.length < 3) {
      toast({ title: "Invalid Card Details", description: "Please check your card information.", variant: "destructive" });
      return;
    }
    const newCard: PaymentMethod = {
      id: `pm${Date.now()}`,
      type: "Visa", // Simplified for demo
      last4: newCardNumber.slice(-4),
      expiry: newCardExpiry,
      isDefault: paymentMethods.length === 0, // Make first card added default
    };
    setPaymentMethods(prev => [...prev, newCard]);
    toast({ title: "Card Added!", description: `Visa ending in ${newCard.last4} has been added.`});
    
    // Reset form and close dialog
    setNewCardNumber("");
    setNewCardExpiry("");
    setNewCardCVC("");
    setIsAddCardOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('myWallet')}</CardTitle>
        <CardDescription>{t('manageFunds')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Balance Section */}
        <div className="p-4 border rounded-md bg-muted/50">
          <Label>{t('currentBalance')}</Label>
          <p className="text-3xl font-bold text-primary">{currency.symbol}{convertedBalance.toFixed(2)}</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
              <CreditCard className="mr-2 h-4 w-4"/> {t('topUpWallet')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Top Up Wallet</DialogTitle>
              <DialogDescription>Add funds to your RoamFree wallet.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="topup-amount">Amount ({currency.code})</Label>
                <Input
                  id="topup-amount"
                  type="number"
                  placeholder="e.g., 50.00"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <div className="space-y-2">
                  {paymentMethods.map(method => (
                    <div
                      key={method.id}
                      onClick={() => setSelectedPaymentId(method.id)}
                      className={`p-3 border rounded-md cursor-pointer flex items-center gap-3 transition-colors ${selectedPaymentId === method.id ? 'border-primary ring-2 ring-primary' : 'hover:bg-muted/50'}`}
                    >
                      <CreditCard className="h-6 w-6 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{method.type} ending in {method.last4} {method.isDefault && <span className="text-xs text-primary">(Default)</span>}</p>
                        <p className="text-xs text-muted-foreground">Expires {method.expiry}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
              <DialogClose asChild>
                <Button onClick={handleTopUpWallet}>Add Funds</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Saved Payment Methods Section */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Saved Payment Methods</h4>
          <div className="space-y-3">
            {paymentMethods.map(method => (
              <Card key={method.id} className="p-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-6 w-6 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{method.type} ending in {method.last4} {method.isDefault && <span className="text-xs text-primary">(Default)</span>}</p>
                      <p className="text-xs text-muted-foreground">Expires {method.expiry}</p>
                    </div>
                  </div>
                   <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                         {!method.isDefault && <DropdownMenuItem onClick={() => handleSetDefault(method.id)}>Set as default</DropdownMenuItem>}
                         <DropdownMenuItem onClick={() => handleRemoveCard(method.id)} className="text-destructive">Remove</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                </div>
              </Card>
            ))}
            <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add a new payment method
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Card</DialogTitle>
                        <DialogDescription>Your payment information is securely stored.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="newCardNumber">Card Number</Label>
                            <Input id="newCardNumber" value={newCardNumber} onChange={(e) => setNewCardNumber(e.target.value)} placeholder="0000 0000 0000 0000" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="newCardExpiry">Expiry Date (MM/YY)</Label>
                                <Input id="newCardExpiry" value={newCardExpiry} onChange={(e) => setNewCardExpiry(e.target.value)} placeholder="MM/YY" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="newCardCVC">CVC</Label>
                                <Input id="newCardCVC" value={newCardCVC} onChange={(e) => setNewCardCVC(e.target.value)} placeholder="123" />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                        <Button onClick={handleSaveCard}>Save Card</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

          </div>
        </div>

        {/* Transaction History Section */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Transaction History</h4>
          <div className="border rounded-md">
            {mockWalletTransactions.length > 0 ? (
              <ul className="divide-y">
                {mockWalletTransactions.map(tx => (
                  <li key={tx.id} className="p-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleDateString()}</p>
                    </div>
                    <p className={`font-semibold ${tx.amount > 0 ? 'text-green-500' : 'text-foreground'}`}>
                      {tx.amount > 0 ? '+' : ''}{currency.symbol}{(tx.amount * currency.rate).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p-4 text-sm text-muted-foreground text-center">No transactions yet.</p>
            )}
          </div>
           <Button variant="link" className="mt-2 px-0">View all transactions (Demo)</Button>
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
          <p className="text-xs text-muted-foreground">Wallet transactions are secure and encrypted.</p>
      </CardFooter>
    </Card>
  );
};
