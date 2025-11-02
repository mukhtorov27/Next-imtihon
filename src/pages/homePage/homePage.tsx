import Image from "next/image";
import "./homePage.css";
import CartsPage from "./carts";
// import Footer from "./footer";
function HomePage() {
  return (
    <div className="heroSection">
      <div className="heroWrapper">
        <div className="heroContent">
          <h1 className="heroHeaderText">
            Zo&apos;r jihozlar bilan sarguzashtlarni kashf eting
          </h1>
          <p className="heroText">
            Sarguzasht ishqibozlari uchun moʻljallangan ochiq havoda kerakli
            jihozlarimizni kashf eting. Yuqori sifatli chodirlardan qulay lager
            anjomlarigacha, hammasi sizning tajribangizni yuksaltirish uchun.
          </p>
          <button className="heroBtn">Xarid qiling</button>
          <div className="ratingBox">
            <div className="rating1">
              <h1 className="textH1">
                200<span className="textSpan">+</span>
              </h1>
              <p className="textP">Xalqaro brendlar</p>
            </div>
            <div className="heroDecor">
              <span className="slanted-line" aria-hidden="true" />
            </div>
            <div className="rating2">
              <h1 className="textH1">
                2,000<span className="textSpan">+</span>
              </h1>
              <p className="textP">Yuqori Sifatli Mahsulotlar</p>
            </div>
            <div className="heroDecor">
              <span className="slanted-line" aria-hidden="true" />
            </div>
            <div className="rating3">
              <h1 className="textH1">
                30,000<span className="textSpan">+</span>
              </h1>
              <p className="textP">Baxtli mijozlar</p>
            </div>
          </div>
        </div>

        <div>
          <Image src="/tent.png" alt="Hero Image" width={614} height={463} />
        </div>
      </div>
      <CartsPage/>
      {/* <Footer/> */}
    </div>
  );
}

export default HomePage;
