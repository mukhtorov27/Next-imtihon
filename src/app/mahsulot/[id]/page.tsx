"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/app/firebase/firebase.config";
import { doc, getDoc } from "firebase/firestore";
import "../../homePage.css";

interface Product {
  id: string;
  name?: string;
  price?: number;
  description?: string;
  img?: string[];
  category?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const d = await getDoc(doc(db, "products", id));
        if (d.exists())
          setProduct({ id: d.id, ...(d.data() as any) } as Product);
        else setProduct(null);
      } catch (err) {
        console.error("Fetch product error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (!id) return <div className="loading">Product ID missing</div>;
  if (loading) return <div className="loading">Loading product...</div>;
  if (!product)
    return (
      <div className="empty">
        Product not found
        <div style={{ marginTop: 12 }}>
          <button onClick={() => router.back()} className="edit-btn">
            Go Back
          </button>
        </div>
      </div>
    );

  return (
    <div style={{ padding: 50 }}>
      <div className="product-box" style={{ gap: 24 }}>
        <div className="left-side-img" style={{ display: "flex", gap: 16 }}>
          <div className="flex flex-col gap-4" style={{ minWidth: 120 }}>
            {(product.img && product.img.length ? product.img : ["/tent1.png"])
              .slice(0, 4)
              .map((src, i) => (
                <Image
                  key={i}
                  src={src}
                  alt={product.name || "img"}
                  width={120}
                  height={120}
                  className="rounded-[20px]"
                  style={{
                    backgroundColor: "#E9F8EC",
                    cursor: "pointer",
                    border: selectedImage === i ? "2px solid #16a34a" : "none",
                    padding: 2,
                  }}
                  onClick={() => setSelectedImage(i)}
                />
              ))}
          </div>

          <div style={{ width: 444, height: 530 }}>
            <Image
              src={
                product.img && product.img.length
                  ? product.img[selectedImage]
                  : "/tent1.png"
              }
              alt={product.name || ""}
              width={444}
              height={530}
              className="rounded-[20px]"
              style={{ backgroundColor: "#E9F8EC", height: "100%" }}
            />
          </div>
        </div>

        <div style={{ maxWidth: 540 }}>
          <h1 className="product-h1">{product.name || "No title"}</h1>
          <p className="product-p1 flex gap-3 items-center">
            ${product.price ?? "—"}
          </p>

          <div className="product-desc">
            <div className="product-desc-mt">
              <p className="product-desc-p">
                {product.description ?? "No description provided."}
              </p>
            </div>
            {product.category && (
              <p style={{ marginTop: 12, color: "#556", fontSize: 13 }}>
                Category: {product.category}
              </p>
            )}
          </div>

          <div className="product-buttons" style={{ marginTop: 16 }}>
            <div
              className="product-number-buttons flex text-center"
              style={{ alignItems: "center", gap: 12 }}
            >
              <button
                onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
                aria-label="decrease"
              >
                <Image src="/minus.png" alt="minus" width={24} height={24} />
              </button>
              <p>{quantity}</p>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="increase"
              >
                <Image src="/plus.png" alt="plus" width={24} height={24} />
              </button>
            </div>

            <div style={{ marginTop: 12 }}>
              <button
                className="product-add-button"
                onClick={() => alert(`Added ${quantity} items to cart`)}
              >
                Add to Cart
              </button>
              <button
                style={{ marginLeft: 8 }}
                className="edit-btn"
                onClick={() => router.back()}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
