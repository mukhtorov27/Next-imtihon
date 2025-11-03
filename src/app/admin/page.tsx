// ...existing code...
"use client";
import React, { useEffect, useState } from "react";
import "../homePage.css";
import { db } from "@/app/firebase/firebase.config";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import Image from "next/image";
import dynamic from "next/dynamic";
import "rodal/lib/rodal.css";

const Rodal = dynamic(() => import("rodal"), { ssr: false });

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  img: Array<string>;
  category?: string;
}

interface Category {
  id: string;
  name: string;
}

function AdminPage() {
  // ...existing auth state...
  const [authenticated, setAuthenticated] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem("admin_auth");
    } catch {
      return false;
    }
  });
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    try {
      if (authenticated) localStorage.setItem("admin_auth", "1");
      else localStorage.removeItem("admin_auth");
    } catch {}
  }, [authenticated]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    if (passwordInput === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setPasswordInput("");
    } else {
      setAuthError("Parol noto'g'ri");
    }
  }

  function handleLogout() {
    setAuthenticated(false);
  }

  // products + categories state
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [catLoading, setCatLoading] = useState(true);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    name: "",
    price: "",
    description: "",
    imgUrl: "",
    category: "",
  });

  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newImages, setNewImages] = useState<string[]>([""]);
  const [newCategory, setNewCategory] = useState<string>(""); // selected category for new product
  const [adding, setAdding] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // load products + categories
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsData = querySnapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Product, "id">),
        })) as Product[];
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const snap = await getDocs(collection(db, "categories"));
        const cats = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        })) as Category[];
        setCategories(cats);
        // set default selected category if exists
        if (cats.length) setNewCategory(cats[0].name);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setCatLoading(false);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  // category helpers
  async function createCategory(name: string) {
    const n = name.trim();
    if (!n) return;
    try {
      const colRef = collection(db, "categories");
      const docRef = await addDoc(colRef, { name: n });
      const newCat = { id: docRef.id, name: n };
      setCategories((s) => [...s, newCat]);
      setNewCategory(n);
    } catch (err) {
      console.error("Create category failed:", err);
      alert("Failed to create category");
    }
  }

  function addImageField() {
    setNewImages((s) => [...s, ""]);
  }
  function removeImageField(index: number) {
    setNewImages((s) => s.filter((_, i) => i !== index));
  }
  function setImageValue(index: number, value: string) {
    setNewImages((s) => s.map((v, i) => (i === index ? value : v)));
  }

  async function handleAddProduct(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!newName.trim()) {
      alert("Enter product name");
      return;
    }
    setAdding(true);
    const cleanedImages = newImages.map((i) => i.trim()).filter(Boolean);
    const payload: any = {
      name: newName.trim(),
      price: parseFloat(newPrice) || 0,
      description: newDescription.trim(),
      img: cleanedImages,
    };
    if (newCategory) payload.category = newCategory;
    try {
      const colRef = collection(db, "products");
      const docRef = await addDoc(colRef, payload);
      setProducts((prev) => [{ id: docRef.id, ...(payload as any) }, ...prev]);
      setNewName("");
      setNewPrice("");
      setNewDescription("");
      setNewImages([""]);
      setNewCategory(categories.length ? categories[0].name : "");
      setIsAddModalOpen(false);
    } catch (err) {
      console.error("Add product failed:", err);
      alert("Failed to add product");
    } finally {
      setAdding(false);
    }
  }

  async function handleDeleteProduct(id: string) {
    const ok = confirm("Are you sure you want to delete this product?");
    if (!ok) return;
    try {
      setDeletingId(id);
      await deleteDoc(doc(db, "products", id));
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Failed to delete product. Check console for details.");
    } finally {
      setDeletingId(null);
    }
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setEditData({
      name: product.name,
      price: String(product.price),
      description: product.description,
      imgUrl: product.img && product.img.length ? product.img[0] : "",
      category: product.category || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditData({
      name: "",
      price: "",
      description: "",
      imgUrl: "",
      category: "",
    });
  }

  async function saveEdit() {
    if (!editingId) return;
    try {
      const id = editingId;
      const updated: any = {
        name: editData.name,
        price: parseFloat(editData.price) || 0,
        description: editData.description,
        img: editData.imgUrl ? [editData.imgUrl] : [],
      };
      if (editData.category) updated.category = editData.category;
      await updateDoc(doc(db, "products", id), updated);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? ({ ...p, ...updated } as Product) : p))
      );
      cancelEdit();
    } catch (err) {
      console.error("Failed to update product:", err);
      alert("Update failed. See console for details.");
    }
  }

  // If not authenticated show password form
  if (!authenticated) {
    return (
      <div className="admin-auth-overlay">
        <form className="admin-auth-card" onSubmit={handleLogin}>
          <h2>Admin kirish</h2>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Parolni kiriting"
            className="admin-auth-input"
            autoFocus
          />
          <div className="admin-auth-actions">
            <button type="submit" className="admin-auth-btn">
              Kirish
            </button>
          </div>
          {authError && <p className="admin-auth-error">{authError}</p>}
          <p className="admin-auth-note">
            Parolni ozgartirmoqchi bolsangiz NEXT_PUBLIC_ADMIN_PASSWORD env
            ornating.
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <button
            onClick={handleLogout}
            style={{ marginTop: 8 }}
            className="admin-logout-btn"
          >
            Chiqish
          </button>
        </div>
        <ul className="sidebar-menu">
          <li className="menu-item active">
            <i className="fas fa-box"></i>
            <span>Products</span>
          </li>
          <li className="menu-item">
            <i className="fas fa-users"></i>
            <span>Users</span>
          </li>
          <li className="menu-item">
            <i className="fas fa-cog"></i>
            <span>Settings</span>
          </li>
          <li className="menu-item">
            <i className="fas fa-list"></i>
            <span>Categories</span>{" "}
            {/* optionally link to categories management */}
          </li>
        </ul>
      </div>

      <div className="main-content">
        <div
          className="content-header"
          style={{ alignItems: "flex-start", gap: 12 }}
        >
          <h1>Products Management</h1>
          <button
            className="add-product-btn"
            onClick={() => setIsAddModalOpen(true)}
          >
            <i className="fas fa-plus"></i> Add New Product
          </button>
        </div>

        <Rodal
          visible={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          customStyles={{
            width: 720,
            padding: 20,
            borderRadius: 8,
            height: "max-content",
          }}
        >
          <form onSubmit={handleAddProduct} className="rodal-form">
            <h3 style={{ marginTop: 0 }}>Add product</h3>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Name"
                className="rodal-input"
              />
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="Price"
                className="rodal-input small"
              />
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Description"
                className="rodal-textarea"
              />
            </div>

            <div style={{ marginTop: 12 }}>
              <label className="rodal-label">Category</label>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="rodal-input"
                  style={{ maxWidth: 320 }}
                >
                  <option value="">— Select category —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <input
                  placeholder="New category"
                  id="new-cat-input"
                  className="rodal-input"
                  style={{ maxWidth: 220 }}
                />
                <button
                  type="button"
                  className="rodal-btn add"
                  onClick={() => {
                    const el = document.getElementById(
                      "new-cat-input"
                    ) as HTMLInputElement | null;
                    if (!el) return;
                    const name = el.value.trim();
                    if (!name) return alert("Enter category name");
                    createCategory(name);
                    el.value = "";
                  }}
                >
                  Add
                </button>
              </div>

              <label className="rodal-label">Images</label>
              {newImages.map((img, i) => (
                <div key={i} className="rodal-image-row">
                  <input
                    value={img}
                    onChange={(e) => setImageValue(i, e.target.value)}
                    placeholder="Image URL"
                    className="rodal-input"
                  />
                  {newImages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(i)}
                      className="rodal-btn remove"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}

              <div style={{ marginTop: 8 }}>
                <button
                  type="button"
                  onClick={addImageField}
                  className="rodal-btn add"
                >
                  + Add image
                </button>
              </div>
            </div>

            <div className="rodal-actions">
              <button
                type="submit"
                className="rodal-btn save"
                disabled={adding}
              >
                {adding ? "Adding..." : "Add product"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setNewName("");
                  setNewPrice("");
                  setNewDescription("");
                  setNewImages([""]);
                  setNewCategory(categories.length ? categories[0].name : "");
                }}
                className="rodal-btn reset"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rodal-btn cancel"
              >
                Close
              </button>
            </div>
          </form>
        </Rodal>

        {editingId && (
          <div
            className="edit-panel"
            style={{
              background: "#fff",
              padding: 16,
              marginBottom: 20,
              borderRadius: 8,
            }}
          >
            <h3>Edit product</h3>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <input
                value={editData.name}
                onChange={(e) =>
                  setEditData((s) => ({ ...s, name: e.target.value }))
                }
                placeholder="Name"
                style={{ padding: 8, flex: 1, minWidth: 200 }}
              />
              <input
                value={editData.price}
                onChange={(e) =>
                  setEditData((s) => ({ ...s, price: e.target.value }))
                }
                placeholder="Price"
                style={{ padding: 8, width: 120 }}
              />
              <input
                value={editData.imgUrl}
                onChange={(e) =>
                  setEditData((s) => ({ ...s, imgUrl: e.target.value }))
                }
                placeholder="Image URL"
                style={{ padding: 8, flex: 1, minWidth: 200 }}
              />
              <select
                value={editData.category}
                onChange={(e) =>
                  setEditData((s) => ({ ...s, category: e.target.value }))
                }
                style={{ padding: 8, minWidth: 200 }}
              >
                <option value="">— No category —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <div style={{ width: "100%" }}>
                <textarea
                  value={editData.description}
                  onChange={(e) =>
                    setEditData((s) => ({ ...s, description: e.target.value }))
                  }
                  placeholder="Description"
                  style={{ padding: 8, width: "100%", minHeight: 80 }}
                />
              </div>
            </div>
            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <button onClick={saveEdit} className="edit-btn">
                Save
              </button>
              <button onClick={cancelEdit} className="delete-btn">
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="content-body">
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <div key={product.id} className="product-card">
                  <Image
                    src={
                      product.img && product.img.length
                        ? product.img[0]
                        : "/placeholder.jpg"
                    }
                    alt={product.name}
                    width={200}
                    height={200}
                  />
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="price">${product.price}</p>
                    <p className="description">{product.description}</p>
                    <p
                      className="category"
                      style={{ fontSize: 12, color: "#556" }}
                    >
                      {product.category
                        ? `Category: ${product.category}`
                        : "No category"}
                    </p>
                  </div>
                  <div className="product-actions">
                    <button
                      className="edit-btn"
                      onClick={() => startEdit(product)}
                    >
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteProduct(product.id)}
                      disabled={deletingId === product.id}
                    >
                      <i className="fas fa-trash"></i>{" "}
                      {deletingId === product.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
// ...existing code...
