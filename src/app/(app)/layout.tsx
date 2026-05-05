import { AppShell } from "@/components/app-shell";

export default function TableHubAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppShell>{children}</AppShell>;
}
