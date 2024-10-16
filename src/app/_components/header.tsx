"use client"
import Navigation from "@/app/_components/Navigation";

const Header = () => {
    return (
        <>
            <header id="header_pc">
                <div className="header_section">
                    <div className="inner_section">
                        <div>
                            <Navigation/>
                        </div>
                        <div className="header_sign_in_div">
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;