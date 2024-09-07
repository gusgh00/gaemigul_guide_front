import KakaoLogin from "@/app/_components/social/KakaoLogin";


const SignUpSignIn = (props: any) => {
    const { clickModal } = props
    return (
        <div id="sign_in_background">
            <div className="sign_in_modal">
                <span className="scoredream sign_in_span">로그인</span>
                <span className="scoredream sign_in_desc"><span className="text-lime-400">개미굴 가이드</span>에 가입하여<br/>여행 정보를 공유하고 탐색하세요!</span>
                <KakaoLogin/>
                <span className="scoredream sign_in_close" onClick={clickModal} style={{
                    cursor: "pointer"
                }}>닫기</span>
            </div>
        </div>
    );
};

export default SignUpSignIn;