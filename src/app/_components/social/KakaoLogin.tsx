import {useEffect} from "react";
import {signIn} from "next-auth/react";

const KakaoLogin = () => {
    return (
        <button className="btn_kakao_login" onClick={() => signIn('kakao')}/>
    );
}

export default KakaoLogin;