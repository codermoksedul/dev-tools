import menuData from "@/data/menu-data.json";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  FaAngleDown,
  FaAngleLeft,
  FaAngleRight,
  FaAngleUp,
} from "react-icons/fa";

type MenuItem = {
  label: string;
  url: string;
  submenu?: MenuItem[];
};

function Menu() {
  const pathname = usePathname();
  const [isNavbarOpen, setIsNavbarOpen] = useState<boolean>(false);
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
  const submenuRefs = useRef<(HTMLUListElement | null)[]>([]);

  const toggleSubMenu = (index: number) => {
    setActiveSubmenu((prevIndex) => (prevIndex === index ? null : index));
  };

  const closeNavbar = () => {
    setIsNavbarOpen((prevState) => !prevState);
    const navbarMenu = document.getElementById("navbar_menu");
    if (navbarMenu) {
      navbarMenu.classList.toggle("active_navbar_menu");
    }
  };

  const handleSubmenuItemClick = () => {
    setActiveSubmenu(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        submenuRefs.current.every((ref) => !ref?.contains(event.target as Node))
      ) {
        setActiveSubmenu(null);
      }
    };

    if (activeSubmenu !== null) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [activeSubmenu]);

  return (
    <menu
      id="navbar_menu"
      className="lg:block fixed lg:static p-[40px] py-[50px] w-full top-0 lg:p-0  lg:w-auto min-h-screen lg:min-h-0 bg-slate-800/95 lg:bg-transparent lg:dark:bg-transparent"
    >
      <ul className="flex flex-col gap-[30px] lg:flex-row lg:gap-[20px] xl:gap-[30px] text-[16px] font-medium mt-0 justify-center items-start">
        {menuData.map((item: MenuItem, index: number) => (
          <li
            key={index}
            className={`menu_item relative ${
              pathname === item.url ? "active heading_title" : "header_link"
            }`}
          >
            <div className="flex items-center">
              {item.submenu ? (
                <span
                  onClick={() => toggleSubMenu(index)}
                  className="header_menu_link cursor-pointer"
                >
                  {item.label}
                  <span
                    className="submenu_icon cursor-pointer text-sm lg:text-xs"
                    onClick={() => toggleSubMenu(index)}
                  >
                    {activeSubmenu === index ? <FaAngleUp /> : <FaAngleDown />}
                  </span>
                </span>
              ) : (
                <Link href={item.url} className="header_menu_link">
                  {item.label}
                </Link>
              )}
            </div>
            {item.submenu && activeSubmenu === index && (
              <ul
                className="submenu dark:dark_submenu lg:absolute bg-white/95 dark:bg-dark-bg-color/95 backdrop-blur-sm dark:border-slate-700 lg:border border-slate-100 left-0 mt-2 rounded-md min-w-[250px]"
                ref={(el) => {
                  submenuRefs.current[index] = el;
                }}
                tabIndex={0}
              >
                {item.submenu.map((subitem, subindex) => (
                  <li
                    key={subindex}
                    className={`submenu_item flex flex-col justify-center items-start gap-2 ${
                      pathname === subitem.url
                        ? "active text-primary-color"
                        : "header_link"
                    }`}
                  >
                    <Link
                      href={subitem.url}
                      className="submenu_link flex flex-row justify-start items-center gap-1 group transition-all duration-300 hover:gap-2"
                      onClick={handleSubmenuItemClick}
                    >
                      <FaAngleRight className="text-xs group-hover:hidden transition-all duration-300" />
                      <FaAngleLeft className="text-primary-color text-xs group-hover:block hidden transition-all duration-300 -ml-2 group-hover:-ml-0" />
                      {subitem.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <button
        onClick={closeNavbar}
        className="mobile_menu_close text-xl absolute right-8 top-7 lg:hidden hover:text-secondary-color hover:rotate-90 transition-all duration-500"
      >
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </span>
      </button>
    </menu>
  );
}

export default Menu;
