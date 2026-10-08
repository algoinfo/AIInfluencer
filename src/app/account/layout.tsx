import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Account",
  description: "Manage your Genjutsu account and credits.",
  path: "/account",
  noindex: true,
});

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
