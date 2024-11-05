"use client"
import {usePathname} from "next/navigation";

const Footer = () => {
    return (
        <footer id="footer_pc" style={usePathname() === "/travel" ? {display: "none"} : {display: "block"}}>
            <div className="footer_section">
                <div className="inner_section">
                    <span className="scoredream-300 footer_copyright">© 2024 Gaemigul-Guide. All Rights Reserved.</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;