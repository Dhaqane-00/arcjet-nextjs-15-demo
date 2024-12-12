interface DemoCardProps {
  title: string;
  description: string;
  href: string;
  icon?: React.ReactNode;
}

export function DemoCard({ title, description, href, icon }: DemoCardProps) {
  return (
    <a
      href={href}
      className="p-6 border rounded-lg hover:border-blue-500 transition-colors group"
    >
      <div className="flex items-center gap-4 mb-2">
        {icon && (
          <div className="text-gray-600 group-hover:text-blue-500">{icon}</div>
        )}
        <h2 className="text-xl font-semibold group-hover:text-blue-500">
          {title}
        </h2>
      </div>
      <p className="text-gray-600">{description}</p>
    </a>
  );
}
