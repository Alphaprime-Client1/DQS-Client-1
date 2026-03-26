import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginCard } from "./LoginCard";

export const metadata = {
  title: "Sign In — DQCR",
  description: "Sign in to your DQCR account to manage your dynamic QR codes and view real-time scan analytics.",
  alternates: {
    canonical: "/login",
  },
};

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] gradient-primary opacity-10 blur-[120px] rounded-full -z-0" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-600 opacity-5 blur-[100px] rounded-full -z-0" />

      <LoginCard />
    </div>
  );
}
