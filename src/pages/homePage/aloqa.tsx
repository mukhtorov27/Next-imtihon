"use client";
import Image from "next/image";
import React, { useState } from "react";

function Aloqa() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setName("")
    setSurname("")
    setEmail("")
    setPhone("")
    setMessage("")
  }
  return (
    <div style={{ marginTop: "40px", marginBottom: "100px" }}>
      {/* <Image src="/aloqaImg.png" alt="Aloqa" width={1440} height={466} className='aloqaImg' /> */}
      <div className="aloqaImg">
        <h1 className="aloqah1">Biz bilan bog’laning </h1>
      </div>
      <div
        className="aloqa-data-section flex justify-around items-center mb-5"
        style={{ marginTop: "90px" }}
      >
        <div style={{ height: "400px", width: "570" }}>
          <p className="aloqaText1">Keling, biz bilan gaplashaylik</p>
          <p className="aloqaText2">
            Savollar, sharhlar yoki takliflar? Shaklni toldiring va biz tez
            orada boglanamiz.
          </p>
          <div style={{ width: "332px" }}>
            <p className="aloqa-data flex items-center gap-3">
              <Image
                aria-hidden
                src={"/geo.png"}
                alt="img"
                width={24}
                height={28}
              />
              1055 Arthur ave Elk Groot, 67. New Palmas South Carolina.
            </p>
            <p className="aloqa-data flex items-center gap-3">
              <Image
                aria-hidden
                src={"/phone.png"}
                alt="img"
                width={24}
                height={24}
              />
              +1 234 678 9108 99
            </p>
            <p className="aloqa-data flex items-center gap-3">
              <Image
                aria-hidden
                src={"/mail.png"}
                alt="img"
                width={24}
                height={24}
              />
              Contact@moralizer.com
            </p>
          </div>
        </div>
        <form action="#" className="card" onSubmit={(e) => handleSubmit(e)}>
          <div className="flex gap-5">
            <input
              type="text"
              className="aloqa-inp aloqa-input-1"
              placeholder="Ismingizni kiriting..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              className="aloqa-inp aloqa-input-1"
              placeholder="familiyangizni kiriting..."
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
          </div>
          <div className="aloqa-input-pasti">
            <input
              type="text"
              className="aloqa-inp aloqa-input-2"
              placeholder="emailingizni kiriting..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              className="aloqa-inp aloqa-input-2"
              placeholder="telefon raqamingizni kiriting..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <textarea
              className="aloqa-textarea"
              placeholder="Xabaringizni kiriting..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>
          <button className="aloqa-btn">send message</button>
        </form>
      </div>
    </div>
  );
}

export default Aloqa;
