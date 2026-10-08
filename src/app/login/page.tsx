import { LoginRedirectClient } from "@/components/auth/LoginRedirectClient";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Log in",
  description: "Log in or sign up for Genjutsu AI Video Generator.",
  path: "/login",
  keywords: ["Log in", "Genjutsu"],
});

export default function LoginPage() {
  return <LoginRedirectClient />;
}
