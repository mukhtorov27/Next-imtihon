import Image from "next/image";
import HomePage from "./homePage/homePage";

function Navbar() {
  return (
    <div>
        <div className="flex justify-center gap-[241px] items-center px-16 py-6 border-b border-gray-300 fixed top-0 left-0 right-0 bg-white z-50">
            <Image src="/picnicLogo.png" alt="Logo" width={60} height={60} />
            <ul className="flex gap-9">
              <li>Bosh sahifa</li>
              <li>Mahsulotlar</li>
              <li>Aloqa</li>
              <li>Blog</li>
            </ul>
            <div className="flex text-center gap-4">
              <input
                type="search"
                className="navInp outline-0"
                placeholder="Search for products..."
              />
              <Image src={"/cart.svg"} alt="Cart" width={24} height={24} />
            </div>
        </div>
      
      <HomePage />
    </div>
  );
}

export default Navbar;
