import { Dumbbell, ChartNoAxesCombined, Home } from "lucide-react";


export default function BottomNav({ currPage }) {
  const navItems = [
    { name: "Home", icon: Home, href: "/" },
    { name: "Exercises", icon: Dumbbell, href: "/exercise" },
    { name: "Graphs", icon: ChartNoAxesCombined, href: "/" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t shadow-md">
      <ul className="flex justify-around items-center p-2">
        {navItems.map((item) => {
          const isActive = item.name === currPage;
          const Icon = item.icon;

          return (
            <li key={item.name}>
              <a
                href={item.href}
                className={`flex flex-col items-center transition ${
                  isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                }`}
              >
                <Icon size={24} />
                <span className="text-xs">{item.name}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
