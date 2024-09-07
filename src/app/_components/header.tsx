"use client"
import Link from 'next/link';
import { FaUserLarge } from "react-icons/fa6";
import {useState} from "react";
import SignUpSignIn from "@/app/_components/SignUpSignIn";

const Header = () => {
    const [showSignModal, setShowSignModal] = useState<boolean>(false)
    const setSignInSignUp = () => {
        setShowSignModal(!showSignModal)
    }

    return (
        <>
            <header id="header_pc">
                <div className="header_section">
                    <div className="inner_section">
                        <div>
                            <Link href="/">
                                <span className="header_logo scoredream">개미굴 가이드</span>
                            </Link>
                        </div>
                        <div>
                            <FaUserLarge onClick={setSignInSignUp} style={{
                                cursor: "pointer"
                            }}/>
                        </div>
                    </div>
                </div>
            </header>
            {showSignModal && <SignUpSignIn clickModal={setSignInSignUp}/>}
        </>
    );
};

export default Header;