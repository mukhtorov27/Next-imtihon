import Image from "next/image"

function Navbar() {
  return (
    <div>
      <Image src="/picnicLogo.png" alt="Logo" width={60} height={60} />
      <ul>
        <li>Bosh sahifa</li>
        <li>Mahsulotlar</li>
        <li>Aloqa</li>
        <li>Blog</li>
      </ul>
      <div>
        <input type="search" className="navInp" />
      </div>
    </div>
  );
}

export default Navbar