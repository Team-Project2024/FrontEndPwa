import { Link } from "react-router-dom"

const Missing = () => {
    return (
        <article style={{ padding: "100px" }}>
            <h1>없는페이지입니다!</h1>
            <p>Page Not Found</p>
            <div className="flexGrow">
                <Link to="/">로그인화면으로 이동</Link>
            </div>
        </article>
    )
}

export default Missing
