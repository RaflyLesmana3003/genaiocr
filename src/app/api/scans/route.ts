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
      const formData = await req.formData();
      const imageFile = formData.get('image');
      if (!imageFile || typeof imageFile === 'string') {
         throw new Error('Image file is missing or invalid');
      }
      const imageBuffer = await imageFile.arrayBuffer();
      const imageBase64 = Buffer.from(imageBuffer).toString('base64');

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
      return new NextResponse(JSON.stringify({ error: 'Failed' }), {
         status: 500,
         headers: {
            'Content-Type': 'application/json',
         },
      });
   }
}