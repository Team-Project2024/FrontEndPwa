import { Outlet } from "react-router-dom";
import { useState,useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";
import { RotateLoader } from "react-spinners";

//로그인 유지를 위한 코드

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const {auth,persist} = useAuth();


    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                await refresh();
            }
            catch (err) {
                console.error(err);
            }
            finally{
                isMounted && setIsLoading(false);
            }
        }

        !auth?.accessToken &&persist ? verifyRefreshToken() : setIsLoading(false);

        return () => isMounted = false;
    },[])


    useEffect(() => {
        console.log(`isLoading: ${isLoading}`);
        console.log(`aT: ${JSON.stringify(auth?.accessToken)}`);
        
    },[isLoading,auth?.accessToken])
    return (
        <>
            {!persist
                ? <Outlet />
                : isLoading

                    ? <div><RotateLoader color="rgba(248, 248, 248, 1)" /></div>
                    : <Outlet />
            }
        </>
    )
}

export default PersistLogin