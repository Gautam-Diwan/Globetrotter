"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Share2 } from 'lucide-react';
import { toPng } from 'html-to-image';

interface ChallengeFriendProps {
  username: string;
  score: number;
  onUsernameChange: (username: string) => void;
}

export function ChallengeFriend({ username, score, onUsernameChange }: ChallengeFriendProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newUsername, setNewUsername] = useState(username);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [shareImage, setShareImage] = useState<string | null>(null);
  
  const handleUsernameSubmit = async () => {
    if (!newUsername.trim()) return;
    
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: newUsername }),
      });
      
      if (response.ok) {
        onUsernameChange(newUsername);
        generateShareImage();
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };
  
  const generateShareImage = async () => {
    setIsGeneratingImage(true);
    
    try {
      const shareCard = document.getElementById('share-card');
      
      if (shareCard) {
        const dataUrl = await toPng(shareCard, { quality: 0.95 });
        setShareImage(dataUrl);
      }
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGeneratingImage(false);
    }
  };
  
  const getShareUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/challenge?username=${encodeURIComponent(username)}`;
  };
  
  const shareViaWhatsApp = () => {
    const shareUrl = getShareUrl();
    const message = `I challenge you to beat my score of ${score} in the Globetrotter Challenge! ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Share2 className="mr-2 h-4 w-4" />
          Challenge a Friend
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Challenge a Friend</DialogTitle>
          <DialogDescription>
            Share your score and challenge your friends to beat it!
          </DialogDescription>
        </DialogHeader>
        
        {!username ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username">Choose a username first</Label>
              <Input
                id="username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </div>
            <Button onClick={handleUsernameSubmit} className="w-full">
              Save Username
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-center py-4">
              <div
                id="share-card"
                className="bg-card border rounded-lg p-6 w-full max-w-sm"
              >
                <h3 className="text-xl font-bold text-center mb-4">Globetrotter Challenge</h3>
                <p className="text-center mb-6">
                  {username} is challenging you to beat their score!
                </p>
                <div className="bg-primary/10 rounded-lg p-4 text-center">
                  <p className="text-sm font-medium">Current Score</p>
                  <p className="text-3xl font-bold">{score}</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <p className="text-sm text-muted-foreground">
                Share this challenge with your friends:
              </p>
              <Input
                readOnly
                value={getShareUrl()}
                onClick={(e) => e.currentTarget.select()}
              />
            </div>
            
            <DialogFooter className="sm:justify-start">
              <Button
                type="button"
                variant="default"
                onClick={shareViaWhatsApp}
                className="w-full"
              >
                Share via WhatsApp
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}