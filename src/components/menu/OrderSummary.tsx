import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Trash2, User } from "lucide-react"
import { OrderItem } from "../../types"

interface OrderSummaryProps {
  orderItems: OrderItem[]
  tableResponsible: string
  onTableResponsibleChange: (value: string) => void
  onRemoveItem: (itemId: string) => void
  onSubmit: () => void
}

export const OrderSummary = ({
  orderItems,
  tableResponsible,
  onTableResponsibleChange,
  onRemoveItem,
  onSubmit
}: OrderSummaryProps) => {
  console.log("OrderSummary - orderItems", orderItems);
  const getTotalPrice = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  return (
    <Card className="sticky top-4 border-0 shadow-lg bg-white/70 backdrop-blur-sm">
      <CardHeader className="border-b">
        <CardTitle className="text-xl font-semibold">Resumo do Pedido</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Responsável</label>
            <div className="flex items-center gap-2 bg-white rounded-lg border shadow-sm">
              <User className="h-4 w-4 ml-3 text-gray-500" />
              <Input
                placeholder="Nome do responsável"
                value={tableResponsible}
                onChange={(e) => onTableResponsibleChange(e.target.value)}
                className="border-0 focus-visible:ring-0"
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-medium text-sm text-gray-700">Itens do Pedido</h3>
            {orderItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveItem(item.id)}
                    className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="flex flex-col">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-sm text-gray-500">Qtd: {item.quantity}</span>
                  </div>
                </div>
                <span className="font-medium">€{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total</span>
              <span className="text-green-600">€{getTotalPrice().toFixed(2)}</span>
            </div>
          </div>

          <Button 
            onClick={onSubmit}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-6"
          >
            Enviar para Cozinha
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
