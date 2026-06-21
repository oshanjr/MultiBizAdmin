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
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Business Modules</h1>
          <p className="text-muted-foreground">
            Manage your connected spoke systems and API keys.
          </p>
        </div>
        <AddBusinessDialog />
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
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
              businesses.map((business) => (
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
                  <TableCell>{format(business.createdAt, "MMM d, yyyy")}</TableCell>
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
