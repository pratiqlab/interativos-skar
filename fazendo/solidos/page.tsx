"use client"

import { useState, useEffect } from "react"
import { Inercia } from "@/components/custom/interativos/skar/Inercia"
import { SolidoBarraDelgadaCentro } from "./modulos/solidos/BarraDelgadaCentro"
import { SolidoBarraDelgadaExtremidade } from "./modulos/solidos/BarraDelgadaExtremidade"
import { SolidoPlacaRetangularCentro } from "./modulos/solidos/PlacaRetangular"
import { SolidoPlacaRetangularFinaBorda } from "./modulos/solidos/PlacaRetangularFina"
import { SolidoCilindroOco } from "./modulos/solidos/CilindroOco"
import { SolidoCilindroMacico } from "./modulos/solidos/CilindroMacico"
import { SolidoCilindroOcoParedesFinas } from "./modulos/solidos/CilindroOcoParedesFinas"
import { SolidoEsferaSolida } from "./modulos/solidos/EsferaSolida"
import { SolidoEsferaOcaParedesFinas } from "./modulos/solidos/EsferaOcaParedesFinas"

export default function Page() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Momentos de Inércia</h1>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Momentos de Inércia</h1>
        <p className="text-muted-foreground">Clique no botão no canto inferior direito para abrir</p>
      </div>

      <Inercia>
        <SolidoBarraDelgadaCentro />
        <SolidoBarraDelgadaExtremidade />
        <SolidoPlacaRetangularCentro />
        <SolidoPlacaRetangularFinaBorda />
        <SolidoCilindroOco />
        <SolidoCilindroMacico />
        <SolidoCilindroOcoParedesFinas />
        <SolidoEsferaSolida />
        <SolidoEsferaOcaParedesFinas />
      </Inercia>
    </div>
  )
}
