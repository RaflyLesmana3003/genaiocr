import { BaseResponse } from "@/type/baseResponse";
import { HumanMessage } from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { MessageContent } from "langchain/schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
   const authHeader = req.headers.get('authorization');
   const token = authHeader?.replace(/^Bearer\s+/, "");

   const prompt = `give me json string format about this ticket. result should be plain string no markdown and no new line

   you should response with this output format and rule, if no data, add null
   
   ticketNumber = No. Ticket
   carNumber = No. Kendaraan
   product = Nama Barang
   supplier = Pemasok
   payloadVolume = Volume Muatan
   scannedPayloadAt = Scan ISI
   scannedEmptyAt = Scan Kosong
   operator = Operator
   createdAt = Waktu Cetak`

   try {
      const json = await req.json();
      const imageUrl = json.image;
      if (!imageUrl || typeof imageUrl !== 'string') {
         throw new Error('Image URL is missing or invalid');
      }

      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
         throw new Error('Failed to fetch image from URL');
      }
      const imageArrayBuffer = await imageResponse.arrayBuffer();
      const imageBase64 = Buffer.from(imageArrayBuffer).toString('base64');

      const model = new ChatGoogleGenerativeAI({
         modelName: "gemini-1.5-flash-latest",
         maxOutputTokens: 2048,
      });

      const input = [
         new HumanMessage({
            content: [
               {
                  type: "text",
                  text: prompt,
               },
               {
                  type: "image_url",
                  image_url: `data:image/png;base64,${imageBase64}`,
               },
            ],
         }),
      ];
      const res = await model.invoke(input);
      console.log(res.content);

      const contentObject = JSON.parse(res.content.toString());
      const baseResponse: BaseResponse<MessageContent> = {
         status: 0,
         message: 'success',
         data: contentObject,
      };

      const response = NextResponse.json(baseResponse, {
         status: 200,
      });
      return response;
   } catch (error) {
      console.log(error)
      return new NextResponse(JSON.stringify({ error: error }), {
         status: 500,
         headers: {
            'Content-Type': 'application/json',
         },
      });
   }
}