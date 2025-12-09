'use client'

import { type ReactNode } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { type LucideIcon } from 'lucide-react'

interface BetterSheetProps {
  /**
   * Controls whether the sheet is open
   */
  open: boolean

  /**
   * Callback when the open state changes
   */
  onOpenChange: (open: boolean) => void

  /**
   * The trigger element that opens the sheet
   */
  trigger?: ReactNode

  /**
   * Icon to display in the header (Lucide icon component)
   */
  icon?: LucideIcon

  /**
   * Title displayed in the header
   */
  title: string

  /**
   * Optional description displayed below the title
   */
  description?: string

  /**
   * The main content of the sheet (form fields, etc)
   */
  children: ReactNode

  /**
   * Footer content (typically action buttons)
   */
  footer?: ReactNode

  /**
   * Optional className for the SheetContent
   */
  className?: string
}

export function BetterSheet({
  open,
  onOpenChange,
  trigger,
  icon: Icon,
  title,
  description,
  children,
  footer,
  className,
}: BetterSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}

      <SheetContent
        className={`!flex !flex-col !p-0 !gap-0 overflow-hidden ${className || ''}`}
      >
        {/* Fixed Header */}
        <div className="bg-primary text-primary-foreground p-6 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            {Icon && <Icon className="h-6 w-6" />}
            <div>
              <SheetTitle className="text-primary-foreground">{title}</SheetTitle>
              {description && (
                <SheetDescription className="text-primary-foreground/80">
                  {description}
                </SheetDescription>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Content - Takes remaining space */}
        <div className="flex-1 min-h-0 bg-background">
          <ScrollArea className="h-full">
            <div className="space-y-4 p-6 pr-4">
              {children}
            </div>
          </ScrollArea>
        </div>

        {/* Fixed Footer */}
        {footer && (
          <div className="flex gap-2 p-6 bg-background border-t shrink-0">
            {footer}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
