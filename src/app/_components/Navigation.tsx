import Link from "next/link";
import Image from "next/image";
import GaemigulGuideMain from "@images/main/gaemigul_guide_logo_main.png";
import {usePathname} from "next/navigation";

const Navigation = () => {
    return (
        <>
            <div className="navigation">
                <Link href="/">
                    <Image src={GaemigulGuideMain} alt="개미굴 가이드 메인" className="header_logo" width={2560} height={740}/>
                </Link>
                <Link href={"/travel"}>
                    <div>
                        <span className={usePathname() === "/travel" ? "scoredream-700 navigation_text navigation_text_selected" : "scoredream-500 navigation_text"}>여행 계획하기</span>
                    </div>
                </Link>
            </div>
        </>
    );
};

export default Navigation;