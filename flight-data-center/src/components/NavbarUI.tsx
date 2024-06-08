import React from "react";
import Navbar__StatusIcons from "./Navbar__StatusIcons";


const NavbarUI: React.FC = () => {
    return (
        <div className="w-[90%] py-4 px-8 items-center justify-center flex bg-white border-1 border-gray-100 shadow-md rounded-xl">
            <Navbar__StatusIcons />
        </div>
    )
}

export default NavbarUI;