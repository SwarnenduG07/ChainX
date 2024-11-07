import { Button } from "./ui/button";

export default function Navbar() {
    return (
        <div className="py-2 border-b border-purple-600">
             <div className="flex items-center justify-between mx-24">
                <h1 className="text-black font-semibold text-2xl cursor-pointer">
                    ChainX
                </h1>
                <div>
                    <Button>Sign Out</Button>
                </div>
             </div>
        </div>
    )
}