"use client"
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function Navbar() {

     const router = useRouter();

     const handelSignout = async ()  => {
        try {
               localStorage.removeItem("token");
               sessionStorage.removeItem("token");
               router.push("/")       
        } catch (e) {
            console.log(e,"Signup failed");
        }
    }
    return (
        <div className="py-2 border-b border-purple-600">
             <div className="flex items-center justify-between mx-24">
                <h1 className="text-black font-semibold text-2xl cursor-pointer">
                    ChainX
                </h1>
                <div>
                    <Button onClick={() => {
                        handelSignout();
                    }}>Sign Out</Button>
                </div>
             </div>
        </div>
    )
}