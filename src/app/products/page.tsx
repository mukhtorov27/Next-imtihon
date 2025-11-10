"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { db } from "@/app/firebase/firebase.config";
import { collection, getDocs, addDoc } from "firebase/firestore";
import "../homePage.css";

interface Product {
  id: string;
  name?: string;
  price?: number;
  description?: string;
  img?: string[];
  category?: string;
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderingId, setOrderingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = collection(db, "products");
        const snap = await getDocs(q);
        const items = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        })) as Product[];
        setProducts(items);

        // Filter products if search query exists
        if (searchQuery) {
          const filtered = items.filter(
            (product) =>
              product.name?.toLowerCase().includes(searchQuery) ||
              product.description?.toLowerCase().includes(searchQuery)
          );
          setFilteredProducts(filtered);
        } else {
          setFilteredProducts(items);
        }
      } catch (err) {
        console.error("Fetch products error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery]);

  async function handleOrder(product: Product) {
    if (!product) return;
    try {
      setOrderingId(product.id || "ordering");
      const payload = {
        name: product.name || "",
        img: product.img && product.img.length ? product.img[0] : "",
        price: product.price ?? 0,
        quantity: 1,
        personfullname: "",
        personnumber: "",
        personlocation: "",
        message: "",
        status: "pending",
        createdAt: new Date(),
      };
      await addDoc(collection(db, "buyurtma"), payload);
      alert("Buyurtma yuborildi");
    } catch (err) {
      console.error("Order failed:", err);
      alert("Buyurtma jo'natishda xatolik yuz berdi");
    } finally {
      setOrderingId(null);
    }
  }

  return (
    <div className="productsPage">
      {searchQuery && (
        <div className="searchResults">
          <h2>Qidiruv natijalari: {searchQuery}</h2>
          {filteredProducts.length === 0 && !loading && (
            <p>Mahsulotlar topilmadi</p>
          )}
        </div>
      )}

      <div className="cartBox mb-32">
        <div className="carts justify-center">
          {loading ? (
            <div className="loading">Mahsulotlar yuklanmoqda...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty">Mahsulotlar topilmadi</div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="cartSection"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Link
                  href={`/mahsulot/${product.id}`}
                  className="cartClickable"
                >
                  <div className="cartImg">
                    <Image
                      src={
                        product.img && product.img.length
                          ? product.img[0]
                          : "/tent1.png"
                      }
                      alt={product.name || "Product"}
                      width={295}
                      height={200}
                      className="rounded-[20px]"
                      style={{ backgroundColor: "#E9F8EC" }}
                    />
                  </div>
                  <p className="cartName">{product.name || "No name"}</p>
                  {product.description && (
                    <p className="cartDescription">
                      {product.description.length > 100
                        ? `${product.description.slice(0, 100)}...`
                        : product.description}
                    </p>
                  )}
                </Link>

                <div className="cartAddSection">
                  <span className="productPrice">${product.price ?? "—"}</span>
                  <div>
                    <button
                      aria-label="add-to-cart"
                      onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (orderingId) return;
                        await handleOrder(product);
                      }}
                      disabled={orderingId === product.id}
                      className={`cartAddButton ${
                        orderingId === product.id ? "disabled" : ""
                      }`}
                    >
                      <Image
                        src="/cartAdd.svg"
                        alt="Add to Cart"
                        width={16}
                        height={16}
                      />
                    </button>
                  </div>
                </div>

                {/* {product.category && (
                  <div className="productCategory">
                    <span>{product.category}</span>
                  </div>
                )} */}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
