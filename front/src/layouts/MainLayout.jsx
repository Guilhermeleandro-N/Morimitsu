import Header from "../components/Header/Header";
import Sidebar from "../components/SideBar/Sidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

export default function MainLayout(){
    const [isOpen, setIsOpen] = useState(false)
    return(
    <div>
        <Header isOpen={isOpen} setIsOpen={setIsOpen} />
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen}/>
    </div>
    )
}