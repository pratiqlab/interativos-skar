'use client'

import React from 'react'
import Image from 'next/image'

export default function LoadingOverlay() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="flex flex-col items-center gap-4">
                {/* Logo com animação de pulse */}
                <div className="relative w-16 h-16">
                    {/* Círculo animado de fundo */}
                    <div className="absolute inset-0">
                        <div className="w-16 h-16 rounded-full border-4 border-primary/20" />
                    </div>

                    {/* Círculo spinner */}
                    <div className="absolute inset-0 animate-spin">
                        <div className="w-16 h-16 rounded-full border-4 border-transparent border-t-primary" />
                    </div>

                    {/* Logo centralizado */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Image
                            src="/logo.svg"
                            alt="Logo PratiqLab"
                            width={32}
                            height={32}
                            className="w-8 h-8 animate-pulse dark:brightness-0 dark:invert"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
} 