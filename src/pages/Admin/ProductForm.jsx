import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  createProduct,
  updateProduct,
  getProductById,
} from "../../api/productService";

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    countInStock: "",
    image: "",
  });

  const loadProduct = async () => {
    try {
      const p = await getProductById(id);
      setForm({
        name: p.name,
        price: p.price,
        description: p.description,
        countInStock: p.countInStock,
        image: p.image,
      });
    } catch (err) {
      toast.error("Failed to load product");
    }
  };

  useEffect(() => {
    if (isEdit) loadProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateProduct(id, form);
        toast.success("Product updated");
      } else {
        await createProduct(form);
        toast.success("Product created");
      }
      navigate("/admin");
    } catch (err) {
      toast.error("Save failed");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-6 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">
        {isEdit ? "Edit Product" : "Add Product"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Product Name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border p-3 rounded"
        />

        <input
          type="number"
          placeholder="Price"
          required
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="w-full border p-3 rounded"
        />

        <textarea
          placeholder="Description"
          required
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border p-3 rounded"
          rows="3"
        />

        <input
          type="number"
          placeholder="Stock Count"
          required
          value={form.countInStock}
          onChange={(e) =>
            setForm({ ...form, countInStock: e.target.value })
          }
          className="w-full border p-3 rounded"
        />

        <input
          placeholder="Image URL"
          required
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          className="w-full border p-3 rounded"
        />

        <button className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700">
          {isEdit ? "Update Product" : "Create Product"}
        </button>
      </form>
    </div>
  );
}
