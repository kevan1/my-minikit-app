// MenuBar.tsx

"use client"

import * as React from "react"
import { Home, Settings, Bell, User } from "lucide-react"

interface MenuItem {
  icon: React.ReactNode
  label: string
  href: string
}

const menuItems: MenuItem[] = [
  {
    icon: <Home className="h-4 w-4 sm:h-5 sm:w-5" />,
    label: "Home",
    href: "/",
  },
  {
    icon: <Bell className="h-4 w-4 sm:h-5 sm:w-5" />,
    label: "Notifications",
    href: "#",
  },
  {
    icon: <Settings className="h-4 w-4 sm:h-5 sm:w-5" />,
    label: "Settings",
    href: "#",
  },
  {
    icon: <User className="h-4 w-4 sm:h-5 sm:w-5" />,
    label: "Profile",
    href: "#",
  },
]

export function MenuBar() {
  const [selected, setSelected] = React.useState(menuItems[0].label)

  return (
    <nav className="p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-background border border-border/40 shadow-lg max-w-full overflow-hidden">
      <ul className="flex items-center gap-1 sm:gap-2">
        {menuItems.map((item) => (
          <li key={item.label} className="flex-1">
            <a
              href={item.href}
              className={`flex items-center justify-center sm:justify-start gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2 rounded-lg sm:rounded-xl transition-colors text-xs sm:text-sm ${
                selected === item.label
                  ? "bg-muted text-foreground font-semibold"
                  : "text-muted-foreground hover:bg-accent"
              }`}
              onClick={() => setSelected(item.label)}
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="hidden sm:inline truncate">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
