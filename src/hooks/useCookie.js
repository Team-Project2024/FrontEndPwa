import { useCookies } from "react-cookie";

const useCookie = (name) => {
  const [cookies, setCookie, removeCookie] = useCookies(['Refresh_Token'])

  // Error handling or default value
  if (!cookies[name]) {
    console.warn(`Cookie with name "${name}" not found`);
    return null; // or a default value
  }

  return cookies;
};

export default useCookie;