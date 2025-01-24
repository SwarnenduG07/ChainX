import { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '@/src/app/config';
import { Button } from '../ui/button';

console.log("BACKEND_URL", BACKEND_URL);

const NOITON_AUTHORIZATION_URL=`https://api.notion.com/v1/oauth/authorize?client_id=171d872b-594c-8051-9348-0037f82b2b84&response_type=code&owner=user&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fzap%2Fcreate`;

const Event = [
  {
    title: "Create new Database",
  },
  {
    title: "Edit exis Databse"
  }
]

interface NotionDatabase {
  id: string;
  title: string;
}

const NotionCard = ({ setMetadata, onClose }: { setMetadata: (params: any) => void, onClose?: () => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [databases, setDatabases] = useState<NotionDatabase[]>([]);
  const [selectedDatabase, setSelectedDatabase] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState(Event[0].title);
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [page, setPage] = useState(1);
  const [connectNotion, setconnectNotion] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(() => {
    const token = localStorage.getItem('notion_access_token');
    return !!token;
  });
  const [workspaceName, setWorkspaceName] = useState(() => {
    return localStorage.getItem('notion_workspace_name') || '';
  });
  const [accessToken, setAccessToken] = useState('');

  const handleSave = () => {
    if (!tags.length) {
      alert('Please add at least one tag');
      return;
    }
    
    setMetadata({
      type: "notion",
      actionId: "notion",
      metadata: {
        tag: tags[0],
        event: selectedEvent,
        notionDatabaseId: selectedDatabase,
      }
    });
    onClose?.();
  };

  const handleNotionAuth = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) throw new Error("No token found");

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
      const response = await axios.get(`${BACKEND_URL}/api/v1/notionAuth/notion/databases`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setDatabases(response.data.databases);
    } catch (error) {
      console.error("Error fetching databases:", error);
      setError("Failed to fetch Notion databases");
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const notionAuth = urlParams.get('notionAuth');
    
    if (notionAuth === 'success') {
        const access_token = urlParams.get('access_token');
        const workspace_id = urlParams.get('workspace_id');
        
        if (access_token && workspace_id) {
            localStorage.setItem('notion_access_token', access_token);
            localStorage.setItem('notion_workspace_id', workspace_id);
            setconnectNotion(workspace_id); // Update connected status
            fetchNotionDatabases(access_token);
        }
        
        window.history.replaceState({}, document.title, window.location.pathname);
    } else if (notionAuth === 'error') {
        setError(urlParams.get('error') || 'Failed to connect to Notion');
    }
}, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'notion_auth_callback') {
        setIsConnected(true);
        setWorkspaceName(event.data.workspace_name);
        setconnectNotion(event.data.access_token);
        localStorage.setItem('notion_access_token', event.data.access_token);
        localStorage.setItem('notion_workspace_name', event.data.workspace_name);
      } else if (event.data.type === 'notion_auth_error') {
        // Handle error
        console.error('Notion auth error:', event.data.error);
      }
    };
  
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleDatabaseSelect = (databaseId: string) => {
    setSelectedDatabase(databaseId);
    setMetadata({ notionDatabaseId: databaseId });
    onClose?.();
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setWorkspaceName('');
    setAccessToken('');
    localStorage.removeItem('notion_access_token');
  };

  const handleNotionAuthCallback = (params: URLSearchParams) => {
    if (params.get('notionAuth') === 'success') {
      setIsConnected(true);
      setWorkspaceName(decodeURIComponent(params.get('workspace_name') || ''));
      // Handle storing tokens and other auth data
    }
  };

  return (
    <div className='px-8 py-10 border border-purple-500 bg-[#2d1f00] rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20'>
          <div className='space-y-6'>
            <div className='flex justify-center space-x-4 mb-6'>
              <span className={`text-sm font-medium ${page === 1 ? 'text-purple-500' : 'text-neutral-100'}`}>Setup</span>
              <span className={`text-sm font-medium ${page === 2 ? 'text-purple-500' : 'text-neutral-100'}`}>Configure</span>
            </div>
    
            {page === 1 ? (
              <>
                <div className='space-y-2'>
                  <label className='text-xs font-medium text-neutral-100'>Trigger Event</label>
                  <select 
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                    className='w-full border rounded-xl bg-[#2d1f00] hover:border-purple-400 border-gray-400 px-4 py-2.5 text-sm text-white transition-colors duration-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 cursor-pointer'
                  >
                    {Event.map((event, index) => (
                      <option 
                        key={index} 
                        value={event.title}
                        style={{ backgroundColor: '#2d1f00', color: 'white' }}
                      >
                        {event.title}
                      </option>
                    ))}
                  </select>
                </div>
    
                <div className='space-y-2'>
                  <label className='text-xs font-medium text-neutral-50'>Connect Account</label>
                  <div className='bg-[#2d1f00] py-3 px-4 rounded-xl hover:border-purple-400 border border-gray-300 transition-all duration-200'>
                    <div className='flex justify-between items-center'>
                      {!isConnected ? (
                        <Button
                          onClick={handleNotionAuth}
                          className="w-full py-2.5 text-sm font-medium text-neutral-100 bg-neutral-800 hover:bg-neutral-700 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                        > 
                          Connect Notion
                        </Button>
                      ) : (
                        <div className="flex justify-between items-center w-full p-3 border border-neutral-800 rounded-xl">
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                              <span className="text-sm text-neutral-100 font-medium block">{workspaceName}</span>
                              <span className="text-xs text-neutral-400">Connected Workspace</span>
                            </div>
                          </div>
                          <Button 
                            onClick={() => {
                              setIsConnected(false);
                              setWorkspaceName('');
                              setconnectNotion(null);
                              localStorage.removeItem('notion_access_token');
                              localStorage.removeItem('notion_workspace_name');
                            }}
                            className="px-3 py-1.5 text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-all duration-200"
                          >
                            Disconnect
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
    
                <div className='flex gap-3 mt-6'>
                  <Button 
                    className='w-full py-2.5 text-sm font-medium text-white bg-fuchsia-600 hover:bg-fuchsia-700 rounded-xl transition-colors duration-200'
                    onClick={() => setPage(2)}
                    disabled={!isConnected}
                  >
                    Next
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className='space-y-2'>
                  <label className='text-xs font-medium text-neutral-100'>Select Database</label>
                  {databases.length > 0 ? (
                    <div className='space-y-2'>
                      {databases.map((db) => (
                        <div
                          key={db.id}
                          onClick={() => handleDatabaseSelect(db.id)}
                          className={`p-3 border ${
                            selectedDatabase === db.id ? 'border-purple-500' : 'border-gray-400'
                          } rounded-xl cursor-pointer hover:border-purple-400 transition-all duration-200`}
                        >
                          <p className='text-sm text-white'>{db.title}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className='text-center p-4 border border-gray-400 rounded-xl'>
                      <p className='text-sm text-gray-400'>No databases found</p>
                    </div>
                  )}
                </div>

                <div className='flex gap-3 mt-6'>
                  <Button 
                    className='w-full py-2.5 text-sm font-medium text-white bg-fuchsia-600 hover:bg-fuchsia-700 rounded-xl transition-colors duration-200'
                    onClick={handleSave}
                    disabled={!selectedDatabase}
                  >
                    Save
                  </Button>
                  <Button 
                    className='w-full py-2.5 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-xl transition-colors duration-200'
                    onClick={() => setPage(1)}
                  >
                    Back
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
  );
};

export default NotionCard;