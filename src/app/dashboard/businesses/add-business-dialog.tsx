"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createBusiness } from "@/app/actions/business";
import { Copy, PlusCircle } from "lucide-react";

export function AddBusinessDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newApiKey, setNewApiKey] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const result = await createBusiness(formData);
    
    if (result.error) {
      toast.error(result.error);
    } else if (result.success && result.apiKey) {
      setNewApiKey(result.apiKey);
      toast.success("Business module created successfully");
    }
    setIsLoading(false);
  };

  const handleCopy = () => {
    if (newApiKey) {
      navigator.clipboard.writeText(newApiKey);
      toast.success("API Key copied to clipboard");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setNewApiKey(null), 300); // Reset after animation
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2" />}>
        <PlusCircle className="h-4 w-4" />
        Add Business
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Business Module</DialogTitle>
          <DialogDescription>
            Register a new spoke system to start receiving financial data.
          </DialogDescription>
        </DialogHeader>

        {newApiKey ? (
          <div className="flex flex-col gap-4 py-4">
            <div className="rounded-md bg-green-50 p-4 border border-green-200">
              <h3 className="text-sm font-medium text-green-800">Registration Successful</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Please copy this API key. You won't be able to see it again!</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Input readOnly value={newApiKey} className="font-mono text-sm" />
              <Button size="icon" variant="outline" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={handleClose} className="mt-2 w-full">
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Business Name</Label>
                <Input id="name" name="name" placeholder="e.g. Gampaha Fish Store" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Business Type</Label>
                <select 
                  id="type" 
                  name="type" 
                  className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="RETAIL">Retail</option>
                  <option value="TRANSPORT">Transport</option>
                  <option value="SERVICES">Services</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Module"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
