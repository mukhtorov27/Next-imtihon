"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/app/firebase/firebase.config";
import { collection, getDocs } from "firebase/firestore";

interface BlogPost {
  id: string;
  name?: string;
  fulldescription?: string;
  img?: string;
  createdAt?: any;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const q = collection(db, "blog");
        const snap = await getDocs(q);
        const items = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        })) as BlogPost[];
        setPosts(items);
      } catch (err) {
        console.error("Fetch blog error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  function formatDate(createdAt: any) {
    if (!createdAt) return "";
    if (createdAt.toDate) return new Date(createdAt.toDate()).toLocaleString();
    try {
      return new Date(createdAt).toLocaleString();
    } catch {
      return String(createdAt);
    }
  }

  return (
    <div className="blogPage">
      <div className="blog-title">
        <h1 className="blog-title-h1">Sayohat va Lager Blogi</h1>
        <span className="blog-title-span">
          Sayohatni sevuvchilar uchun qiziqarli hikoyalar, foydali maslahatlar
          va lager hayoti haqida ko‘rsatmalar. Tabiatga yaqin bo‘lish va
          sayohatlaringizni unutilmas qilish uchun o‘z bilimlaringizni boyiting!
        </span>
      </div>

      <div className="blog-content">
        {loading && <div className="loading">Yuklanmoqda...</div>}
        {!loading && posts.length === 0 && <div className="empty">Hozircha postlar yoʻq</div>}
        {!loading &&
          posts.map((post) => (
            <Link
              key={post.id}
              href={`/blogPage/${post.id}`}
              className="blog-content-btn"
            >
              <div className="blog-item">
                {post.img ? (
                  <Image
                    src={post.img}
                    alt={post.name || "Blog image"}
                    width={380}
                    height={253}
                    unoptimized
                  />
                ) : (
                  <Image src="/blogImg.png" alt="img" width={380} height={253} />
                )}

                <p className="blog-item-p">{post.name || "No title"}</p>

                <div className="blog-item-date">
                  <span className="blog-item-date-span">{formatDate(post.createdAt)}</span>
                </div>

                {/* {post.fulldescription && <p className="description">{post.fulldescription.slice(0, 220)}{post.fulldescription.length>220 ? "..." : ""}</p>} */}
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}