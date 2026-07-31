import Header from "../components/Header/Header";
import Sidebar from "../components/SideBar/Sidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

export default function MainLayout(){
    const [isOpen, setIsOpen] = useState(false)
    return(
    <div style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <Header isOpen={isOpen} setIsOpen={setIsOpen} />
        {isOpen && (
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 998,
              background: "rgba(0,0,0,0.3)",
            }}
          />
        )}
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen}/>
        <main
          style={{ flex: 1, overflow: "hidden" }}
          onClick={() => isOpen && setIsOpen(false)}
        >
            <Outlet />
        </main>
    </div>
    )
}