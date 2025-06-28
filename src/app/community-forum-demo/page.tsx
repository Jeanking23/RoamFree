// src/app/community-forum-demo/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Users2, Search, PlusCircle, Tag, ThumbsUp, CheckCircle, Bookmark } from 'lucide-react'; 
import Link from 'next/link';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const forumCategories = [
  "All",
  "Accommodation Help",
  "Transportation Tips",
  "Local Attractions",
  "Safety & Scams",
  "Real Estate",
  "Car Rentals",
  "Visa & Travel Docs",
  "Local Culture",
  "Meet Other Travelers"
];

const mockThreads = [
  { id: "t1", title: "Best hidden gems in Kyoto?", author: "TravelerGal", replies: 15, upvotes: 42, lastReply: "2 hours ago", category: "Local Attractions", tags: ["Kyoto", "Hidden Gems", "Culture"], isSolved: true },
  { id: "t2", title: "Tips for budget backpacking in South America?", author: "AdventureSeeker", replies: 22, upvotes: 58, lastReply: "5 hours ago", category: "Transportation Tips", tags: ["South America", "Budget", "Backpacking"], isSolved: false },
  { id: "t3", title: "Family friendly resorts in the Caribbean", author: "FamilyVacay", replies: 8, upvotes: 19, lastReply: "1 day ago", category: "Accommodation Help", tags: ["Caribbean", "Family", "Resorts"], isSolved: true },
  { id: "t4", title: "Sustainable travel practices - share your tips!", author: "EcoWarrior", replies: 30, upvotes: 75, lastReply: "3 days ago", category: "Local Culture", tags: ["Sustainable Travel", "Eco-friendly"], isSolved: false },
  { id: "t5", title: "Advice on buying property in Spain?", author: "ExpatDreams", replies: 12, upvotes: 25, lastReply: "4 hours ago", category: "Real Estate", tags: ["Spain", "Property", "Investment"], isSolved: false },
  { id: "t6", title: "Car rental experiences in Italy - good or bad?", author: "RoadTripper", replies: 18, upvotes: 33, lastReply: "6 hours ago", category: "Car Rentals", tags: ["Italy", "Car Rental", "Travel Scams"], isSolved: true },
];

export default function CommunityForumDemoPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["All"]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => {
      if (category === "All") return ["All"];
      const newCategories = prev.includes("All") ? [] : [...prev];
      if (newCategories.includes(category)) {
        const filtered = newCategories.filter(c => c !== category);
        return filtered.length === 0 ? ["All"] : filtered; // if empty, default to "All"
      } else {
        return [...newCategories, category];
      }
    });
  };

  const filteredThreads = mockThreads.filter(thread => {
    const matchesSearch =
      thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (thread.tags && thread.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesCategory = selectedCategories.includes("All") || selectedCategories.includes(thread.category);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <Users2 className="h-10 w-10" />
            RoamFree Community Forum (Demo)
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Connect with fellow travelers, share tips, ask questions, and inspire your next journey!
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6 p-4 border rounded-lg bg-muted/30">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-4">
              <div className="relative w-full sm:max-w-md">
                <Input
                  placeholder="Search by keyword, tag, or author..."
                  className="pr-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
              <Button className="w-full sm:w-auto" onClick={() => toast({title: "New Thread (Demo)", description: "Rich text editor for creating a new post would open."})}>
                <PlusCircle className="mr-2 h-4 w-4" /> Create New Thread
              </Button>
            </div>
            <div>
              <Label className="block mb-2 font-medium">Filter by Category</Label>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {forumCategories.map(category => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.replace(/\s+/g, '-')}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => handleCategoryChange(category)}
                    />
                    <Label htmlFor={`category-${category.replace(/\s+/g, '-')}`} className="font-normal text-sm cursor-pointer">{category}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {filteredThreads.length > 0 ? filteredThreads.map(thread => (
              <Card key={thread.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-start gap-4">
                    <div className="flex flex-col items-center gap-1 text-center w-16">
                         <Button variant="ghost" size="sm" className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4" />
                            <span className="font-bold">{thread.upvotes}</span>
                        </Button>
                        <Badge variant={thread.isSolved ? "default" : "outline"} className={thread.isSolved ? 'bg-green-600 border-green-700' : ''}>
                            <CheckCircle className={`h-3 w-3 mr-1 ${thread.isSolved ? '' : 'text-muted-foreground'}`}/> {thread.isSolved ? 'Solved' : 'Open'}
                        </Badge>
                    </div>
                     <div className="flex-grow">
                        <CardTitle className="text-xl hover:text-primary">
                            <Link href={`/community-forum-demo/thread/${thread.id}`}>{thread.title}</Link>
                        </CardTitle>
                        <CardDescription className="text-xs mt-1">
                            Category: {thread.category} | By: <span className="text-primary">{thread.author}</span>
                        </CardDescription>
                         {thread.tags && thread.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                            {thread.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                <Tag className="h-3 w-3 mr-1"/>{tag}
                                </Badge>
                            ))}
                            </div>
                        )}
                    </div>
                    <div className="text-right text-sm text-muted-foreground flex-shrink-0 w-32">
                        <div className="flex items-center justify-end gap-1">
                            <MessageSquare className="inline h-4 w-4"/>{thread.replies} Replies
                        </div>
                        <p className="text-xs mt-1">Last reply: {thread.lastReply}</p>
                         <Button variant="ghost" size="icon" className="h-7 w-7 mt-1" onClick={() => toast({title: "Bookmark (Demo)", description: "Thread bookmarked!"})}>
                            <Bookmark className="h-4 w-4"/>
                        </Button>
                    </div>
                </CardContent>
              </Card>
            )) : (
              <p className="text-muted-foreground text-center py-4">No threads match your search or filters.</p>
            )}
          </div>
          {filteredThreads.length > 0 && ( // Only show if there are some results initially
            <div className="mt-8 text-center">
              <Button variant="outline">Load More Threads (Demo)</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
