import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Switch } from "./ui/switch";
const ThemeTouggle = () => {

    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => { 
        setMounted(true)
    },[]);
    const touggleTheme = ()=> {
       setTheme(theme === "dark" ? "light" : "dark")
    };
    if(!mounted) return null;
  return (
    <div>
         <Switch onClick={touggleTheme} className="dark:bg-emerald-400"> 
            {theme === "dark" ? "siwtch to light" : "switch to dark"}   
         </Switch>
    </div>
  )
}

export default ThemeTouggle
