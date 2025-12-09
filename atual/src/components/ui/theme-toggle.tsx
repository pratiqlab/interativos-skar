"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useThemeAnimation, ThemeAnimationType } from "@space-man/react-theme-animation"

import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const [mounted, setMounted] = React.useState(false)
  const { theme, resolvedTheme, setTheme } = useTheme()
  const { ref, switchTheme } = useThemeAnimation({
    animationType: ThemeAnimationType.CIRCLE,
    duration: 500,
  })

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = async () => {
    let newTheme: "light" | "dark" | "system"

    // Se está em system, troca para o oposto do resolvido
    if (theme === "system") {
      newTheme = resolvedTheme === "light" ? "dark" : "light"
    }
    // Se está em light ou dark, volta para system
    else {
      newTheme = "system"
    }

    await switchTheme(newTheme)
    setTheme(newTheme)
  }

  // Mostra o ícone baseado no tema resolvido (system mostra o ícone atual do sistema)
  const showSun = mounted ? resolvedTheme === "light" : false

  return (
    <Button
      ref={ref}
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
    >
      <Sun className={`h-[1.2rem] w-[1.2rem] transition-all ${showSun ? "scale-100 rotate-0" : "scale-0 -rotate-90"}`} />
      <Moon className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${!showSun ? "scale-100 rotate-0" : "scale-0 rotate-90"}`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
