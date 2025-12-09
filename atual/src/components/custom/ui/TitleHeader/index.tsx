'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

/**
 * TitleHeader Component
 *
 * A header component with consistent styling across admin pages.
 *
 * @example
 * ```tsx
 * <TitleHeader
 *   title="Manage Plans"
 *   actions={<PlanSheet />}
 *   backbutton={true}
 *   route="/admin"
 * />
 * ```
 *
 * IMPORTANT: When using action buttons (like "Add", "Create", etc.), they should match
 * the back button style for visual consistency:
 *
 * @example Action Button Pattern
 * ```tsx
 * <button
 *   className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground text-primary transition-opacity hover:opacity-80 shrink-0"
 *   aria-label="Your Action"
 * >
 *   <YourIcon className="h-5 w-5" />
 * </button>
 * ```
 */

interface TitleHeaderProps {
  title: string;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  backbutton?: boolean;
  route?: string;
}

export const TitleHeader: React.FC<TitleHeaderProps> = ({
  title,
  subtitle,
  actions,
  backbutton = true,
  route,
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (route) {
      router.push(route);
    } else {
      router.back();
    }
  };

  return (
    <div className="bg-primary text-primary-foreground p-4 relative">
      {/* Mobile Layout */}
      <div className="md:hidden">
        {backbutton && (
          <button
            onClick={handleBack}
            className="absolute -top-0 -right-0 h-12 w-12 flex items-start justify-end p-1 bg-primary-foreground text-primary transition-opacity hover:opacity-80"
            style={{
              clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
            }}
            aria-label="Voltar"
          >
            <ChevronLeft className="h-4 w-4 mt-1 mr-1" />
          </button>
        )}
        <div className="mb-2">
          <h1 className="font-logo text-2xl font-bold leading-tight">{title}</h1>
        </div>
        {subtitle && (
          <div className="text-sm opacity-90 mb-2 text-center">{subtitle}</div>
        )}
        {actions && (
          <div className="flex justify-center">{actions}</div>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex md:items-center md:justify-between md:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="font-logo text-2xl font-bold leading-tight">{title}</h1>
          {subtitle && (
            <div className="mt-1 text-sm opacity-90">{subtitle}</div>
          )}
        </div>

        {(actions || backbutton) && (
          <div className="flex items-center gap-2 shrink-0">
            {actions && <div>{actions}</div>}

            {backbutton && (
              <button
                onClick={handleBack}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground text-primary transition-opacity hover:opacity-80 shrink-0"
                aria-label="Voltar"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
