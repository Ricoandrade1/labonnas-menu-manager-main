import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { MenuCategory } from "@/components/MenuCategory";
import { OrderSummary } from "@/components/OrderSummary";
import { MenuItem, Order, OrderItem } from "@/types/menu";
import { menuItems, categories } from "@/data/menuItems";
import { useToast } from "@/hooks/use-toast";

const MenuSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const tableId = new URLSearchParams(location.search).get("table") || "";
  
  const [activeOrder, setActiveOrder] = useState<Order>({
    id: `order-${Date.now()}`,
    tableId,
    serverId: user?.id || "",
    serverName: user?.name || "",
    items: [],
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    total: 0
  });

  const handleItemSelect = (item: MenuItem) => {
    setActiveOrder(prev => {
      const existingItem = prev.items.find(i => i.id === item.id);
      
      let updatedItems;
      if (existingItem) {
        updatedItems = prev.items.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        updatedItems = [...prev.items, {
          ...item,
          quantity: 1,
          timestamp: new Date().toISOString()
        }];
      }

      const total = updatedItems.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
      );

      return {
        ...prev,
        items: updatedItems,
        total,
        updatedAt: new Date().toISOString()
      };
    });

    toast({
      title: "Item adicionado",
      description: `${item.name} foi adicionado ao pedido`
    });
  };

  const handleUpdateQuantity = (item: OrderItem, change: number) => {
    setActiveOrder(prev => {
      const updatedItems = prev.items.map(i => {
        if (i.id === item.id) {
          const newQuantity = i.quantity + change;
          return newQuantity > 0 ? { ...i, quantity: newQuantity } : null;
        }
        return i;
      }).filter(Boolean) as OrderItem[];

      const total = updatedItems.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
      );

      return {
        ...prev,
        items: updatedItems,
        total,
        updatedAt: new Date().toISOString()
      };
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setActiveOrder(prev => {
      const updatedItems = prev.items.filter(i => i.id !== itemId);
      const total = updatedItems.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
      );

      return {
        ...prev,
        items: updatedItems,
        total,
        updatedAt: new Date().toISOString()
      };
    });
  };

  const handleAddNote = (note: string) => {
    if (!note.trim()) return;
    
    setActiveOrder(prev => ({
      ...prev,
      notes: prev.notes ? `${prev.notes}\n${note}` : note,
      updatedAt: new Date().toISOString()
    }));

    toast({
      title: "Observação adicionada",
      description: "A observação foi adicionada ao pedido"
    });
  };

  const handleCompleteOrder = () => {
    if (activeOrder.items.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione itens ao pedido antes de finalizar",
        variant: "destructive"
      });
      return;
    }

    // Save order to local storage
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    localStorage.setItem(
      "orders", 
      JSON.stringify([...orders, { ...activeOrder, status: "completed" }])
    );

    toast({
      title: "Pedido finalizado",
      description: "O pedido foi enviado para a cozinha"
    });

    navigate("/tables");
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Categories */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {categories.map(category => (
                <MenuCategory
                  key={category.id}
                  category={category}
                  items={menuItems.filter(item => item.category === category.id)}
                  onItemSelect={handleItemSelect}
                />
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <OrderSummary
                order={activeOrder}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onAddNote={handleAddNote}
                onComplete={handleCompleteOrder}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuSelection;
