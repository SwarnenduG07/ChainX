"use client";

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react';
import { HOOKS_URL } from '../config';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useZaps, Zap } from '@/hooks/user-zap';
import { Loader2, Copy, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const router = useRouter();
  const { loading, zaps } = useZaps();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className='container mx-auto px-4 py-8'>
        <div className='bg-white rounded-lg shadow-sm p-6'>
          <div className='flex justify-between items-center mb-6'>
            <h1 className='font-bold text-2xl text-gray-900'>My Zaps</h1>
            <Button className='bg-purple-800 hover:bg-purple-700' onClick={() => router.push("/zap/create")}>
              <Plus className="mr-2 h-4 w-4" />
              Create Zap
            </Button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-purple-800" />
            </div>
          ) : (
            <ZapTable zaps={zaps} />
          )}
        </div>
      </div>
    </div>
  );
}

function ZapTable({ zaps }: { zaps: Zap[] }) {
  const router = useRouter();
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-gray-50">
            <TableHead className="w-48">Integration</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="w-1/3">Webhook URL</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {zaps.map((z) => (
            <TableRow key={z.id} className="hover:bg-gray-50 transition-colors">
              <TableCell>
                <div className="flex items-center gap-2">
                  {z.trigger?.type?.image && (
                    <img src={z.trigger.type.image} alt="Trigger" className="w-6 h-6 rounded" />
                  )}
                  <div className="w-4 h-4 rounded-full bg-green-500" />
                  {z.actions.map((action: any, idx: any) => (
                    <img key={idx} src={action.type.image} alt="Action" className="w-6 h-6 rounded" />
                  ))}
                </div>
              </TableCell>
              <TableCell className="font-mono text-sm">{z.id}</TableCell>
              <TableCell className="text-gray-600">Nov 13, 2023</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <code className="text-sm bg-gray-50 px-2 py-1 rounded">
                    {`${HOOKS_URL}/hooks/catch/1/${z.id}`}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(`${HOOKS_URL}/hooks/catch/1/${z.id}`)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  onClick={() => router.push("/zap/" + z.id)}
                  className="hover:bg-purple-50 hover:text-purple-800"
                >
                  Configure
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}