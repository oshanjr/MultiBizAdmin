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
import { createAdmin } from "@/app/actions/admin";
import { UserPlus } from "lucide-react";

export function AddAdminDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    const result = await createAdmin(formData);

    if (result.error) {
      toast.error(result.error);
    } else if (result.success) {
      toast.success("Admin user created successfully");
      setOpen(false);
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2" />}>
        <UserPlus className="h-4 w-4" />
        Add Admin
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Admin</DialogTitle>
          <DialogDescription>
            Create a new admin account with username, email, and password.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="admin-name">Username</Label>
              <Input
                id="admin-name"
                name="name"
                placeholder="e.g. john_doe"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                name="email"
                type="email"
                placeholder="e.g. john@company.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                name="password"
                type="password"
                placeholder="Minimum 6 characters"
                minLength={6}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="admin-role">Role</Label>
              <select
                id="admin-role"
                name="role"
                className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="SYSTEM_ADMIN">System Admin</option>
                <option value="OWNER">Owner</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Admin"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
