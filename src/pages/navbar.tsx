"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

function Navbar() {
  const [underline, setUnderline] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div>
      <div className="navbar">
        <div className="logo">
          <Image
            src="/picnicLogo.png"
            alt="Logo"
            width={60}
            height={60}
            aria-label="Logo"
          />
        </div>
        <ul className="navLinks">
          <li>
            <Link
              onClick={() => {
                setUnderline(0);
              }}
              href="/homePage"
              style={{
                textDecoration: `${underline === 0 ? "underline" : "none"}`,
              }}
            >
              Bosh sahifa
            </Link>
          </li>
          <li>
            <Link
              onClick={() => {
                setUnderline(1);
              }}
              href="/products"
              style={{
                textDecoration: `${underline === 1 ? "underline" : "none"}`,
              }}
            >
              Mahsulotlar
            </Link>
          </li>
          <li>
            <Link
              onClick={() => {
                setUnderline(2);
              }}
              href="/aloqa"
              style={{
                textDecoration: `${underline === 2 ? "underline" : "none"}`,
              }}
            >
              Aloqa
            </Link>
          </li>
          <li>
            <Link
              onClick={() => {
                setUnderline(3);
              }}
              href="/blog"
              style={{
                textDecoration: `${underline === 3 ? "underline" : "none"}`,
              }}
            >
              Blog
            </Link>
          </li>
        </ul>
        <div className="searchDiv">
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="search"
              className="navInp outline-0"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="flex text-center searchBtn">
              <button type="submit" className="cursor-pointer">
                <Image
                  src={"/searchButton.png"}
                  alt="Search"
                  width={24}
                  height={24}
                />
              </button>
            </div>
          </form>
          <div className="flex text-center">
            <button className="cursor-pointer">
              <Link href="/savat">
                <Image src={"/cart.svg"} alt="Cart" width={24} height={24} />
              </Link>
            </button>
          </div>
          <div className="flex text-center menuButton">
            <button className="cursor-pointer">
              <Link href="/savat">
                <Image src={"/menu.png"} alt="User" width={24} height={24} />
              </Link>
            </button>
          </div>
        </div>
      </div>

      <div style={{ paddingTop: "64px" }}>{/* <HomePage /> */}</div>
    </div>
  );
}

export default Navbar;
