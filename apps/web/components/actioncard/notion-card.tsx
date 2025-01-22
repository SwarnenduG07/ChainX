import { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '@/src/app/config';

console.log("BACKEND_URL", BACKEND_URL);

const NOITON_AUTHORIZATION_URL=`https://api.notion.com/v1/oauth/authorize?client_id=171d872b-594c-8051-9348-0037f82b2b84&response_type=code&owner=user&redirect_uri=http%3A%2F%2Flocalhost%3A3002%2Fapi%2Fv1%2FnotionAuth%2Fnotion%2Fcallback`

interface NotionDatabase {
  id: string;
  title: string;
}

const NotionCard = ({ setMetadata, onClose }: { setMetadata: (params: any) => void, onClose?: () => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [databases, setDatabases] = useState<NotionDatabase[]>([]);
  const [selectedDatabase, setSelectedDatabase] = useState<string>('');

  const handleNotionAuth = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) throw new Error("No token found");

      // Redirect to Notion authorization
      window.location.href = NOITON_AUTHORIZATION_URL; ;
      
    } catch (error) {
      console.error("Notion auth error:", error);
      setError("Failed to connect to Notion");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNotionDatabases = async (accessToken: string) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/action/notion/databases`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setDatabases(response.data.databases);
    } catch (error) {
      console.error("Error fetching databases:", error);
      setError("Failed to fetch Notion databases");
    }
  };

  useEffect(() => {
    // Check if we have a code in the URL (OAuth callback)
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      handleNotionCallback(code);
    }
  }, []);

  const handleNotionCallback = async (code: string) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.post(
        `${BACKEND_URL}/api/v1/action/notion/callback`,
        { code },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // After successful authentication, fetch available databases
      await fetchNotionDatabases(response.data.access_token);
      
    } catch (error) {
      console.error("Error handling Notion callback:", error);
      setError("Failed to complete Notion authentication");
    }
  };

  const handleDatabaseSelect = (databaseId: string) => {
    setSelectedDatabase(databaseId);
    setMetadata({ notionDatabaseId: databaseId });
    onClose?.();
  };

  return (
    <div className="notion-card">
      {error && <div className="error-message">{error}</div>}
      
      {!databases.length ? (
        <button 
          onClick={handleNotionAuth}
          disabled={isLoading}
        >
          {isLoading ? 'Connecting...' : 'Connect to Notion'}
        </button>
      ) : (
        <div className="database-selection">
          <h3>Select a Notion Database</h3>
          <ul>
            {databases.map(db => (
              <li key={db.id}>
                <button onClick={() => handleDatabaseSelect(db.id)}>
                  {db.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotionCard;