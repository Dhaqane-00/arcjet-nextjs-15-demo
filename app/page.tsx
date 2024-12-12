import { Shield, Bot, Gauge, Lock, UserPlus } from "lucide-react";
import { DemoCard } from "./components/DemoCard";

export default function Home() {
  const demos = [
    {
      title: "Shield WAF Protection",
      description:
        "Protect against SQL injection, XSS, and other common web attacks",
      href: "/demos/shield",
      icon: <Shield className="w-6 h-6" />,
    },
    {
      title: "Bot Detection",
      description:
        "Identify and block unwanted bot traffic while allowing legitimate bots",
      href: "/demos/bot-detection",
      icon: <Bot className="w-6 h-6" />,
    },
    {
      title: "Rate Limiting",
      description:
        "Implement flexible rate limiting with token bucket algorithm",
      href: "/demos/rate-limit",
      icon: <Gauge className="w-6 h-6" />,
    },
    {
      title: "Sensitive Info Protection",
      description:
        "Detect and prevent exposure of sensitive information like PII",
      href: "/demos/sensitive-info",
      icon: <Lock className="w-6 h-6" />,
    },
    {
      title: "Signup Protection",
      description:
        "Protect signup forms from abuse, bots, and disposable emails",
      href: "/demos/signup-protection",
      icon: <UserPlus className="w-6 h-6" />,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Arcjet Security Demo</h1>
        <p className="text-xl text-gray-600">
          Explore different security features provided by Arcjet
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {demos.map((demo) => (
          <DemoCard key={demo.title} {...demo} />
        ))}
      </div>
    </div>
  );
}
