
// src/app/community-forum-demo/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Users2, Search, PlusCircle, Tag } from 'lucide-react'; // Added Tag
import Link from 'next/link';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

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
  { id: "t1", title: "Best hidden gems in Kyoto?", author: "TravelerGal", replies: 15, lastReply: "2 hours ago", category: "Local Attractions", tags: ["Kyoto", "Hidden Gems", "Culture"] },
  { id: "t2", title: "Tips for budget backpacking in South America?", author: "AdventureSeeker", replies: 22, lastReply: "5 hours ago", category: "Transportation Tips", tags: ["South America", "Budget", "Backpacking"] },
  { id: "t3", title: "Family friendly resorts in the Caribbean", author: "FamilyVacay", replies: 8, lastReply: "1 day ago", category: "Accommodation Help", tags: ["Caribbean", "Family", "Resorts"] },
  { id: "t4", title: "Sustainable travel practices - share your tips!", author: "EcoWarrior", replies: 30, lastReply: "3 days ago", category: "Local Culture", tags: ["Sustainable Travel", "Eco-friendly"] },
  { id: "t5", title: "Advice on buying property in Spain?", author: "ExpatDreams", replies: 12, lastReply: "4 hours ago", category: "Real Estate", tags: ["Spain", "Property", "Investment"] },
  { id: "t6", title: "Car rental experiences in Italy - good or bad?", author: "RoadTripper", replies: 18, lastReply: "6 hours ago", category: "Car Rentals", tags: ["Italy", "Car Rental", "Travel Scams"] },
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
              <Button className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" /> Create New Thread (Demo)
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
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl hover:text-primary">
                    <Link href={`/community-forum-demo/thread/${thread.id}`}>{thread.title}</Link>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Category: {thread.category} | By: {thread.author}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-muted-foreground">
                  <div className="flex items-center mb-2 sm:mb-0">
                    <MessageSquare className="inline h-4 w-4 mr-1"/>{thread.replies} Replies
                    <span className="mx-2 hidden sm:inline">|</span>
                    <span className="block sm:hidden my-1"></span>
                    Last reply: {thread.lastReply}
                  </div>
                  {thread.tags && thread.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2 sm:mt-0">
                      {thread.tags.map(tag => (
                        <span key={tag} className="text-xs bg-accent/20 text-accent-foreground/80 px-1.5 py-0.5 rounded-sm flex items-center">
                          <Tag className="h-3 w-3 mr-1"/>{tag}
                        </span>
                      ))}
                    </div>
                  )}
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
