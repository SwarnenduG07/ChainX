"use client";
import { useRouter } from "next/navigation"; // Reordered import
import { Button } from "./ui/button";

export default function Navbar(): JSX.Element {
    const router = useRouter();

    const handleSignout = () => {
        try {
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");
            router.push("/");
        } catch (e: unknown) {
            console.error(e, "Sign out failed");
        }
    };

    return (
        <div className="py-2 border-b border-purple-600">
            <div className="flex items-center justify-between mx-24">
                <h1 className="text-black font-semibold text-2xl cursor-pointer">
                    ChainX
                </h1>
                <div>
                    <Button onClick={() => void handleSignout()}>Sign Out</Button>
                </div>
            </div>
        </div>
    );
}
