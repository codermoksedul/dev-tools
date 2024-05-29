"use client";
import Link from "next/link";
import { HiMiniBars3BottomRight } from "react-icons/hi2";
import Menu from "./Menu";

function Header() {
  // Function to toggle the menu state
  const toggleMenu = () => {
    const navbarMenu = document.getElementById("navbar_menu");
    if (navbarMenu) {
      navbarMenu.classList.toggle("active_navbar_menu");
    }
  };

  return (
    <>
      <div className="header_area border-b border-slate-700 relative">
        <div className="container">
          <nav className="navbar h-[60px] flex flex-row justify-between items-center gap-5">
            <Link
              href="/"
              className="navbar_brand flex flex-row justify-start items-center gap-2 text-2xl font-medium text-primary-color"
            >
              Dev Tools
            </Link>
            <button
              className="block text-2xl transition-all duration-300 hover:text-primary-color lg:hidden"
              onClick={toggleMenu}
            >
              <HiMiniBars3BottomRight />
            </button>
            <Menu />
          </nav>
        </div>
      </div>
    </>
  );
}

export default Header;
