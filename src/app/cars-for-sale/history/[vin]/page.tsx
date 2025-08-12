// src/app/cars-for-sale/history/[vin]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ArrowLeft, CheckCircle, AlertTriangle, Wrench, Users, ShieldCheck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { mockCarsForSale } from '@/lib/mock-data';
import Image from 'next/image';

// Mock data for a more detailed history report
const mockHistoryDetails = {
  "DEMOVIN12345": {
    accidents: 0,
    owners: 2,
    serviceRecords: [
      { date: "2023-10-15", mileage: "40,120", service: "Oil change, tire rotation" },
      { date: "2023-04-01", mileage: "35,050", service: "Brake pad replacement" },
      { date: "2022-09-20", mileage: "29,880", service: "Scheduled maintenance" },
    ],
    titleStatus: "Clean",
  },
  "DEMOVIN67890": {
    accidents: 0,
    owners: 1,
    serviceRecords: [
       { date: "2023-12-01", mileage: "25,500", service: "Oil change, filter replacement" },
       { date: "2022-11-28", mileage: "15,100", service: "Scheduled 15k mile service" },
    ],
    titleStatus: "Clean",
  },
  "DEMOVIN11223": {
    accidents: 1,
    owners: 1,
    serviceRecords: [
      { date: "2024-01-05", mileage: "35,200", service: "Oil change" },
      { date: "2023-07-10", mileage: "31,500", service: "Minor front bumper repair" },
    ],
    titleStatus: "Clean",
  }
};

export default function CarHistoryPage() {
    const params = useParams();
    const router = useRouter();
    const vin = params.vin as string;

    const car = mockCarsForSale.find(c => c.vin === vin);
    const history = mockHistoryDetails[vin as keyof typeof mockHistoryDetails];

    if (!car) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-semibold mb-4">Vehicle Not Found</h1>
                <p className="text-muted-foreground mb-4">No vehicle history could be found for the provided VIN.</p>
                <Button onClick={() => router.push('/cars-for-sale')}>Back to Listings</Button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <Card className="shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto">
                <CardHeader className="bg-primary/10">
                    <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
                        <FileText className="h-8 w-8" />
                        Vehicle History Report
                    </CardTitle>
                    <CardDescription className="text-lg text-muted-foreground">
                        VIN: {car.vin}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6 items-center">
                        <div>
                            <h3 className="text-2xl font-semibold">{car.name}</h3>
                            <p className="text-muted-foreground">{car.year} &bull; {car.mileage}</p>
                        </div>
                        <div className="relative h-40 w-full rounded-md overflow-hidden">
                             <Image src={car.image} alt={car.name} fill className="object-cover" data-ai-hint={car.dataAiHint}/>
                        </div>
                    </div>
                    <Separator/>
                    <div>
                        <h4 className="text-xl font-semibold mb-4">Report Summary</h4>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card className={history?.accidents === 0 ? "bg-green-50" : "bg-orange-50"}>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">{history?.accidents === 0 ? "No Accidents Reported" : "Accident(s) Reported"}</CardTitle>
                                    {history?.accidents === 0 ? <CheckCircle className="h-4 w-4 text-green-600"/> : <AlertTriangle className="h-4 w-4 text-orange-600"/>}
                                </CardHeader>
                                <CardContent><div className="text-2xl font-bold">{history?.accidents ?? 'N/A'}</div></CardContent>
                            </Card>
                             <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Previous Owners</CardTitle><Users className="h-4 w-4 text-muted-foreground"/></CardHeader>
                                <CardContent><div className="text-2xl font-bold">{history?.owners ?? 'N/A'}</div></CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Service Records</CardTitle><Wrench className="h-4 w-4 text-muted-foreground"/></CardHeader>
                                <CardContent><div className="text-2xl font-bold">{history?.serviceRecords.length ?? 'N/A'}</div></CardContent>
                            </Card>
                             <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Title Status</CardTitle><ShieldCheck className="h-4 w-4 text-muted-foreground"/></CardHeader>
                                <CardContent><div className="text-2xl font-bold">{history?.titleStatus ?? 'N/A'}</div></CardContent>
                            </Card>
                        </div>
                    </div>

                    {history?.serviceRecords && history.serviceRecords.length > 0 && (
                        <div>
                            <h4 className="text-xl font-semibold mb-4">Service History Timeline</h4>
                            <div className="relative border-l-2 border-primary/20 pl-6 space-y-6">
                                {history.serviceRecords.map((record, index) => (
                                    <div key={index} className="relative">
                                        <div className="absolute -left-[34px] top-1 h-4 w-4 rounded-full bg-primary border-4 border-background"></div>
                                        <p className="font-semibold">{record.service}</p>
                                        <p className="text-sm text-muted-foreground">{record.date} at {record.mileage}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </CardContent>
                <CardFooter className="bg-muted/50 p-4">
                    <Button variant="outline" asChild>
                        <Link href="/cars-for-sale">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Listings
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
