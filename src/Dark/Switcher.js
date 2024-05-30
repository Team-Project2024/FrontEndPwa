import React, { useState } from "react";
import useDarkSide from "./useDarkSide";
import { DarkModeSwitch } from "react-toggle-dark-mode";
export default function Switcher() {
  const [colorTheme, setTheme] = useDarkSide();
  const [darkSide, setDarkSide] = useState(
    colorTheme === "light" ? true : false
  );
  const toggleDarkMode = (checked) => {
    setTheme(colorTheme);
    setDarkSide(checked);
  };
  return (
    <div>
      <DarkModeSwitch checked={darkSide} onChange={toggleDarkMode} size={30}
      data-tooltip-id="my-tooltip" data-tooltip-content="다크모드 켜기/끄기"
      
      />
    </div>
  );
}