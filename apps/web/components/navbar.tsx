"use client"
import { NextResponse } from "next/server";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function Navbar():JSX.Element {

     const router = useRouter();

     const handelSignout = ()  => {
        try {
               localStorage.removeItem("token");
               sessionStorage.removeItem("token");
               router.push("/")       
        } catch (e) {
            return NextResponse.json(
                {
                    messsage:"Signup failed"
                }
            )
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