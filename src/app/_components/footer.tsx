import Link from 'next/link';
import { FaUserLarge } from "react-icons/fa6";

const Footer = () => {
    return (
        <footer id="footer_pc">
            <div className="footer_section">
                <div className="inner_section">
                    <div>
                        <Link href="/">
                            <span className="header_logo scoredream">개미굴 가이드</span>
                        </Link>
                    </div>
                    <div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;