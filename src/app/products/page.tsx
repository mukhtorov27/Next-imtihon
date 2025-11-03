"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
// import AccordionPage from "../../pages/homePage/accordion";
import { db } from "@/app/firebase/firebase.config";
import { collection, getDocs } from "firebase/firestore";

interface Product {
  id: string;
  name?: string;
  price?: number;
  description?: string;
  img?: string[]; 
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

  return (
    <div className="cartBox">
      <div className="carts justify-center">
        {loading ? (
          <div className="loading">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="empty">No products found</div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="cartSection">
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
                  <button>
                    <Image
                      src="/cartAdd.svg"
                      alt="Add to Cart"
                      width={16}
                      height={16}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* <AccordionPage /> */}
    </div>
  );
}