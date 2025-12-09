/* eslint-disable */
"use client"

import * as React from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { ModeToggle } from "@/components/ui/theme-toggle"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state, setOpen, isMobile } = useSidebar()
  const [mounted, setMounted] = React.useState(false)
  const sidebarRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Fecha ao clicar fora
  React.useEffect(() => {
    if (state !== "expanded") return

    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [state, setOpen])

  const handleLogoHover = () => {
    if (state === "collapsed") {
      setOpen(true)
    }
  }

  const handleClose = () => {
    if (state === "expanded") {
      setOpen(false)
    }
  }

  if (!mounted) return null

  const isExpanded = state === "expanded"

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      {...props}
    >
      <div ref={sidebarRef} className="flex flex-col h-full">
        <SidebarHeader className="pt-6 px-2">
          <SidebarMenu>
            <SidebarMenuItem>
              {isMobile ? (
                // Mobile: Logo e título sempre visíveis
                <Link
                  href="/"
                  className="flex items-center gap-3 p-2 hover:opacity-80 transition-opacity duration-300"
                >
                  <Image
                    src="/logo.svg"
                    alt="Logo PratiqLab"
                    width={32}
                    height={32}
                    priority
                    className="w-8 h-8 dark:brightness-0 dark:invert"
                  />
                  <span className="font-logo text-2xl text-primary dark:text-foreground">
                    Prat<span className="text-accent">iq</span>Lab
                  </span>
                </Link>
              ) : (
                // Desktop: comportamento colapsável
                <div className="flex items-center gap-2 h-12">
                  {/* Container do ícone - sempre na mesma posição */}
                  <div
                    className="relative w-8 h-8 flex items-center justify-center shrink-0 cursor-pointer hover:bg-secondary/20 rounded-lg transition-colors duration-300"
                    onMouseEnter={handleLogoHover}
                    onClick={isExpanded ? handleClose : undefined}
                  >
                    {/* Logo - aparece quando collapsed */}
                    <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${
                      !isExpanded
                        ? 'opacity-100 rotate-0 scale-100'
                        : 'opacity-0 rotate-180 scale-75'
                    }`}>
                      <Image
                        src="/logo.svg"
                        alt="Logo PratiqLab"
                        width={32}
                        height={32}
                        priority
                        className="w-8 h-8 dark:brightness-0 dark:invert"
                      />
                    </div>

                    {/* Ícone X - aparece quando expanded */}
                    <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${
                      isExpanded
                        ? 'opacity-100 rotate-0 scale-100'
                        : 'opacity-0 rotate-180 scale-75'
                    }`}>
                      <X className="w-6 h-6 text-foreground transition-all duration-700 group-hover:scale-110" />
                    </div>
                  </div>

                  {/* Título - aparece ao lado do ícone */}
                  <Link
                    href="/"
                    className={`transition-all duration-700 ease-in-out ${
                      isExpanded
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-0 -translate-x-4 w-0 overflow-hidden'
                    }`}
                  >
                    <span className="font-logo text-2xl text-primary dark:text-foreground whitespace-nowrap">
                      Prat<span className="text-accent">iq</span>Lab
                    </span>
                  </Link>
                </div>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          {/* Conteúdo vazio - adicione seus links aqui se necessário */}
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            {/* ModeToggle - centralizado quando collapsed (apenas desktop) */}
            {!isMobile && (
              <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center">
                <ModeToggle />
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarFooter>
      </div>
    </Sidebar>
  )
}
