"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/app/firebase/firebase.config";
import { doc, getDoc } from "firebase/firestore";

interface BlogPost {
  id: string;
  name?: string;
  fulldescription?: string;
  img?: string;
  createdAt?: any;
}

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Not found");
      setLoading(false);
      return;
    }
    const fetchPost = async () => {
      setLoading(true);
      try {
        const ref = doc(db, "blog", id);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          setError("Post topilmadi");
          setPost(null);
        } else {
          setPost({ id: snap.id, ...(snap.data() as any) });
        }
      } catch (e) {
        console.error(e);
        setError("Yuklashda xatolik");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  function formatDate(createdAt: any) {
    if (!createdAt) return "";
    if (createdAt.toDate) return new Date(createdAt.toDate()).toLocaleString();
    try {
      return new Date(createdAt).toLocaleString();
    } catch {
      return String(createdAt);
    }
  }

  if (loading) return <div className="loading">Yuklanmoqda...</div>;
  if (error) return <div className="empty">{error}</div>;
  if (!post) return <div className="empty">Post topilmadi</div>;

  return (
    <div className="blogPage" style={{ paddingTop: 24 }}>
      <div
        className="blog-title"
        style={{ textAlign: "left", maxWidth: 980, margin: "0 auto 20px" }}
      >
        <h1 className="blog-title-h1">{post.name}</h1>
        <div
          style={{
            marginTop: 12,
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          <span className="blog-item-date-span">
            {formatDate(post.createdAt)}
          </span>
          <button
            onClick={() => router.back()}
            style={{
              marginLeft: "auto",
              padding: "6px 12px",
              borderRadius: 6,
              border: "1px solid #e5e7eb",
              background: "#fff",
            }}
          >
            Orqaga
          </button>
        </div>
      </div>

      <div
        className="blog-content"
        style={{ maxWidth: 980, margin: "0 auto", display: "block" }}
      >
        <div className="blog-item" style={{ display: "block" }}>
          {post.img ? (
            <Image
              src={post.img}
              alt={post.name || "Blog image"}
              width={980}
              height={520}
              unoptimized
            />
          ) : (
            <Image src="/blogImg.png" alt="img" width={980} height={520} />
          )}

          <p className="blog-item-p" style={{ fontSize: 22, marginTop: 18 }}>
            {post.name}
          </p>

          {post.fulldescription && (
            <div
              className="description"
              style={{ marginTop: 14, color: "#374151", lineHeight: 1.8 }}
            >
              {post.fulldescription}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
