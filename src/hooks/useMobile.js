import { useContext, useDebugValue } from "react";
import MobileContext from "../context/UiProvider";

const useMobile = () => {
    const isMobile = useContext(MobileContext);
    return isMobile;
}

export default useMobile;