"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Rodal from "rodal";
import "rodal/lib/rodal.css";
import { db } from "@/app/firebase/firebase.config";
import { collection, addDoc } from "firebase/firestore";

type CartItem = {
  id: string;
  name: string;
  price: number;
  img?: string;
  quantity: number;
};

function Savat() {
  const [visible, setVisible] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart");
      if (raw) setCartItems(JSON.parse(raw));
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } catch (e) {}
  }, [cartItems]);

  function show() {
    setVisible(true);
  }

  function closeModal() {
    setVisible(false);
    setFullName("");
    setEmail("");
    setPhone("");
    setMessage("");
  }

  function increase(index: number) {
    setCartItems((s) =>
      s.map((it, i) =>
        i === index ? { ...it, quantity: it.quantity + 1 } : it
      )
    );
  }
  function decrease(index: number) {
    setCartItems((s) =>
      s.map((it, i) =>
        i === index ? { ...it, quantity: Math.max(1, it.quantity - 1) } : it
      )
    );
  }
  function removeItem(index: number) {
    setCartItems((s) => s.filter((_, i) => i !== index));
  }

  const subtotal = cartItems.reduce((s, it) => s + it.price * it.quantity, 0);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      alert("Ism va telefon kiriting");
      return;
    }
    setSending(true);
    try {
      const payload = {
        personfullname: fullName,
        personnumber: phone,
        personlocation: email,
        message,
        items: cartItems.map((it) => ({
          id: it.id,
          name: it.name,
          price: it.price,
          quantity: it.quantity,
          image: it.img || "",
        })),
        total: subtotal,
        status: "pending",
        createdAt: new Date(),
      };
      await addDoc(collection(db, "buyurtma"), payload);
      alert("Buyurtma yuborildi");
      setCartItems([]);
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Buyurtma yuborilmadi");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="savat-main">
      <Rodal
        className="savat-rodal"
        visible={visible}
        onClose={closeModal}
        customStyles={{
          width: "max-content",
          height: "max-content",
          borderRadius: "20px",
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1 className="savat-rodal-h1">
          Buyurtma Berish Malumotlarini Kiriting
        </h1>
        <form className="savat-rodal-form" onSubmit={handleSubmit}>
          <div className="savat-rodal-inps">
            <label className="savat-rodal-label" htmlFor="#">
              Isim va Familiya
            </label>
            <input
              className="savat-rodal-inp"
              type="text"
              placeholder="To‘liq ism va familiyangizni kiriting"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="savat-rodal-inps">
            <label className="savat-rodal-label" htmlFor="#">
              Telefon raqami
            </label>
            <input
              className="savat-rodal-inp"
              type="text"
              placeholder="Telefon raqamingizni kiriting"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="savat-rodal-inps">
            <label className="savat-rodal-label" htmlFor="#">
              Manzil
            </label>
            <input
              className="savat-rodal-inp"
              type="text"
              placeholder="Manzilingizni kiriting"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="savat-rodal-inps">
            <label className="savat-rodal-label" htmlFor="#">
              Xabar
            </label>
            <textarea
              placeholder="Xabaringizni kiriting"
              className="savat-rodal-textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>
          <button className="savat-rodal-btn" type="submit" disabled={sending}>
            {sending ? "Yuborilmoqda..." : "Yuborish"}
          </button>
        </form>
      </Rodal>
      <div className="savat-container">
        <h1 className="savath1">Sizning savatingiz</h1>
        <div className="savat">
          <div className="savat-items">
            {cartItems.length === 0 && (
              <div className="empty">Savatingiz bosh</div>
            )}
            {cartItems.map((item, idx) => (
              <div className="savat-item" key={item.id}>
                <div className="savat-item-inner">
                  <Image
                    className="savat-item-img"
                    aria-hidden
                    src={item.img || "/tent1.png"}
                    alt="img"
                    width={150}
                    height={150}
                  />
                  <div className="savat-item-right">
                    <div className="savat-item-top">
                      <span>{item.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeItem(idx);
                        }}
                        className="savat-item-delete-btn"
                      >
                        <Image
                          src={"/deleteBtn.png"}
                          alt="del"
                          width={18}
                          height={19}
                        />
                      </button>
                    </div>
                    <div className="savat-item-bottom">
                      <span>${item.price}</span>
                      <div className="savat-item-count">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            decrease(idx);
                          }}
                        >
                          <Image
                            src={"/minus.png"}
                            alt="minus"
                            width={15}
                            height={15}
                          />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            increase(idx);
                          }}
                        >
                          <Image
                            src={"/plus.png"}
                            alt="plus"
                            width={13}
                            height={13}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <hr />
              </div>
            ))}
          </div>
          <div className="savat-summary">
            <h2 className="savat-summary-h2">Buyurtma xulosasi</h2>
            <div className="savat-summary-item">
              <span className="savat-summary-price-detail">oraliq Jami</span>
              <span className="savat-summary-price">${subtotal}</span>
            </div>
            <button
              className="savat-summary-btn"
              onClick={show}
              disabled={cartItems.length === 0}
            >
              Buyurtma berish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Savat;