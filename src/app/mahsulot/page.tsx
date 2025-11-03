import Image from "next/image";
import React from "react";
import "../homePage.css";
function Mahsulot() {
  return (
    <div>
      <div className="product-box">
        <div className="left-side-img">
          <div className="flex flex-col gap-4">
            <Image
              src="/tent1.png"
              alt="Tent"
              width={120}
              height={120}
              className="rounded-[20px]"
              style={{ backgroundColor: "#E9F8EC" }}
            />
            <Image
              src="/tent1.png"
              alt="Tent"
              width={120}
              height={120}
              className="rounded-[20px]"
              style={{ backgroundColor: "#E9F8EC" }}
            />
            <Image
              src="/tent1.png"
              alt="Tent"
              width={120}
              height={100}
              className="rounded-[20px]"
              style={{ backgroundColor: "#E9F8EC" }}
            />
            <div className="w-[120px]">
              <Image
                src="/tent1.png"
                alt="Tent"
                width={120}
                height={100}
                className="rounded-[20px]"
                style={{ backgroundColor: "#E9F8EC" }}
              />
            </div>
          </div>
        <div className="w-[444px] h-[530px]">
            <Image
              src="/tent1.png"
              alt="Tent Main"
              width={444}
              height={530}
              className="rounded-[20px]"
              style={{ backgroundColor: "#E9F8EC" ,height: '100%'}}
            />
        </div>
        </div>
        <div>
          <h1 className="product-h1">Katta va Qulay Sayohat Chodiri</h1>
          <p className="product-p1 flex gap-3 items-center">
            $260 <span className="line-through text-gray-400">$300</span>
            <Image src="/skidka.png" alt="skidka" width={72} height={34} />
          </p>
          <div className="product-desc">
            <div className="flex">
              <p className="product-desc-p m-0 p-0npm run dev
              ">
                Yuqori sifatli materiallar:
                <span className="product-desc-span">
                  Ushbu chodir suvga chidamli va bardoshli materiallardan ishlab
                  chiqarilgan bo‘lib, u sizni yomg‘irli va shamolli ob-havoda
                  ishonchli himoya qiladi.
                </span>
              </p>
            </div>
            <div className="product-desc-mt flex">
              <p className="product-desc-p">
                Keng ichki hajm:
                <span className="product-desc-span">
                   Ichki hajmi katta bo‘lib, bir nechta odam yoki oilangiz uchun
                  yetarli joy taqdim etadi. Yotish, dam olish va jihozlaringizni
                  joylashtirish uchun qulay.
                </span>
              </p>
            </div>
            <div className="product-desc-mt flex">
              <p className="product-desc-p">
                Oson o‘rnatish:
                <span className="product-desc-span">
                  Chodirni tez va oson o‘rnatish mumkin, bu uni tajribali
                  sayohatchilar ham, yangi boshlovchilar uchun ham ideal qiladi.
                  Yig‘ishtirish ham oddiy va ixchamdir, bu uni olib yurishni
                  osonlashtiradi.
                </span>
              </p>
            </div>
          </div>
          <div className="product-buttons">
            <div className="product-number-buttons flex text-center">
              <button><Image src="/minus.png" alt="Buy Now" width={24} height={24} /></button>
              <p>1</p>
              <button><Image src="/plus.png" alt="Buy Now" width={24} height={24} /></button>
            </div>
            <button className="product-add-button">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mahsulot;
