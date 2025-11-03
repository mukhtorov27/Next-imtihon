import Image from 'next/image';
import React from 'react'

function Blog() {
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
        <button className='blog-content-btn'>
          <div className="blog-item">
            <Image src="/blogImg.png" alt="img" width={380} height={253} />
            <p className="blog-item-p">
              Tabiatning Qiziqarli Jihatlari: Sarg‘aygan Amazon O‘rmonlari Haqida
              Qiziqarli Faktlar
            </p>
            <div className="blog-item-date">
              <span className="blog-item-date-span">
                Payshanba, 2024-yil 8-yanvar
              </span>
            </div>
          </div>
        </button>
        <button className='blog-content-btn'>
          <div className="blog-item">
            <Image src="/blogImg.png" alt="img" width={380} height={253} />
            <p className="blog-item-p">
              Tabiatning Qiziqarli Jihatlari: Sarg‘aygan Amazon O‘rmonlari Haqida
              Qiziqarli Faktlar
            </p>
            <div className="blog-item-date">
              <span className="blog-item-date-span">
                Payshanba, 2024-yil 8-yanvar
              </span>
            </div>
          </div>
        </button>
        <button className='blog-content-btn'>
          <div className="blog-item">
            <Image src="/blogImg.png" alt="img" width={380} height={253} />
            <p className="blog-item-p">
              Tabiatning Qiziqarli Jihatlari: Sarg‘aygan Amazon O‘rmonlari Haqida
              Qiziqarli Faktlar
            </p>
            <div className="blog-item-date">
              <span className="blog-item-date-span">
                Payshanba, 2024-yil 8-yanvar
              </span>
            </div>
          </div>
        </button>
        <button className='blog-content-btn'>
          <div className="blog-item">
            <Image src="/blogImg.png" alt="img" width={380} height={253} />
            <p className="blog-item-p">
              Tabiatning Qiziqarli Jihatlari: Sarg‘aygan Amazon O‘rmonlari Haqida
              Qiziqarli Faktlar
            </p>
            <div className="blog-item-date">
              <span className="blog-item-date-span">
                Payshanba, 2024-yil 8-yanvar
              </span>
            </div>
          </div>
        </button>
        <button className='blog-content-btn'>
          <div className="blog-item">
            <Image src="/blogImg.png" alt="img" width={380} height={253} />
            <p className="blog-item-p">
              Tabiatning Qiziqarli Jihatlari: Sarg‘aygan Amazon O‘rmonlari Haqida
              Qiziqarli Faktlar
            </p>
            <div className="blog-item-date">
              <span className="blog-item-date-span">
                Payshanba, 2024-yil 8-yanvar
              </span>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

export default Blog