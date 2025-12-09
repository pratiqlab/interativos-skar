import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import MarkdownText from "@/components/custom/markdown/MarkdownText"

interface ParametroVar {
  label: string // LaTeX do parâmetro (ex: "$h_e =$")
  valor: number | string // valor numérico ou string
  unidade?: string // unidade (ex: "cm", "°", etc.)
}

interface FloatVarsProps {
  visivel: boolean // controla se a barra está visível
  parametros: ParametroVar[] // array de parâmetros a exibir
  onEditar?: () => void // callback quando clicar em Editar
  className?: string // classes CSS adicionais
}

export default function FloatVars({ 
  visivel, 
  parametros, 
  onEditar,
  className = ""
}: FloatVarsProps) {
  if (!visivel) return null

  return (
    <div className={`fixed top-16 left-0 right-0 z-40 bg-muted/95 backdrop-blur-md border-b shadow-sm ${className}`}>
      <div className="px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            {parametros.map((param, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-muted-foreground">
                  <MarkdownText content={param.label} />
                </span>
                <span className="font-medium">
                  {param.valor}{param.unidade && ` ${param.unidade}`}
                </span>
              </div>
            ))}
          </div>
          {onEditar && (
            <Button
              onClick={onEditar}
              variant="outline"
              size="sm"
            >
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
