"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/app/firebase/firebase.config";
import { collection, getDocs } from "firebase/firestore";
import "../homePage.css";

interface Product {
  id: string;
  name?: string;
  price?: number;
  description?: string;
  img?: string[];
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CartsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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
      } catch (err) {
        console.error("Fetch products error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();

    const cartItem: CartItem = {
      id: product.id,
      name: product.name || "No name",
      price: product.price || 0,
      quantity: 1,
      image: product.img && product.img.length ? product.img[0] : "/tent1.png",
    };

    const existingCart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    ) as CartItem[];

    const existingItemIndex = existingCart.findIndex(
      (item) => item.id === product.id
    );

    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].quantity += 1;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    alert("Mahsulot savatga qo'shildi!");
  };

  return (
    <div className="cartBox mb-32">
      <div className="carts justify-center">
        {loading ? (
          <div className="loading">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="empty">No products found</div>
        ) : (
          products.map((product) => (
            <Link
              key={product.id}
              href={`/mahsulot/${product.id}`}
              className="cartSection"
              style={{
                textDecoration: "none",
                color: "inherit",
                cursor: "pointer",
              }}
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
              <div className="cartRating">rating</div>
              <div className="cartAddSection">
                <span>${product.price ?? "—"}</span>
                <div>
                  <button
                    aria-label="add-to-cart"
                    onClick={(e) => addToCart(e, product)}
                    className="cart-add-btn"
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
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
