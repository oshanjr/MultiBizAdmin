import prisma from "@/lib/prisma";
import { AddBusinessDialog } from "./add-business-dialog";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function BusinessesPage() {
  const businesses = await prisma.businessModule.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Business Modules</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Manage your connected spoke systems and API keys.
          </p>
        </div>
        <AddBusinessDialog />
      </div>

      {/* Mobile Card View */}
      <div className="flex flex-col gap-3 sm:hidden">
        {businesses.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
            No business modules registered yet.
          </div>
        ) : (
          businesses.map((business: any) => (
            <div key={business.id} className="rounded-lg border bg-card p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-medium">{business.name}</div>
                  <Badge variant="outline" className="mt-1">{business.type}</Badge>
                </div>
                {business.isActive ? (
                  <Badge className="bg-green-500 hover:bg-green-600 shrink-0">Active</Badge>
                ) : (
                  <Badge variant="destructive" className="shrink-0">Inactive</Badge>
                )}
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{format(business.createdAt, "MMM d, yyyy")}</span>
                <span className="font-mono text-xs">{business.apiKey.substring(0, 8)}...</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Tablet/Desktop Table View */}
      <div className="rounded-md border bg-card hidden sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Created At</TableHead>
              <TableHead className="text-right">API Key Prefix</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {businesses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No business modules registered yet.
                </TableCell>
              </TableRow>
            ) : (
              businesses.map((business: any) => (
                <TableRow key={business.id}>
                  <TableCell className="font-medium">{business.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{business.type}</Badge>
                  </TableCell>
                  <TableCell>
                    {business.isActive ? (
                      <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
                    ) : (
                      <Badge variant="destructive">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{format(business.createdAt, "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-right font-mono text-sm text-muted-foreground">
                    {business.apiKey.substring(0, 8)}...
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
