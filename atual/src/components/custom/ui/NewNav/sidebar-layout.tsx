"use client"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/custom/ui/NewNav/app-sidebar"
import { MobileNavbar } from "@/components/custom/ui/NewNav/mobile-navbar"

interface SidebarLayoutProps {
  children: React.ReactNode
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        <MobileNavbar>
          {children}
        </MobileNavbar>
      </SidebarInset>
    </SidebarProvider>
  )
}
