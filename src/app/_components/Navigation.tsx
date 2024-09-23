import Link from "next/link";
import Image from "next/image";
import GaemigulGuideMain from "../../../assets/images/main/gaemigul_guide_logo_main.png";

const Navigation = () => {
    return (
        <>
            <div className="navigation">
                <Link href="/">
                    <Image src={GaemigulGuideMain} alt="개미굴 가이드 메인" className="header_logo" width={2560} height={740}/>
                </Link>
                <Link href="/travel">
                    <div>
                        <span className="scoredream-500 navigation_text">계획하기</span>
                    </div>
                </Link>
                <Link href="/mytrip">
                    <div>
                        <span className="scoredream-500 navigation_text">나의 계획</span>
                    </div>
                </Link>
                <Link href="/board">
                    <div>
                        <span className="scoredream-500 navigation_text">모두의 계획</span>
                    </div>
                </Link>
            </div>
        </>
    );
};

export default Navigation;