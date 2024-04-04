import { useNavigate } from "react-router-dom"
import useMobile from "../hooks/useMobile";
import { Link } from "react-router-dom";
import { BrowserView,MobileView,isBrowser,isMobile } from "react-device-detect";
// 요구되는 role이 아니거나 토큰 만료시 이 페이지로 리다이렉트
const Test = () => {
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    
    const isMobile = useMobile();

    return (
        <div>
        {isMobile ? 
        
        <div>
            
        <h2>모바일이면 뜨는거 </h2>

        </div>

         
        : <div> 

        
            <h2>데스크탑이면 뜨는거</h2>

        </div>
        
        
        }

        <BrowserView><h2>데탑 브라우저면 뜸</h2></BrowserView> 
                
        <MobileView><h2>모바일이면 뜸</h2></MobileView>

        <button>
        <Link to="/"style={{ color: 'black', textDecoration: 'none' }}>뒤로</Link>
       </button>
      </div>
    )
}

export default Test

