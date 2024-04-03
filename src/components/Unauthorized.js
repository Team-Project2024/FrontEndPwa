import { useNavigate } from "react-router-dom"
// 요구되는 role이 아니거나 토큰 만료시 이 페이지로 리다이렉트
const Unauthorized = () => {
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    return (
        <section>
            <h1>접근 권한 없음</h1>
            <br />
            <p>권한이 없거나 토큰이 만료되었습니다.</p>
            <div className="flexGrow">
                <button onClick={goBack}>메인페이지로 이동</button>
            </div>
        </section>
    )
}

export default Unauthorized

