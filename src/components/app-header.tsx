"use client";

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { LogOut, Menu, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AppSidebar } from "./app-sidebar";

export function AppHeader() {
  const { data: session } = useSession();

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6 lg:h-[60px]">
      <Sheet>
      <SheetTrigger
          render={<Button variant="outline" size="icon" className="shrink-0 md:hidden" />}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0">
          <AppSidebar />
        </SheetContent>
      </Sheet>
      
      <div className="flex flex-1 items-center justify-end gap-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <User className="h-4 w-4" />
          {session?.user?.email}
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
            {session?.user?.role}
          </span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => signOut()}>
          <LogOut className="h-5 w-5" />
          <span className="sr-only">Logout</span>
        </Button>
      </div>
    </header>
  );
}
