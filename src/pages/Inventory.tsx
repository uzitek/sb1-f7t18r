import React, { useState, useEffect } from 'react';
import { PlusCircle, MinusCircle, RefreshCw } from 'lucide-react';
import { dbService } from '../services/db';

interface Product {
  id: number;
  name: string;
  reorderLevel: number;
}

interface InventoryItem {
  productId: number;
  quantity: number;
}

const Inventory: React.FC = () => {
  const [inventory, setInventory] = useState<(InventoryItem & Product)[]>([]);
  const [selectedItem, setSelectedItem] = useState<(InventoryItem & Product) | null>(null);
  const [quantity, setQuantity] = useState<number>(0);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const products = await dbService.getAll<Product>('products');
      const inventoryItems = await dbService.getAll<InventoryItem>('inventory');
      
      const combinedInventory = products.map(product => {
        const inventoryItem = inventoryItems.find(item => item.productId === product.id);
        return {
          ...product,
          ...inventoryItem,
          quantity: inventoryItem ? inventoryItem.quantity : 0
        };
      });

      setInventory(combinedInventory);
    } catch (error) {
      console.error('Failed to load inventory:', error);
    }
  };

  const handleStockChange = async (action: 'in' | 'out') => {
    if (selectedItem && quantity > 0) {
      const newQuantity = action === 'in' 
        ? selectedItem.quantity + quantity 
        : Math.max(0, selectedItem.quantity - quantity);

      try {
        await dbService.update('inventory', {
          productId: selectedItem.id,
          quantity: newQuantity
        });
        setSelectedItem(null);
        setQuantity(0);
        loadInventory();
      } catch (error) {
        console.error(`Failed to update inventory for ${action}:`, error);
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Inventory Management</h1>
      <div className="flex mb-4">
        <select
          className="mr-2 p-2 border rounded"
          value={selectedItem?.id || ''}
          onChange={(e) => setSelectedItem(inventory.find(item => item.id === Number(e.target.value)) || null)}
        >
          <option value="">Select an item</option>
          {inventory.map(item => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>
        <input
          type="number"
          className="mr-2 p-2 border rounded"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min="0"
        />
        <button
          className="mr-2 p-2 bg-green-500 text-white rounded flex items-center"
          onClick={() => handleStockChange('in')}
        >
          <PlusCircle className="mr-1" size={16} /> Stock In
        </button>
        <button
          className="mr-2 p-2 bg-red-500 text-white rounded flex items-center"
          onClick={() => handleStockChange('out')}
        >
          <MinusCircle className="mr-1" size={16} /> Stock Out
        </button>
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Quantity</th>
            <th className="py-2 px-4 border-b">Reorder Level</th>
            <th className="py-2 px-4 border-b">Status</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.id}>
              <td className="py-2 px-4 border-b">{item.id}</td>
              <td className="py-2 px-4 border-b">{item.name}</td>
              <td className="py-2 px-4 border-b">{item.quantity}</td>
              <td className="py-2 px-4 border-b">{item.reorderLevel}</td>
              <td className="py-2 px-4 border-b">
                {item.quantity <= item.reorderLevel ? (
                  <span className="text-red-500">Low Stock</span>
                ) : (
                  <span className="text-green-500">In Stock</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Inventory;