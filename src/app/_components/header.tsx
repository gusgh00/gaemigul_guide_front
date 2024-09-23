"use client"
import Link from 'next/link';
import { FaUserLarge } from "react-icons/fa6";
import {useState} from "react";
import SignUpSignIn from "@/app/_components/SignUpSignIn";
import Image from "next/image";
import GaemigulGuideMain from "../../../assets/images/main/gaemigul_guide_logo_main.png";
import {useSession} from "next-auth/react";
import Navigation from "@/app/_components/Navigation";

const Header = () => {
    const [showSignModal, setShowSignModal] = useState<boolean>(false)
    const setSignInSignUp = () => {
        setShowSignModal(!showSignModal)
    }

    const { data: session } = useSession()

    return (
        <>
            <header id="header_pc">
                <div className="header_section">
                    <div className="inner_section">
                        <div>
                            <Navigation/>
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