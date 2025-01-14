import React, { useState } from 'react';
import { Button } from './ui/button';
import axios from 'axios';
import { BACKEND_URL } from '@/src/app/config';

const Event = [
  {
    title: "Tagged Email",
  },
  {
    title: "New received Email"
  }
]

const handleGmailEmial = async () => {
  try {

    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      throw new Error("Not authenticated");
    }

    const res = await axios.get(`${BACKEND_URL}/api/v1/trigger/gmail/auth`, {
      headers: {

         'Authorization': `Bearer ${token}`,

      }
    });
    window.location.href = res.data.authUrl;
  } catch (error) {
    console.error("Gmail auth error:", error);
    alert("Authentication failed. Please make sure you're logged in.");
  }
}

const EmailCard = ({ setMetadata, onClose }: { setMetadata: (params: any) => void, onClose?: () => void }) => {
  const [selectedEvent, setSelectedEvent] = useState(Event[0].title);
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [page, setPage] = useState(1);
  const [tag, setTag] = useState("")

  const handleTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      setTags([...tags, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleSave = () => {
    setMetadata({
      tag:tag,
      event: selectedEvent,
      config: selectedEvent === "Tagged Email" ? { tags } : { emailFilter }
    });
    onClose?.();
  };

  return (
    <div className='px-8 py-10 border border-purple-500 bg-[#2d1f00] rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20'>
      <div className='space-y-6'>
        <div className='flex justify-center space-x-4 mb-6'>
          <span className={`text-sm font-medium ${page === 1 ? 'text-purple-500' : 'text-neutral-100'}`}>Setup</span>
          <span className={`text-sm font-medium ${page === 2 ? 'text-purple-500' : 'text-neutral-100'}`}>Configure</span>
          <span className={`text-sm font-medium ${page === 3 ? 'text-purple-500' : 'text-neutral-100'}`}>Test</span>
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
              <div className='bg-[#2d1f00] py-3 px-4 rounded-xl hover:border-purple-400 border border-gray-300 transition-colors duration-200'>
                <div className='flex justify-between items-center'>
                  <h1 className='text-sm font-normal text-white'>Connect your account</h1>
                  <Button className='px-4 h-8 text-xs font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors duration-200'
                  onClick={handleGmailEmial}>
                    Connect
                  </Button>
                </div>
              </div>
            </div>

            <div className='flex gap-3 mt-6'>
              <Button 
                className='w-full py-2.5 text-sm font-medium text-white bg-fuchsia-600 hover:bg-fuchsia-700 rounded-xl transition-colors duration-200'
                onClick={() => setPage(2)}
              >
                Next
              </Button>
            </div>
          </>
        ) : (
          <>
            {selectedEvent === "Tagged Email" ? (
              <div className='space-y-2'>
                <label className='text-xs font-medium text-neutral-100'>Add Tags</label>
                <div className='flex flex-wrap gap-2 p-2 border rounded-xl bg-[#2d1f00] hover:border-purple-400 border-gray-400'>
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className='bg-purple-600 text-white px-2 py-1 rounded-lg text-sm flex items-center gap-1'
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(index)}
                        className='text-white hover:text-red-300'
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input 
                    type="text" 
                    value={inputValue}
                    onChange={handleTagInput}
                    onKeyDown={handleKeyDown}
                    className='flex-1 bg-transparent outline-none text-sm text-white min-w-[120px]'
                    placeholder='Type and press Enter to add tags'
                  />
                </div>
              </div>
            ) : (
              <div className='space-y-2'>
                <label className='text-xs font-medium text-neutral-100'>Email Filter</label>
                <input 
                  type="text" 
                  value={emailFilter}
                  onChange={(e) => setEmailFilter(e.target.value)}
                  className='w-full border rounded-xl bg-[#2d1f00] hover:border-purple-400 border-gray-400 px-4 py-2.5 text-sm text-white'
                  placeholder='Enter email address or domain to filter'
                />
              </div>
            )}

            <div className='flex gap-3 mt-6'>
              <Button 
                className='w-full py-2.5 text-sm font-medium text-white bg-fuchsia-600 hover:bg-fuchsia-700 rounded-xl transition-colors duration-200'
                onClick={handleSave}
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

export default EmailCard;