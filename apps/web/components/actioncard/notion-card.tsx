import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '@/src/app/config';
import { Button } from '../ui/button';
import { Aladin } from 'next/font/google';


const Event = [
  { title: "Page Created" },
  { title: "Page Updated" }
];

const NotionCard = ({ setMetadata, onClose }: { setMetadata: (params: any) => void, onClose?: () => void }) => {
  const [selectedEvent, setSelectedEvent] = useState(Event[0].title);
  const [selectedDatabase, setSelectedDatabase] = useState('');
  const [page, setPage] = useState(1);
  const [isConnected, setIsConnected] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if already connected
    const notionWorkspace = localStorage.getItem('notion_workspace_name');
    if (notionWorkspace) {
      setIsConnected(true);
      setWorkspaceName(notionWorkspace);
    }

    const params = new URLSearchParams(window.location.search);
    const workspaceName = params.get('workspace_name');
    const accessToken = params.get('access_token');

    if(workspaceName && accessToken) {
      setIsConnected(true);
      setWorkspaceName(workspaceName);
      localStorage.setItem('notion_workspace_name', workspaceName);
      localStorage.setItem('notion_access_token', accessToken);
      setMetadata({workspaceName, accessToken})

    }
    const error = params.get('error');
    if(!error) {
      alert(`Failed tp connect to ntoion: ${params.get('message')}`);
    }
  }, []);
  const handleNotionAuth = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");
  
      setIsLoading(true);
  
      const currentUrl = window.location.href; 
  
      const res = await axios.get(`${BACKEND_URL}/api/v1/notionAuth/notion/auth`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        params: { redirectTo: currentUrl }, // Pass redirectTo as a query parameter
      });
  
      if (!res.data.authUrl) {
        throw new Error("No authorization URL received");
      }
  
      const authWindow = window.open(res.data.authUrl, 'Notion Auth', 'width=600,height=600');
  
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== BACKEND_URL) return; // Ensure the message is from the correct origin
  
        if (event.data.type === 'notion_auth_callback') {
          setIsConnected(true);
          setWorkspaceName(event.data.workspace_name);
          localStorage.setItem('notion_workspace_name', event.data.workspace_name);
          localStorage.setItem('notion_access_token', event.data.access_token);
          if (authWindow) authWindow.close();
          window.removeEventListener('message', handleMessage);
        } else if (event.data.type === 'notion_auth_error') {
          alert(event.data.error);
          if (authWindow) authWindow.close();
          window.removeEventListener('message', handleMessage);
        }
        setIsLoading(false);
      };
  
      window.addEventListener('message', handleMessage);
    } catch (error) {
      console.error("Notion auth error:", error);
      alert("Authentication failed");
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setWorkspaceName('');
    localStorage.removeItem('notion_workspace_name');
    localStorage.removeItem('notion_access_token');
  };

  return (
    <div className='px-8 py-10 border border-purple-500 bg-[#2d1f00] rounded-xl'>
      <div className='space-y-6'>
        <div className='flex justify-center space-x-4 mb-6'>
          <span className={`text-sm font-medium ${page === 1 ? 'text-purple-500' : 'text-neutral-100'}`}>Setup</span>
          <span className={`text-sm font-medium ${page === 2 ? 'text-purple-500' : 'text-neutral-100'}`}>Configure</span>
        </div>

        <div className='space-y-2'>
          <label className='text-xs font-medium text-neutral-50'>Connect Account</label>
          <div className='bg-[#2d1f00] py-3 px-4 rounded-xl hover:border-purple-400 border border-gray-300 transition-all duration-200'>
            {!isConnected ? (
              <div className='flex justify-between items-center w-full'>
                <div className='flex items-center gap-2'>
                  <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4.5 4.5v15A1.5 1.5 0 006 21h12a1.5 1.5 0 001.5-1.5v-15A1.5 1.5 0 0018 3H6a1.5 1.5 0 00-1.5 1.5z" />
                  </svg>
                  <span className='text-sm font-normal text-gray-300'>Connect Notion account</span>
                </div>
                <Button 
                  className='px-4 h-8 text-xs font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-all duration-200 flex items-center gap-2'
                  onClick={handleNotionAuth}
                  disabled={isLoading}
                >
                  {isLoading ? 'Connecting...' : 'Connect'}
                </Button>
              </div>
            ) : (
              <div className="flex justify-between items-center w-full">
                <div className='flex items-center gap-2'>
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-neutral-100 font-medium">{workspaceName}</span>
                </div>
                <Button 
                  onClick={handleDisconnect}
                  className="px-3 py-1 text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition-all duration-200 flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Disconnect
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Rest of your existing component code */}
      </div>
    </div>
  );
};

export default NotionCard;