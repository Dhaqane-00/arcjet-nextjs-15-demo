import Link from "next/link";
import { Shield, Bot, Gauge, Lock, UserPlus, Home } from "lucide-react";

const demos = [
  {
    title: "Shield WAF",
    href: "/demos/shield",
    icon: Shield,
  },
  {
    title: "Bot Detection",
    href: "/demos/bot-detection",
    icon: Bot,
  },
  {
    title: "Rate Limiting",
    href: "/demos/rate-limit",
    icon: Gauge,
  },
  {
    title: "Sensitive Info",
    href: "/demos/sensitive-info",
    icon: Lock,
  },
  {
    title: "Signup Protection",
    href: "/demos/signup-protection",
    icon: UserPlus,
  },
];

export default function DemosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-900 hover:text-blue-500"
            >
              <Home className="w-5 h-5" />
              <span className="font-semibold">Home</span>
            </Link>
            <div className="flex space-x-4">
              {demos.map((demo) => {
                const Icon = demo.icon;
                return (
                  <Link
                    key={demo.href}
                    href={demo.href}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-500"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{demo.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
