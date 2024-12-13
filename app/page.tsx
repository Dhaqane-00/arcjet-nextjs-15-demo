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
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto py-16 px-4 sm:py-24 sm:px-6">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Arcjet Security Demo
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-500">
            Explore different security features provided by Arcjet
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
          {demos.map((demo) => (
            <DemoCard key={demo.title} {...demo} />
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-sm text-gray-400">
            Demo from{" "}
            <a
              href="https://www.youtube.com/sonnysangha"
              className="text-blue-500 hover:text-blue-600"
            >
              Sonny Sangha
            </a>{" "}
            with ❤️ from the{" "}
            <a
              href="https://www.papareact.com/course"
              className="text-blue-500 hover:text-blue-600"
            >
              PAPAFAM (Join Zero To Full Stack Hero 2.0 & Learn to Code Today)
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
