import Image from "next/image";

function Navbar() {
  return (
    <div className="flex">
      <Image src="/picnicLogo.png" alt="Logo" width={60} height={60} />
      <ul>
        <li>Bosh sahifa</li>
        <li>Mahsulotlar</li>
        <li>Aloqa</li>
        <li>Blog</li>
      </ul>
      <div>
        <input
          type="search"
          className="navInp"
          placeholder="Search for products..."
        />
        <Image src={"/cart.svg"} alt="Cart" width={24} height={24} />
      </div>
    </div>
  );
}

export default Navbar;
