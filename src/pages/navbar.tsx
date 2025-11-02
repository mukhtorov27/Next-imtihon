import Image from "next/image";
// import HomePage from "./homePage/homePage";
// import Footer from "./footer";

function Navbar() {
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
          <li>Bosh sahifa</li>
          <li>Mahsulotlar</li>
          <li>Aloqa</li>
          <li>Blog</li>
        </ul>
        <div className="searchDiv">
          <input
            type="search"
            className="navInp outline-0"
            placeholder="Search for products..."
          />
          <div className="flex text-center searchBtn">
            <button className="cursor-pointer">
              <Image
                src={"/searchButton.png"}
                alt="Search"
                width={24}
                height={24}
              />
            </button>
          </div>
          <div className="flex text-center">
            <button className="cursor-pointer">
              <Image src={"/cart.svg"} alt="Cart" width={24} height={24} />
            </button>
          </div>
          <div className="flex text-center menuButton">
            <button className="cursor-pointer">
              <Image src={"/menu.png"} alt="User" width={24} height={24} />
            </button>
          </div>
        </div>
      </div>

      <div style={{ paddingTop: '64px' }}>
        {/* <HomePage /> */}
      </div>
    </div>
  );
}

export default Navbar;
