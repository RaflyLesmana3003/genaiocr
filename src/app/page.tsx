'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ArrowUpFromLine, ShieldAlert, Save } from "lucide-react";
import React, { useEffect } from "react";
import axios from 'axios';
import { Ticket } from "@/type/ticket";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Image from 'next/image'
import { upload } from "@vercel/blob/client";

export default function Home() {
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [fileToUpload, setFileToUpload] = React.useState(null);
  const [ticket, setTicket] = React.useState<Ticket | null>(null);
  const [status, setStatus] = React.useState(false)

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  React.useEffect(() => {
    const uploadImage = async () => {
      if (fileToUpload) {
        toast.info("Ticket sedang di process.");
        setStatus(true);
        setTimeout(() => {
          scrollToBottom();
        }, 500);
        
        const randomFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${fileToUpload.name}`;
        try {
          const newBlob = await upload(randomFileName, fileToUpload, {
            access: 'public',
            handleUploadUrl: '/api/ticket/upload',
          });

          if (newBlob.url) {
            const response = await axios.post('/api/scans/', { image: newBlob.url }, {
              headers: {
                'Content-Type': 'application/json',
              },
              onUploadProgress: (progressEvent) => {
                const total = progressEvent.total ?? 0;
                const percentCompleted = Math.round((progressEvent.loaded * 100) / total);
                setUploadProgress(percentCompleted);
              },
            });

            if (response.status === 200 && response.data) {
              setTicket(response.data.data);
              toast.success("Ticket Berhasil di scan.");
              setStatus(false);
              setTimeout(() => {
                scrollToBottom();
              }, 500);
            }
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          toast.error("Ticket gagal di scan, silahkan coba lagi.");
        }
      }
    };

    uploadImage();
  }, [fileToUpload]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setUploadProgress(0);
      setFileToUpload(file);
    }
  };

  const handleClick = () => {
    const pictureInput = document.getElementById('picture') as HTMLInputElement;
    if (pictureInput) {
      pictureInput.click();
      scrollToTop();
    }
  };

  const handleSave = async () => {
    try{
        const response = await axios.post('/api/ticket/create', { 
          ticketNumber: ticket.ticketNumber,
          supplier: ticket.supplier,
          product: ticket.product,
          payloadVolume: ticket.payloadVolume,
          carNumber: ticket.carNumber,
          scannedPayloadAt: ticket.scannedPayloadAt,
          scannedEmptyAt: ticket.scannedEmptyAt,
          operator: ticket.operator,
          createdAt: ticket.createdAt,
          }, {
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.status === 200 && response.data) {
          toast.success("Ticket Berhasil di simpan.");
        }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Ticket menyimpan di scan, silahkan coba lagi.");
    }
  };


  return (
    <main className="min-h-64">
      {!selectedImage && (
        <div className="flex justify-center flex-col px-5 mb-24">
          <header className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Solusi Tepat Kelola Proyek Bongkar-Muat
          </header>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Platform digital untuk kelancaran manajemen proyek Bongkar-Muat Anda yang lebih aman & transparan
          </p>
          <h2 className="my-10 scroll-m-20 border-b pb-2 text-md font-semibold tracking-tight transition-colors first:mt-0 text-primary">
            Kelola aktivitas armada truk Anda jadi lebih mudah, efektif & lancar jaya
          </h2>
          <div className="flex flex-col gap-5">
            <div>
              <span className="font-semibold">1. Pantau aktivitas pengiriman secara real-time</span>
              <p>Dapatkan laporan aktivitas pengiriman secepat kilat dan akurat, lupakan cara manual yang terlalu lama & rentan kesalahan pencatatan.</p>
            </div>
            <div>
              <span className="font-semibold">2. Sistem pembayaran yang lebih aman</span>
              <p>Hindari kerugian dari berbagai risiko penyelewengan / penyalahgunaan dana dengan sistem pembayaran yang lebih aman & terpercaya.</p>
            </div>
            <div>
              <span className="font-semibold">3. Otomatisasi rekap surat jalan & penagihan</span>
              <p>Optimalkan rekapitulasi surat jalan serta penerbitan tagihan yang terintegrasi secara otomatis, terangkum dengan lengkap, dan disajikan dalam satu platform.</p>
            </div>
          </div>
        </div>
      )}


      {selectedImage && (
        <div className="mb-4 w-full flex flex-col items-center">
          <div className="w-full h-1/2 flex justify-center rounded-lg">
            <Image src={selectedImage} alt={"Selected"} width={10} height={10} className="w-3/4 max-h-full object-cover rounded-lg shadow"/>
          </div>
            <Progress value={uploadProgress} className="w-3/4 mt-4 rounded-lg"/>

            <span className="text-xs text-gray-500 mt-2">Preview Ticket</span>

        </div>
      )}

      {status && (
      <div className="flex justify-center mb-32">
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
      )}

      {!status && ticket && (
        <div className="flex justify-center mb-32">
        <Card className="w-3/4">
          <CardHeader>
            <CardTitle><Badge variant="outline">Hasil ticket</Badge></CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <label htmlFor="ticketNumber" className="text-sm text-muted-foreground">
                No Ticket
              </label>
              <Input id="ticketNumber" type="text" value={ticket.ticketNumber} onChange={(e) => setTicket({ ...ticket, ticketNumber: e.target.value })} className="text-sm font-medium leading-none" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="volumeMuatan" className="text-sm text-muted-foreground">
                Volume Muatan
              </label>
              <Input id="volumeMuatan" type="text" value={ticket.payloadVolume} onChange={(e) => setTicket({ ...ticket, payloadVolume: e.target.value })} className="text-sm font-medium leading-none" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="barang" className="text-sm text-muted-foreground">
                Barang
              </label>
              <Input id="barang" type="text" value={ticket.product} onChange={(e) => setTicket({ ...ticket, product: e.target.value })} className="text-sm font-medium leading-none" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="pemasok" className="text-sm text-muted-foreground">
                Pemasok
              </label>
              <Input id="pemasok" type="text" value={ticket.supplier} onChange={(e) => setTicket({ ...ticket, supplier: e.target.value })} className="text-sm font-medium leading-none" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="operator" className="text-sm text-muted-foreground">
                Operator
              </label>
              <Input id="operator" type="text" value={ticket.operator} onChange={(e) => setTicket({ ...ticket, operator: e.target.value })} className="text-sm font-medium leading-none" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="noKendaraan" className="text-sm text-muted-foreground">
                No. Kendaraan
              </label>
              <Input id="noKendaraan" type="text" value={ticket.carNumber} onChange={(e) => setTicket({ ...ticket, carNumber: e.target.value })} className="text-sm font-medium leading-none" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="scanIsi" className="text-sm text-muted-foreground">
                Scan Isi
              </label>
              <Input id="scanIsi" type="text" value={ticket.scannedEmptyAt} onChange={(e) => setTicket({ ...ticket, scannedEmptyAt: e.target.value })} className="text-sm font-medium leading-none" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="scanKosong" className="text-sm text-muted-foreground">
                Scan Kosong
              </label>
              <Input id="scanKosong" type="text" value={ticket.scannedPayloadAt} onChange={(e) => setTicket({ ...ticket, scannedPayloadAt: e.target.value })} className="text-sm font-medium leading-none" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="createdAt" className="text-sm text-muted-foreground">
                Created At
              </label>
              <Input id="createdAt" type="text" value={ticket.createdAt} onChange={(e) => setTicket({ ...ticket, createdAt: e.target.value })} className="text-sm font-medium leading-none" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
          <Button onClick={handleSave} variant="outline" className="bg-primary text-white" size={'lg'}>
            <Save className="mr-2 h-4 w-4" />
            <span>Ubah dan Simpan</span>
          </Button>

            <div className="flex items-center">
              <ShieldAlert className="mr-2 h-4 w-4 text-destructive" /> 
              <span className="text-xs text-gray-500 mt-2 inline">Kemungkinan ada kesalahan mohon untuk di cek kembali.</span>
            </div>
          </CardFooter>
        </Card>
        </div>
      
      )}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-80 py-3 px-1 mb-3 flex flex-col items-center rounded-md">
        <Button onClick={handleClick} variant="outline" className="bg-primary text-white" size={'lg'}>
          <ArrowUpFromLine className="mr-2 h-4 w-4" />
          <span>Scan Surat Jalan</span>
        </Button>

        <Input id="picture" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
      </div>
    </main>
  );
}