import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/src/app/config";
import { useRouter } from "next/navigation";


export interface Zap {
    "id": string,
    "triggerId": string,
    "userId": number,
    "actions": {
        "id": string,
        "zapId": string,
        "actionId": string,
        "sortingOrder": number,
        "type": {
            "id": string,
            "name": string
            "image": string
        }
    }[],
    "trigger": {
        "id": string,
        "zapId": string,
        "triggerId": string,
        "type": {
            "id": string,
            "name": string,
            "image": string
        }
    }
}

interface ZapsResponse {
  zaps: Zap[];
}

export function useZaps() {
  const [loading, setLoading] = useState(true);
  const [zaps, setZaps] = useState<Zap[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Get token from storage
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      router.push("/signin");
      return;
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
    };

    axios.get<ZapsResponse>(`${BACKEND_URL}/api/v1/zap`, { headers })
      .then(response => {
        setZaps(response.data.zaps);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching zaps:", error);
        if (error.response?.status === 403) {
          // Clear tokens on auth error
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          router.push("/signin");
        }
        setLoading(false);
      });
  }, [router]);

  return { 
     loading, zaps 
  };
}
