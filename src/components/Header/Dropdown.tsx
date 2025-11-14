import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { Menu } from "@/types/Menu";

const Dropdown = ({ menuItem, stickyMenu }: { menuItem: Menu; stickyMenu: boolean }) => {
  const [dropdownToggler, setDropdownToggler] = useState(false);
  const pathUrl = usePathname();

  return (
    <li
      onClick={() => setDropdownToggler(!dropdownToggler)}
      className={`group relative before:w-0 before:h-[3px] before:bg-blue before:absolute before:left-[0px] before:top-0 before:rounded-b-[3px] before:ease-out before:duration-200 hover:before:w-full ${
        pathUrl.includes(menuItem.title) && "before:!w-full"
      }`}
    >
      <a
        href="#"
        className={`hover:text-blue text-sm font-medium text-dark flex items-center gap-1.5 transition-colors duration-200 ${
          stickyMenu ? "xl:py-2" : "xl:py-3"
        } ${pathUrl.includes(menuItem.title) && "!text-blue"}`}
      >
        {menuItem.title}
        <svg
          className="fill-current cursor-pointer transition-transform duration-300 ease-in-out"
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            transform: dropdownToggler ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.95363 5.67461C3.13334 5.46495 3.44899 5.44067 3.65866 5.62038L7.99993 9.34147L12.3412 5.62038C12.5509 5.44067 12.8665 5.46495 13.0462 5.67461C13.2259 5.88428 13.2017 6.19993 12.992 6.37964L8.32532 10.3796C8.13808 10.5401 7.86178 10.5401 7.67453 10.3796L3.00787 6.37964C2.7982 6.19993 2.77392 5.88428 2.95363 5.67461Z"
            fill="currentColor"
          />
        </svg>
      </a>

      {/* <!-- Dropdown Start --> */}
      <ul
        className={`dropdown ${dropdownToggler && "flex"} ${
          stickyMenu
            ? "xl:group-hover:translate-y-0"
            : "xl:group-hover:translate-y-0"
        }`}
      >
        {menuItem.submenu?.map((item, i) => (
          <li key={i} className="first:pt-0 last:pb-0">
            <Link
              href={item.path || "/"}
              className={`block text-sm font-normal text-dark hover:text-blue py-2.5 px-5 transition-colors duration-200 ${
                pathUrl === item.path && "text-blue font-medium"
              }`}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
};

export default Dropdown;
