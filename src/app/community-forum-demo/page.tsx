// src/app/community-forum-demo/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Users2, Search, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react'; // Import useState

const mockThreads = [
  { id: "t1", title: "Best hidden gems in Kyoto?", author: "TravelerGal", replies: 15, lastReply: "2 hours ago", category: "Asia Travel" },
  { id: "t2", title: "Tips for budget backpacking in South America?", author: "AdventureSeeker", replies: 22, lastReply: "5 hours ago", category: "Budget Travel" },
  { id: "t3", title: "Family friendly resorts in the Caribbean", author: "FamilyVacay", replies: 8, lastReply: "1 day ago", category: "Family Travel" },
  { id: "t4", title: "Sustainable travel practices - share your tips!", author: "EcoWarrior", replies: 30, lastReply: "3 days ago", category: "Sustainable Travel" },
];

export default function CommunityForumDemoPage() {
  const [searchTerm, setSearchTerm] = useState(''); // Add state for search term

  // Filter threads based on searchTerm (simple example)
  const filteredThreads = mockThreads.filter(thread =>
    thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    thread.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    thread.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:max-w-md">
              <Input
                placeholder="Search forum..."
                className="pr-10"
                value={searchTerm} // Control the input value
                onChange={(e) => setSearchTerm(e.target.value)} // Handle changes
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            <Button className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Thread (Demo)
            </Button>
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
                <CardContent className="flex justify-between items-center text-sm text-muted-foreground">
                  <span><MessageSquare className="inline h-4 w-4 mr-1"/>{thread.replies} Replies</span>
                  <span>Last reply: {thread.lastReply}</span>
                </CardContent>
              </Card>
            )) : (
              <p className="text-muted-foreground text-center py-4">No threads match your search.</p>
            )}
          </div>
          {filteredThreads.length > 0 && (
            <div className="mt-8 text-center">
              <Button variant="outline">Load More Threads (Demo)</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
