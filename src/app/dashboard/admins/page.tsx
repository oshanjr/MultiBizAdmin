import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { AddAdminDialog } from "./add-admin-dialog";
import { ResetPasswordDialog } from "./reset-password-dialog";
import { DeleteAdminButton } from "./delete-admin-button";
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

export default async function AdminsPage() {
  const session = await auth();
  const admins = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Admin Users</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Manage admin accounts and credentials.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ResetPasswordDialog />
          <AddAdminDialog />
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="flex flex-col gap-3 sm:hidden">
        {admins.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
            No admin users found.
          </div>
        ) : (
          admins.map((admin: any) => (
            <div key={admin.id} className="rounded-lg border bg-card p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-medium flex items-center gap-2">
                    <span className="truncate">{admin.name || "—"}</span>
                    {admin.id === session?.user?.id && (
                      <Badge variant="outline" className="text-[10px] shrink-0">You</Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground truncate mt-0.5">{admin.email}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={admin.role === "OWNER" ? "default" : "secondary"}>
                    {admin.role === "OWNER" ? "Owner" : "Admin"}
                  </Badge>
                  {admin.id !== session?.user?.id && (
                    <DeleteAdminButton adminId={admin.id} adminEmail={admin.email} />
                  )}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Joined {format(admin.createdAt, "MMM d, yyyy")}
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
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="hidden lg:table-cell">Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No admin users found.
                </TableCell>
              </TableRow>
            ) : (
              admins.map((admin: any) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium">
                    <span>{admin.name || "—"}</span>
                    {admin.id === session?.user?.id && (
                      <Badge variant="outline" className="ml-2 text-[10px]">
                        You
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{admin.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={admin.role === "OWNER" ? "default" : "secondary"}
                    >
                      {admin.role === "OWNER" ? "Owner" : "System Admin"}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{format(admin.createdAt, "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-right">
                    {admin.id !== session?.user?.id && (
                      <DeleteAdminButton adminId={admin.id} adminEmail={admin.email} />
                    )}
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
