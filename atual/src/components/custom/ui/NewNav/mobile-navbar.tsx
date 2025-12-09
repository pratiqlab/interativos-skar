"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ModeToggle } from "@/components/ui/theme-toggle"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface MobileNavbarProps {
  children?: React.ReactNode
}

export function MobileNavbar({ children }: MobileNavbarProps) {
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b md:hidden">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Logo à esquerda */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="PratiqLab"
              width={32}
              height={32}
              className="h-8 w-8 dark:brightness-0 dark:invert"
            />
          </Link>

          {/* Theme toggle e sidebar à direita */}
          <div className="flex items-center gap-2">
            <ModeToggle />
            <SidebarTrigger />
          </div>
        </div>
      </nav>

      <div className="pt-16 md:pt-0">
        {children}
      </div>
    </>
  )
}
