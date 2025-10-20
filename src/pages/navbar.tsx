import Image from "next/image";
import HomePage from "./homePage/homePage";

function Navbar() {
  return (
    <div>
      <div className="navbar">
        <Image src="/picnicLogo.png" alt="Logo" width={60} height={60} />
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
          <button className="cursor-pointer">
            <Image src={"/cart.svg"} alt="Cart" width={24} height={24} />
          </button>
        </div>
      </div>

      <HomePage />
    </div>
  );
}

export default Navbar;
