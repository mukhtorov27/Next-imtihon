"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import Rodal from 'rodal'
import "rodal/lib/rodal.css";
function Savat() {
  const [visible,setVisible]=useState(false)
  const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
  function show() {
    setVisible(true);
  }
  function handleSubmit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    setVisible(false);
    setFullName("")
    setEmail("")
    setPhone("")
    setMessage("")
  }
  return (
    <div className="savat-main">
      <Rodal
      className='savat-rodal'
        visible={visible}
        onClose={() => {
          setVisible(false);
          setFullName("")
          setEmail("")
          setPhone("")
          setMessage("")
        }}
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
        <h1 className='savat-rodal-h1'>Buyurtma Berish Malumotlarini Kiriting</h1>
        <form action="#" className="savat-rodal-form" onSubmit={(e)=>{handleSubmit(e)}}>
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
          <button className="savat-rodal-btn" type="submit">
            Yuborish
          </button>
        </form>
      </Rodal>
      <div className="savat-container">
        <h1 className="savath1">Sizning savatingiz</h1>
        <div className="savat">
          <div className="savat-items">
            <div className="savat-item">
              <div className="savat-item-inner">
                <Image
                  className="savat-item-img"
                  aria-hidden
                  src={"/tent1.png"}
                  alt="img"
                  width={150}
                  height={150}
                />
                <div className="savat-item-right">
                  <div className="savat-item-top">
                    <span>chodir</span>
                    <Image
                      className="savat-item-delete-img"
                      aria-hidden
                      src={"/deleteBtn.png"}
                      alt="img"
                      width={18}
                      height={19}
                    />
                  </div>
                  <div className="savat-item-bottom">
                    <span>$100</span>
                    <div className="savat-item-count">
                      <button>
                        <Image
                          src={"/minus.png"}
                          alt="img"
                          width={15}
                          height={15}
                        />
                      </button>
                      <span>1</span>
                      <button>
                        <Image
                          src={"/plus.png"}
                          alt="img"
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
            <div className="savat-item">
              <div className="savat-item-inner">
                <Image
                  className="savat-item-img"
                  aria-hidden
                  src={"/tent1.png"}
                  alt="img"
                  width={150}
                  height={150}
                />
                <div className="savat-item-right">
                  <div className="savat-item-top">
                    <span>chodir</span>
                    <Image
                      className="savat-item-delete-img"
                      aria-hidden
                      src={"/deleteBtn.png"}
                      alt="img"
                      width={18}
                      height={19}
                    />
                  </div>
                  <div className="savat-item-bottom">
                    <span>$100</span>
                    <div className="savat-item-count">
                      <button>
                        <Image
                          src={"/minus.png"}
                          alt="img"
                          width={15}
                          height={15}
                        />
                      </button>
                      <span>1</span>
                      <button>
                        <Image
                          src={"/plus.png"}
                          alt="img"
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
            <div className="savat-item">
              <div className="savat-item-inner">
                <Image
                  className="savat-item-img"
                  aria-hidden
                  src={"/tent1.png"}
                  alt="img"
                  width={150}
                  height={150}
                />
                <div className="savat-item-right">
                  <div className="savat-item-top">
                    <span>chodir</span>
                    <Image
                      className="savat-item-delete-img"
                      aria-hidden
                      src={"/deleteBtn.png"}
                      alt="img"
                      width={18}
                      height={19}
                    />
                  </div>
                  <div className="savat-item-bottom">
                    <span>$100</span>
                    <div className="savat-item-count">
                      <button>
                        <Image
                          src={"/minus.png"}
                          alt="img"
                          width={15}
                          height={15}
                        />
                      </button>
                      <span>1</span>
                      <button>
                        <Image
                          src={"/plus.png"}
                          alt="img"
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
          </div>
          <div className="savat-summary">
            <h2 className="savat-summary-h2">Buyurtma xulosasi</h2>
            <div className="savat-summary-item">
              <span className="savat-summary-price-detail">oraliq Jami</span>
              <span className="savat-summary-price">$300</span>
            </div>
            <button className="savat-summary-btn" onClick={show}>Buyurtma berish</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Savat