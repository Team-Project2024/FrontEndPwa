import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

//id,role,AccessToken이 들어있는 auth state의 role를 통해서 권한 파악하고 페이지별 접근권한 라우팅용 
const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();

    const rolesToCheck = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    // auth가 존재하고, 허용된 역할 중 하나에 속하는지 확인
    const isAuthenticated = auth && rolesToCheck.includes(auth.role);

    return (
        isAuthenticated
            ? <Outlet />
            : auth?.accessToken
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth;
