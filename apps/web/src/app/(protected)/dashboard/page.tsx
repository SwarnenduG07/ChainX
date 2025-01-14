"use client";

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { HOOKS_URL } from '../../config';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useZaps, Zap } from '@/hooks/user-zap';
import { Loader2, Copy, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/navbar';

export default function Dashboard() {
  const router = useRouter();
  const { loading, zaps } = useZaps();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-950 dark:to-slate-900 text-gray-900 dark:text-gray-100">
      {/* Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="w-[30rem] h-[30rem] bg-purple-500/20 dark:bg-purple-800/20 rounded-full absolute top-1/4 left-1/3 -translate-x-1/2 blur-3xl animate-pulse-slow"></div>
        <div className="w-[25rem] h-[25rem] bg-blue-500/20 dark:bg-blue-800/20 rounded-full absolute bottom-1/4 right-1/3 translate-x-1/2 blur-3xl animate-pulse-slow delay-200"></div>
        <div className="w-[20rem] h-[20rem] bg-pink-500/20 dark:bg-pink-800/20 rounded-full absolute top-1/2 left-2/3 -translate-y-1/2 blur-3xl animate-pulse-slow delay-500"></div>
      </div>

      <Navbar />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-lg shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="font-bold text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              My Zaps
            </h1>
            <Button
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
              onClick={() => router.push("/zap/create")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Zap
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
          ) : (
            <div className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
              <ZapTable zaps={zaps} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ZapTable({ zaps }: { zaps: Zap[] }) {
  const router = useRouter();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast({
        title: "Copied to clipboard",
        description: "Webhook URL has been copied",
        duration: 2000,
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-700">
            <TableHead className="w-48">Integration</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="w-1/5">Webhook URL</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {zaps.map((z) => (
            <TableRow key={z.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
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
              <TableCell className="text-gray-600 dark:text-gray-400">Nov 13, 2023</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <code className="text-sm bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded">
                    {`${HOOKS_URL}/hooks/catch/1/${z.id}`}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(`${HOOKS_URL}/hooks/catch/1/${z.id}`, z.id)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  onClick={() => router.push("/zap/" + z.id)}
                  className="hover:bg-purple-200 hover:text-purple-800 dark:hover:bg-purple-800 dark:hover:text-white"
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
