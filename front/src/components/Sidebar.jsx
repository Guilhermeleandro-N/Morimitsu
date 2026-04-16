import React, {useState} from "react";

import "./Sidebar.css";

function Sidebar() {
    const [open, setOpen] = useState(true);

    return (
        <div>
            <div  onClick={() => setOpen(!open)} >SideBar
            <div className={`sidebar ${open ? "open": "closed"}`} >
                <h2 >Menu</h2>
                <ul>
                    <li>Item 1</li>
                    <li>Item 2</li>
                    <li>Item 3</li>
                </ul>
            </div>
            </div>
        </div>
    )
}

export default Sidebar;