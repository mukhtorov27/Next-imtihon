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
  getDoc,
  Timestamp,
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
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}
type AdminOrder = {
  id: string;
  personfullname?: string;
  personnumber?: string;
  personlocation?: string;
  name?: string;
  img?: string;
  price?: number;
  quantity?: number;
  message?: string;
  fullName?: string;
  phone?: string;
  address?: string;
  items?: OrderItem[];
  total?: number;
  status?: "pending" | "delivered" | "cancelled";
  createdAt?: any;
  deliveredAt?: any;
};

interface BlogPost {
  id: string;
  name?: string;
  fulldescription?: string;
  img?: string;
  createdAt?: any;
}

export default function AdminPage() {
  const [mounted, setMounted] = useState(false);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    setMounted(true);
    try {
      const a = !!localStorage.getItem("admin_auth");
      setAuthenticated(a);
    } catch {}
  }, []);

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
  const [newCategory, setNewCategory] = useState<string>("");
  const [adding, setAdding] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<
    "products" | "orders" | "delivered" | "blog"
  >("products");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [deliveredOrders, setDeliveredOrders] = useState<AdminOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // blog states
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [blogLoading, setBlogLoading] = useState(true);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [blogForm, setBlogForm] = useState({
    name: "",
    fulldescription: "",
    img: "",
  });
  const [blogSaving, setBlogSaving] = useState(false);
  const [blogDeletingId, setBlogDeletingId] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchOrders = async () => {
      if (activeTab !== "orders" && activeTab !== "delivered") return;
      setOrdersLoading(true);
      try {
        if (activeTab === "orders") {
          const snap = await getDocs(collection(db, "buyurtma"));
          const data = snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as any),
          })) as AdminOrder[];
          setOrders(data);
        } else {
          const snap = await getDocs(collection(db, "yetkazildi"));
          const data = snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as any),
          })) as AdminOrder[];
          setDeliveredOrders(data);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, [activeTab]);

  // fetch blogs when tab changes to blog
  useEffect(() => {
    if (activeTab !== "blog") return;
    const fetchBlogs = async () => {
      setBlogLoading(true);
      try {
        const snap = await getDocs(collection(db, "blog"));
        const data = snap.docs
          .map((d) => ({ id: d.id, ...(d.data() as any) }))
          .sort((a: any, b: any) => {
            const ta = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
            const tb = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
            return tb - ta;
          }) as BlogPost[];
        setBlogPosts(data);
      } catch (err) {
        console.error("Error fetching blog posts:", err);
      } finally {
        setBlogLoading(false);
      }
    };
    fetchBlogs();
  }, [activeTab]);

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

  async function handleOrderStatus(
    orderId: string,
    newStatus: "delivered" | "cancelled"
  ) {
    try {
      const orderRef = doc(db, "buyurtma", orderId);
      const orderSnap = await getDoc(orderRef);
      if (!orderSnap.exists()) {
        alert("Order not found");
        return;
      }
      const orderData = {
        id: orderSnap.id,
        ...(orderSnap.data() as any),
      } as AdminOrder;

      if (newStatus === "delivered") {
        await addDoc(collection(db, "yetkazildi"), {
          ...orderData,
          status: "delivered",
          deliveredAt: new Date(),
        });
        await deleteDoc(orderRef);
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
      } else {
        await updateDoc(orderRef, { status: "cancelled" });
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId ? { ...o, status: "cancelled" } : o
          )
        );
      }
    } catch (err) {
      console.error("Error updating order:", err);
      alert("Status update failed");
    }
  }

  // ---- Blog CRUD functions ----
  function openAddBlogModal() {
    setEditingBlogId(null);
    setBlogForm({ name: "", fulldescription: "", img: "" });
    setIsBlogModalOpen(true);
  }

  function startEditBlog(post: BlogPost) {
    setEditingBlogId(post.id);
    setBlogForm({
      name: post.name || "",
      fulldescription: post.fulldescription || "",
      img: post.img || "",
    });
    setIsBlogModalOpen(true);
  }

  async function saveBlog(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!blogForm.name.trim()) {
      alert("Enter blog title");
      return;
    }
    setBlogSaving(true);
    try {
      if (editingBlogId) {
        const ref = doc(db, "blog", editingBlogId);
        await updateDoc(ref, {
          name: blogForm.name.trim(),
          fulldescription: blogForm.fulldescription.trim(),
          img: blogForm.img.trim(),
        });
        setBlogPosts((prev) =>
          prev.map((p) =>
            p.id === editingBlogId
              ? {
                  ...p,
                  name: blogForm.name.trim(),
                  fulldescription: blogForm.fulldescription.trim(),
                  img: blogForm.img.trim(),
                }
              : p
          )
        );
      } else {
        const colRef = collection(db, "blog");
        const payload = {
          name: blogForm.name.trim(),
          fulldescription: blogForm.fulldescription.trim(),
          img: blogForm.img.trim(),
          createdAt: Timestamp.fromDate(new Date()),
        };
        const docRef = await addDoc(colRef, payload);
        setBlogPosts((prev) => [
          { id: docRef.id, ...(payload as any) },
          ...prev,
        ]);
      }
      setIsBlogModalOpen(false);
      setEditingBlogId(null);
      setBlogForm({ name: "", fulldescription: "", img: "" });
    } catch (err) {
      console.error("Save blog failed:", err);
      alert("Failed to save blog. See console.");
    } finally {
      setBlogSaving(false);
    }
  }

  async function deleteBlog(id: string) {
    const ok = confirm("Are you sure you want to delete this post?");
    if (!ok) return;
    try {
      setBlogDeletingId(id);
      await deleteDoc(doc(db, "blog", id));
      setBlogPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete blog failed:", err);
      alert("Failed to delete post");
    } finally {
      setBlogDeletingId(null);
    }
  }

  // ---- helpers ----
  if (!mounted) return null;

  if (!authenticated) {
    return (
      <div className="admin-container">
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

  const renderOrderItems = (order: AdminOrder) => {
    if (order.items && order.items.length) return order.items;
    if (order.name) {
      return [
        {
          id: order.id,
          name: order.name,
          price: order.price || 0,
          quantity: order.quantity || 1,
          image: order.img || "",
        },
      ] as OrderItem[];
    }
    return [];
  };

  function formatDateField(d: any) {
    if (!d) return "";
    if (d.toDate) return new Date(d.toDate()).toLocaleString();
    try {
      return new Date(d).toLocaleString();
    } catch {
      return String(d);
    }
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
          <li
            className={`menu-item ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            <i className="fas fa-box"></i>
            <span>Mahsulotlar</span>
          </li>
          <li
            className={`menu-item ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <i className="fas fa-shopping-cart"></i>
            <span>Buyurtmalar</span>
          </li>
          <li
            className={`menu-item ${activeTab === "delivered" ? "active" : ""}`}
            onClick={() => setActiveTab("delivered")}
          >
            <i className="fas fa-check-circle"></i>
            <span>Yetkazilganlar</span>
          </li>
          <li
            className={`menu-item ${activeTab === "blog" ? "active" : ""}`}
            onClick={() => setActiveTab("blog")}
          >
            <i className="fas fa-blog"></i>
            <span>Blog</span>
          </li>
          <li className="menu-item">
            <i className="fas fa-list"></i>
            <span>Kategoriyalar</span>
          </li>
        </ul>
      </div>

      <div className="main-content">
        <div
          className="content-header"
          style={{ alignItems: "flex-start", gap: 12 }}
        >
          <h1>
            {activeTab === "products"
              ? "Products Management"
              : activeTab === "orders"
              ? "Buyurtmalar"
              : activeTab === "delivered"
              ? "Yetkazilgan buyurtmalar"
              : "Blog Posts"}
          </h1>
          {activeTab === "products" && (
            <button
              className="add-product-btn"
              onClick={() => setIsAddModalOpen(true)}
            >
              <i className="fas fa-plus"></i> Add New Product
            </button>
          )}
          {activeTab === "blog" && (
            <button
              className="add-product-btn"
              onClick={openAddBlogModal}
              style={{ marginLeft: 8 }}
            >
              <i className="fas fa-plus"></i> Yangi post
            </button>
          )}
        </div>

        {/* Product Add Modal (existing) */}
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

        {/* Blog add/edit modal */}
        <Rodal
          visible={isBlogModalOpen}
          onClose={() => {
            setIsBlogModalOpen(false);
            setEditingBlogId(null);
          }}
          customStyles={{
            width: 760,
            padding: 20,
            borderRadius: 8,
            height: "max-content",
          }}
        >
          <form onSubmit={saveBlog} className="rodal-form">
            <h3 style={{ marginTop: 0 }}>
              {editingBlogId ? "Edit blog post" : "New blog post"}
            </h3>
            <div style={{ display: "flex", gap: 12, flexDirection: "column" }}>
              <input
                value={blogForm.name}
                onChange={(e) =>
                  setBlogForm((s) => ({ ...s, name: e.target.value }))
                }
                placeholder="Title"
                className="rodal-input"
              />
              <input
                value={blogForm.img}
                onChange={(e) =>
                  setBlogForm((s) => ({ ...s, img: e.target.value }))
                }
                placeholder="Image URL (optional)"
                className="rodal-input"
              />
              <textarea
                value={blogForm.fulldescription}
                onChange={(e) =>
                  setBlogForm((s) => ({
                    ...s,
                    fulldescription: e.target.value,
                  }))
                }
                placeholder="Full description"
                className="rodal-textarea"
                style={{ minHeight: 180 }}
              />
            </div>

            <div className="rodal-actions" style={{ marginTop: 12 }}>
              <button
                type="submit"
                className="rodal-btn save"
                disabled={blogSaving}
              >
                {blogSaving ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setBlogForm({ name: "", fulldescription: "", img: "" });
                }}
                className="rodal-btn reset"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsBlogModalOpen(false);
                  setEditingBlogId(null);
                }}
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

        {/* Products tab */}
        {activeTab === "products" && (
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
        )}

        {/* Orders tab */}
        {activeTab === "orders" && (
          <div className="orders-content">
            {ordersLoading ? (
              <div className="loading">Buyurtmalar yuklanmoqda...</div>
            ) : (
              <div className="orders-grid">
                {orders
                  .filter((o) => o.status !== "cancelled")
                  .map((order) => {
                    const items = renderOrderItems(order);
                    const total =
                      order.total ??
                      items.reduce((s, it) => s + it.price * it.quantity, 0);
                    const fullName =
                      order.personfullname || order.fullName || "";
                    const phone = order.personnumber || order.phone || "";
                    const address = order.personlocation || order.address || "";
                    return (
                      <div key={order.id} className="order-card">
                        <div className="order-header">
                          <h3>{fullName || "No name"}</h3>
                          <p>{formatDateField(order.createdAt)}</p>
                        </div>
                        <div className="order-info">
                          <p>
                            <strong>Tel:</strong> {phone}
                          </p>
                          <p>
                            <strong>Manzil:</strong> {address}
                          </p>
                          {order.message && (
                            <p>
                              <strong>Xabar:</strong> {order.message}
                            </p>
                          )}
                        </div>
                        <div className="order-items">
                          {items.map((item, i) => (
                            <div key={i} className="order-item">
                              <Image
                                src={item.image || "/placeholder.jpg"}
                                alt={item.name}
                                width={50}
                                height={50}
                                className="order-item-image"
                              />
                              <span>
                                {item.name} x {item.quantity}
                              </span>
                              <span>${item.price * item.quantity}</span>
                            </div>
                          ))}
                          <div className="order-total">Jami: ${total}</div>
                        </div>
                        <div className="order-actions">
                          <button
                            className="deliver-btn"
                            onClick={() =>
                              handleOrderStatus(order.id, "delivered")
                            }
                          >
                            Yetkazildi
                          </button>
                          <button
                            className="cancel-btn"
                            onClick={() =>
                              handleOrderStatus(order.id, "cancelled")
                            }
                          >
                            Bekor qilish
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* Delivered tab */}
        {activeTab === "delivered" && (
          <div className="orders-content">
            {ordersLoading ? (
              <div className="loading">Yuklanmoqda...</div>
            ) : (
              <div className="orders-grid">
                {deliveredOrders.map((order) => {
                  const items = renderOrderItems(order);
                  const total =
                    order.total ??
                    items.reduce((s, it) => s + it.price * it.quantity, 0);
                  const fullName = order.personfullname || order.fullName || "";
                  const phone = order.personnumber || order.phone || "";
                  const address = order.personlocation || order.address || "";
                  return (
                    <div key={order.id} className="order-card delivered">
                      <div className="order-header">
                        <h3>{fullName || "No name"}</h3>
                        <p>{formatDateField(order.deliveredAt)}</p>
                      </div>
                      <div className="order-info">
                        <p>
                          <strong>Tel:</strong> {phone}
                        </p>
                        <p>
                          <strong>Manzil:</strong> {address}
                        </p>
                        {order.message && (
                          <p>
                            <strong>Xabar:</strong> {order.message}
                          </p>
                        )}
                      </div>
                      <div className="order-items">
                        {items.map((item, i) => (
                          <div key={i} className="order-item">
                            <Image
                              src={item.image || "/placeholder.jpg"}
                              alt={item.name}
                              width={50}
                              height={50}
                              className="order-item-image"
                            />
                            <span>
                              {item.name} x {item.quantity}
                            </span>
                            <span>${item.price * item.quantity}</span>
                          </div>
                        ))}
                        <div className="order-total">Jami: ${total}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Blog tab */}
        {activeTab === "blog" && (
          <div className="content-body">
            {blogLoading ? (
              <div className="loading">Yuklanmoqda...</div>
            ) : (
              <div className="products-grid">
                {blogPosts.map((post) => (
                  <div key={post.id} className="product-card">
                    <div
                      style={{
                        width: "100%",
                        height: 200,
                        position: "relative",
                      }}
                    >
                      <Image
                        src={post.img || "/blogImg.png"}
                        alt={post.name || "Blog image"}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="product-info">
                      <h3>{post.name}</h3>
                      <p
                        className="blog-item-date-span"
                        style={{ fontSize: 12, color: "#6b7280" }}
                      >
                        {formatDateField(post.createdAt)}
                      </p>
                      <p
                        className="description"
                        style={{
                          marginTop: 8,
                          maxHeight: 120,
                          overflow: "hidden",
                        }}
                      >
                        {post.fulldescription}
                      </p>
                    </div>
                    <div className="product-actions">
                      <button
                        className="edit-btn"
                        onClick={() => startEditBlog(post)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => deleteBlog(post.id)}
                        disabled={blogDeletingId === post.id}
                      >
                        {blogDeletingId === post.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
