import type { RecommendPoiOutput } from "@/ai/flows/poi-recommendation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Landmark } from "lucide-react";

interface POIRecommendationResultsProps {
  results?: RecommendPoiOutput;
  isLoading: boolean;
  error?: string;
}

export default function POIRecommendationResults({ results, isLoading, error }: POIRecommendationResultsProps) {
  if (isLoading) {
    return (
      <Card className="mt-6 animate-pulse">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline text-primary">
            <Landmark className="h-6 w-6" />
            Fetching Recommendations...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mt-6 border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline text-destructive">
            <Landmark className="h-6 w-6" />
            Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!results || !results.poiRecommendations) {
    return null; 
  }

  return (
    <Card className="mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-primary">
          <Landmark className="h-6 w-6" />
          Points of Interest Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-foreground whitespace-pre-line">{results.poiRecommendations}</p>
      </CardContent>
    </Card>
  );
}
