
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, ChevronLeft, Copy, CheckCircle2, RotateCcw } from 'lucide-react';
import { aiContentDrafting } from '@/ai/flows/ai-content-drafting-flow';

export default function AiDrafter() {
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState('');
  const [copied, setCopied] = useState(false);
  
  const [formData, setFormData] = useState({
    contentType: 'event' as 'event' | 'partner',
    title: '',
    details: '',
    keywords: '',
    length: 'medium' as 'short' | 'medium' | 'long'
  });

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await aiContentDrafting(formData);
      setDraft(result.draft);
    } catch (error) {
      console.error(error);
      alert('Failed to generate draft.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black p-10">
      <div className="max-w-6xl mx-auto">
        <Link href="/admin" className="inline-flex items-center text-muted-foreground hover:text-white mb-10 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Controls */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-headline font-bold mb-3 flex items-center">
                <Sparkles className="w-8 h-8 mr-3 text-secondary" /> AI Content <span className="solana-text-gradient ml-2">Drafter</span>
              </h1>
              <p className="text-muted-foreground">Generate compelling descriptions for events or partners in seconds.</p>
            </div>

            <Card className="glass border-white/10">
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Content Type</label>
                  <Select 
                    value={formData.contentType} 
                    onValueChange={(val) => setFormData({...formData, contentType: val as any})}
                  >
                    <SelectTrigger className="glass border-white/10">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/10">
                      <SelectItem value="event">Event Description</SelectItem>
                      <SelectItem value="partner">Partner Blurb</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Title / Name</label>
                  <Input 
                    placeholder="e.g. KL Hacker House" 
                    className="glass border-white/10"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Key Details</label>
                  <Textarea 
                    placeholder="Describe the context, target audience, or primary goal..." 
                    className="glass border-white/10 min-h-[120px]"
                    value={formData.details}
                    onChange={(e) => setFormData({...formData, details: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Keywords</label>
                    <Input 
                      placeholder="solana, rust, web3" 
                      className="glass border-white/10"
                      value={formData.keywords}
                      onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Length</label>
                    <Select 
                      value={formData.length} 
                      onValueChange={(val) => setFormData({...formData, length: val as any})}
                    >
                      <SelectTrigger className="glass border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass border-white/10">
                        <SelectItem value="short">Short</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="long">Long</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  className="w-full solana-gradient h-12 font-bold glow-purple" 
                  onClick={handleGenerate}
                  disabled={loading || !formData.title}
                >
                  {loading ? 'Generating...' : 'Generate Content Draft'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Result */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-headline font-bold text-xl uppercase tracking-widest text-muted-foreground">Generated Result</h3>
              {draft && (
                <div className="flex space-x-2">
                  <Button size="sm" variant="ghost" onClick={copyToClipboard} className="text-muted-foreground hover:text-white">
                    {copied ? <CheckCircle2 className="w-4 h-4 mr-2 text-secondary" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setDraft('')} className="text-muted-foreground hover:text-white">
                    <RotateCcw className="w-4 h-4 mr-2" /> Clear
                  </Button>
                </div>
              )}
            </div>

            <Card className="flex-1 glass border-white/10 relative overflow-hidden flex flex-col">
              {!draft && !loading && (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 p-12 text-center flex-col">
                  <Sparkles className="w-12 h-12 mb-4 opacity-10" />
                  <p>Your generated content will appear here.</p>
                </div>
              )}
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="solana-text-gradient font-bold">Dreaming up ideas...</p>
                  </div>
                </div>
              )}
              <CardContent className={`p-8 whitespace-pre-wrap font-body leading-relaxed text-lg transition-opacity duration-500 ${loading ? 'opacity-30' : 'opacity-100'}`}>
                {draft}
              </CardContent>
              {draft && (
                <div className="p-6 bg-white/5 border-t border-white/5 flex justify-end">
                   <p className="text-xs text-muted-foreground italic">AI-generated content. Please review and edit before publishing.</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
