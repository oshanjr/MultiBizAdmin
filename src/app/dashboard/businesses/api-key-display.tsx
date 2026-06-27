"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ApiKeyDisplay({ apiKey }: { apiKey: string }) {
  const [show, setShow] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-sm text-muted-foreground w-40 truncate">
        {show ? apiKey : `${apiKey.substring(0, 8)}...`}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0"
        onClick={() => setShow(!show)}
        title={show ? "Hide key" : "Show key"}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  );
}
