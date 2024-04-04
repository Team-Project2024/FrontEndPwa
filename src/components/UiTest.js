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

        <h3>UI구별 두가지 방법 테스트</h3>
        <br/>

        {isMobile ? 
        
        <div>
            
        <h2>context Provider 상태관리를 통한 UI분할 :모바일이면 뜨는거 </h2>
        <br/>

       
            <p style={{color:"skyblue"}}>안녕안녕 안녕 모바일 환경</p>

            <br/>
       

        </div>

        : <div>         
            <h2> context Provider 상태관리를 통한 UI분할 : 데스크탑이면 뜨는거</h2>
            <br/>

            <p style={{color:"skyblue"}}>안녕안녕 안녕 데스크탑 환경</p>

            <br/>

        </div>
        
        
        }

        <BrowserView>

        <h2>REACT-DEVICE-DETECT를 통한  UI분할 : 데탑 브라우저면 뜸</h2>
        <p style={{color:"skyblue"}}>현재환경 : 데스크탑 환경</p>

        </BrowserView> 
                
        <MobileView>

        <h2>REACT-DEVICE-DETECT를 통한  UI분할 : 모바일이면 뜸</h2>
        <p style={{color:"skyblue"}}>현재환경: 모바일 환경</p>

        </MobileView>

        <button>
        <Link to="/"style={{ color: 'black', textDecoration: 'none' }}>뒤로</Link>
       </button>
      </div>
    )
}

export default Test

