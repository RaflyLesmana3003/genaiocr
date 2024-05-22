'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ArrowUpFromLine, ShieldAlert } from "lucide-react";
import React, { useEffect } from "react";
import axios from 'axios';
import { Ticket } from "@/type/ticket";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

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
        
        const formData = new FormData();
        formData.append('image', fileToUpload);

        try {
          const response = await axios.post('/api/scans/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
              const total = progressEvent.total ?? 0; // Adjusted for lint error
              const percentCompleted = Math.round((progressEvent.loaded * 100) / total);
              setUploadProgress(percentCompleted);
            },
          });

          if (response.status === 200 && response.data) {
            setTicket(response.data.data);
            toast.success("Ticket Berhasil di scan.");
            setStatus(false)
            setTimeout(() => {
              scrollToBottom();
            }, 500);
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


  return (
    <main className="min-h-64">
      {!selectedImage && (
        <div className="flex justify-center flex-col px-5 mb-24">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Scan tiket payload
          </h1>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Once upon a time, in a far-off land, there was a very lazy king who
            spent all day lounging on his throne. One day, his advisors came to him
            with a problem: the kingdom was running out of money.
          </p>
          <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            The King's Plan
          </h2>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            The king thought long and hard, and finally came up with{" "}
            <a
              href="#"
              className="font-medium text-primary underline underline-offset-4"
            >
              a brilliant plan
            </a>
            : he would tax the jokes in the kingdom.
          </p>
          <blockquote className="mt-6 border-l-2 pl-6 italic">
            "After all," he said, "everyone enjoys a good joke, so it's only fair
            that they should pay for the privilege."
          </blockquote>
        </div>
      )}


      {selectedImage && (
        <div className="mb-4 w-full flex flex-col items-center">
          <div className="w-full h-1/2 flex justify-center rounded-lg">
            <img src={selectedImage} alt="Selected" className="w-3/4 max-h-full object-cover rounded-lg shadow" />
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

      {ticket && (
        <div className="flex justify-center mb-32">
        <Card className="w-3/4">
          <CardHeader>
            <CardTitle><Badge variant="outline">Hasil ticket</Badge></CardTitle>
            <CardDescription>No. {ticket.ticketNumber} - {ticket.createdAt}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex flex-column gap-2 justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Volume Muatan
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {ticket.payloadVolume}
                </p>
              </div>
            </div>
            <div className="flex flex-column gap-2 justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Barang
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {ticket.product}
                </p>
              </div>
            </div>
            <div className="flex flex-column gap-2 justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Pemasok
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {ticket.supplier}
                </p>
              </div>
            </div>
            <div className="flex flex-column gap-2 justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Operator
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {ticket.operator}
                </p>
              </div>
            </div>
            <div className="flex flex-column gap-2 justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  No. Kendaraan
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {ticket.carNumber}
                </p>
              </div>
            </div>
            <div className="flex flex-column gap-2 justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Scan Isi
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {ticket.scannedEmptyAt}
                </p>
              </div>
            </div>
            <div className="flex flex-column gap-2 justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Scan Kosong
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {ticket.scannedPayloadAt}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <ShieldAlert className="mr-2 h-4 w-4 text-destructive" /> <span className="text-xs text-gray-500 mt-2 inline">Kemungkinan ada kesalahan mohon untuk di cek kembali.</span>
          </CardFooter>
        </Card>
        </div>
      
      )}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-80 py-3 px-1 mb-3 flex flex-col items-center rounded-md">
        <Button onClick={handleClick} variant="outline" className="bg-primary text-white" size={'lg'}>
          <ArrowUpFromLine className="mr-2 h-4 w-4" />
          <span>Upload Foto</span>
        </Button>

        <Input id="picture" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
      </div>
    </main>
  );
}