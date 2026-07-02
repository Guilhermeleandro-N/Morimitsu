import Header from "../components/Header/Header";
import Sidebar from "../components/SideBar/Sidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

export default function MainLayout(){
    const [isOpen, setIsOpen] = useState(false)
    return(
    <div style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <Header isOpen={isOpen} setIsOpen={setIsOpen} />
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen}/>
        <main style={{ flex: 1, overflow: "hidden" }}>
                <Outlet />
        </main>
    </div>
    )
}