import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
}

interface SaleItem {
  product: Product;
  quantity: number;
}

const Sales: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    // TODO: Fetch products data from IndexedDB
    const mockData: Product[] = [
      { id: 1, name: 'Product A', price: 10.99 },
      { id: 2, name: 'Product B', price: 15.99 },
      { id: 3, name: 'Product C', price: 8.99 },
    ];
    setProducts(mockData);
  }, []);

  const addToCart = () => {
    if (selectedProduct) {
      const existingItem = cart.find(item => item.product.id === selectedProduct.id);
      if (existingItem) {
        setCart(cart.map(item =>
          item.product.id === selectedProduct.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ));
      } else {
        setCart([...cart, { product: selectedProduct, quantity }]);
      }
      setSelectedProduct(null);
      setQuantity(1);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity > 0) {
      setCart(cart.map(item =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    } else {
      removeFromCart(productId);
    }
  };

  const totalAmount = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const handleCheckout = () => {
    // TODO: Implement checkout logic (e.g., update inventory, save sale record)
    console.log('Checkout:', cart);
    setCart([]);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Sales Management</h1>
      <div className="flex mb-4">
        <select
          className="mr-2 p-2 border rounded"
          value={selectedProduct?.id || ''}
          onChange={(e) => setSelectedProduct(products.find(p => p.id === Number(e.target.value)) || null)}
        >
          <option value="">Select a product</option>
          {products.map(product => (
            <option key={product.id} value={product.id}>{product.name} - ${product.price.toFixed(2)}</option>
          ))}
        </select>
        <input
          type="number"
          className="mr-2 p-2 border rounded w-20"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min="1"
        />
        <button
          className="p-2 bg-blue-500 text-white rounded flex items-center"
          onClick={addToCart}
        >
          <Plus className="mr-1" size={16} /> Add to Cart
        </button>
      </div>
      <div className="flex">
        <div className="w-2/3 pr-4">
          <h2 className="text-xl font-semibold mb-2">Cart</h2>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Product</th>
                <th className="py-2 px-4 border-b">Price</th>
                <th className="py-2 px-4 border-b">Quantity</th>
                <th className="py-2 px-4 border-b">Subtotal</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.product.id}>
                  <td className="py-2 px-4 border-b">{item.product.name}</td>
                  <td className="py-2 px-4 border-b">${item.product.price.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      className="mr-1 p-1 bg-red-500 text-white rounded"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    >
                      <Minus size={12} />
                    </button>
                    {item.quantity}
                    <button
                      className="ml-1 p-1 bg-green-500 text-white rounded"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    >
                      <Plus size={12} />
                    </button>
                  </td>
                  <td className="py-2 px-4 border-b">${(item.product.price * item.quantity).toFixed(2)}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      className="p-1 bg-red-500 text-white rounded"
                      onClick={() => removeFromCart(item.product.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="w-1/3 bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Total Items:</span>
            <span>{cart.reduce((total, item) => total + item.quantity, 0)}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="font-semibold">Total Amount:</span>
            <span className="font-semibold">${totalAmount.toFixed(2)}</span>
          </div>
          <button
            className="w-full p-2 bg-green-500 text-white rounded flex items-center justify-center"
            onClick={handleCheckout}
          >
            <ShoppingCart className="mr-2" size={20} /> Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sales;