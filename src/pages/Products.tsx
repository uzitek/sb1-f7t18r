import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { dbService } from '../services/db';

interface Product {
  id?: number;
  name: string;
  category: string;
  price: number;
  supplier: string;
  reorderLevel: number;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    category: '',
    price: 0,
    supplier: '',
    reorderLevel: 0,
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const loadedProducts = await dbService.getAll<Product>('products');
      setProducts(loadedProducts);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = name === 'price' || name === 'reorderLevel' ? parseFloat(value) : value;
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, [name]: numericValue });
    } else {
      setNewProduct({ ...newProduct, [name]: numericValue });
    }
  };

  const handleAddProduct = async () => {
    try {
      await dbService.add('products', newProduct);
      setNewProduct({ name: '', category: '', price: 0, supplier: '', reorderLevel: 0 });
      loadProducts();
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleUpdateProduct = async () => {
    if (editingProduct) {
      try {
        await dbService.update('products', editingProduct);
        setEditingProduct(null);
        loadProducts();
      } catch (error) {
        console.error('Failed to update product:', error);
      }
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await dbService.delete('products', id);
      loadProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Product Management</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </h2>
        <div className="flex space-x-2">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            className="p-2 border rounded"
            value={editingProduct ? editingProduct.name : newProduct.name}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            className="p-2 border rounded"
            value={editingProduct ? editingProduct.category : newProduct.category}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            className="p-2 border rounded"
            value={editingProduct ? editingProduct.price : newProduct.price}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="supplier"
            placeholder="Supplier"
            className="p-2 border rounded"
            value={editingProduct ? editingProduct.supplier : newProduct.supplier}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="reorderLevel"
            placeholder="Reorder Level"
            className="p-2 border rounded"
            value={editingProduct ? editingProduct.reorderLevel : newProduct.reorderLevel}
            onChange={handleInputChange}
          />
          <button
            className="p-2 bg-blue-500 text-white rounded flex items-center"
            onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
          >
            {editingProduct ? (
              <>
                <Edit className="mr-1" size={16} /> Update
              </>
            ) : (
              <>
                <PlusCircle className="mr-1" size={16} /> Add
              </>
            )}
          </button>
        </div>
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Category</th>
            <th className="py-2 px-4 border-b">Price</th>
            <th className="py-2 px-4 border-b">Supplier</th>
            <th className="py-2 px-4 border-b">Reorder Level</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="py-2 px-4 border-b">{product.id}</td>
              <td className="py-2 px-4 border-b">{product.name}</td>
              <td className="py-2 px-4 border-b">{product.category}</td>
              <td className="py-2 px-4 border-b">${product.price.toFixed(2)}</td>
              <td className="py-2 px-4 border-b">{product.supplier}</td>
              <td className="py-2 px-4 border-b">{product.reorderLevel}</td>
              <td className="py-2 px-4 border-b">
                <button
                  className="mr-2 p-1 bg-yellow-500 text-white rounded"
                  onClick={() => handleEditProduct(product)}
                >
                  <Edit size={16} />
                </button>
                <button
                  className="p-1 bg-red-500 text-white rounded"
                  onClick={() => handleDeleteProduct(product.id!)}
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;