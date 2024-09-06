import Link from 'next/link';
import { FaUserLarge } from "react-icons/fa6";

const Header = () => {
    return (
        <header id="header_pc">
            <div className="header_section">
                <div className="inner_section">
                    <div>
                        <Link href="/">
                            <span className="header_logo scoredream">개미굴 가이드</span>
                        </Link>
                    </div>
                    <div>
                        <FaUserLarge />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;