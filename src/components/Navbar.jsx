import Logo from "../assets/waiter.png";
import "../main.css";
const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo-container">
        <img className="logo" src={Logo} alt="Waiter logo" />
        <h2 className="heading-navbar">Order App</h2>
      </div>
    </nav>
  );
};

export default Navbar;
