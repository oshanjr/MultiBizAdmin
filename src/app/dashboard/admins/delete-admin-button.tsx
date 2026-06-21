"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteAdmin } from "@/app/actions/admin";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export function DeleteAdminButton({ adminId, adminEmail }: { adminId: string; adminEmail: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete the admin "${adminEmail}"? This action cannot be undone.`)) {
      return;
    }

    setIsLoading(true);
    const result = await deleteAdmin(adminId);

    if (result.error) {
      toast.error(result.error);
    } else if (result.success) {
      toast.success("Admin deleted successfully");
    }
    setIsLoading(false);
  };

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={handleDelete}
      disabled={isLoading}
      className="text-muted-foreground hover:text-destructive"
    >
      <Trash2 className="h-4 w-4" />
      <span className="sr-only">Delete admin</span>
    </Button>
  );
}
