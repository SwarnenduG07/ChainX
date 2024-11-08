"use client";

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react';
import { HOOKS_URL } from '../config';

import Image from 'next/image';
import Navbar from '@/components/navbar';
import { useZaps, Zap } from '@/hooks/userzap';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function Dashboard() {
  const routet = useRouter();
  const { loading, zaps } = useZaps();

  return (
    <div>
      <Navbar />
      <div className='pt-8 flex justify-center'>
        <div className='max-w-screen-lg w-full'>
          <div className='flex justify-between pr-8'>
            <div className='font-bold text-2xl'>My Zaps</div>
            <Button className='bg-purple-800' onClick={() => routet.push("/zap/create")}>
              Create
            </Button>
          </div>
        </div>
      </div>
      {loading ? "Loading" : <ZapTable zaps={zaps} />}
    </div>
  );
}

function ZapTable({ zaps }: { zaps: Zap[] }) {
  const router = useRouter();

  return (
    <div className="p-8 max-w-screen-lg w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Webhook URL</TableHead>
            <TableHead>Go</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {zaps.map((z) => (
            <TableRow key={z.id}>
              <TableCell>
                <div className="flex">
                  {z.trigger?.type?.image && (
                    <img src={z.trigger.type.image} alt="Webhook" width={30} height={30} />
                  )}
                  {z.actions.map((action, idx) => (
                    <img key={idx} src={action.type.image} alt="Action" width={30} height={30} />
                  ))}
                </div>
              </TableCell>
              <TableCell>{z.id}</TableCell>
              <TableCell>Nov 13, 2023</TableCell>
              <TableCell>{`${HOOKS_URL}/hooks/catch/1/${z.id}`}</TableCell>
              <TableCell>
                <Button onClick={() => router.push("/zap/" + z.id)}>Go</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
