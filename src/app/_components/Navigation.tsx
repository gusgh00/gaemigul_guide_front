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
                <Link href={{
                    pathname: "/travel",
                    query: {
                        region: JSON.stringify({
                            addr_name: "서울특별시",
                            region_name: "서울",
                            cd: "11",
                            full_addr: "서울특별시",
                            x_coor: "953932",
                            y_coor: "1952053"
                        }),
                        start: new Date().toISOString(),
                        end: new Date().toISOString()
                    }}}>
                    <div>
                        <span className={usePathname() === "/travel" ? "scoredream-700 navigation_text navigation_text_selected" : "scoredream-500 navigation_text"}>여행 계획하기</span>
                    </div>
                </Link>
                <Link href="/mytrip">
                    <div>
                        <span className={usePathname() === "/mytrip" ? "scoredream-700 navigation_text navigation_text_selected" : "scoredream-500 navigation_text"}>나의 여행 계획</span>
                    </div>
                </Link>
                <Link href="/board">
                    <div>
                        <span className={usePathname() === "/board" ? "scoredream-700 navigation_text navigation_text_selected" : "scoredream-500 navigation_text"}>모두의 여행 계획</span>
                    </div>
                </Link>
            </div>
        </>
    );
};

export default Navigation;