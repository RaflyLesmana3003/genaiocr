import { BaseResponse } from "@/type/baseResponse";
import { MessageContent } from "langchain/schema";
import { NextResponse } from "next/server";
import { google } from "googleapis"

export async function POST(req: Request) {
    
    
   try {
      const json = await req.json();

      try {
        const auth = new google.auth.JWT({
          email: process.env.NEXT_PUBLIC_GOOGLE_EMAIL_SERVICE_ACCOUNT,
          key: process.env.NEXT_PUBLIC_GOOGLE_KEY_SERVICE_ACCOUNT,
          scopes: ["https://www.googleapis.com/auth/spreadsheets"]
        })
        const sheet = google.sheets("v4")
        await sheet.spreadsheets.values.append({
          spreadsheetId: "1pWv6ltDKJJW-MZxY8pPRVoaOaOC5qBzSMEbJ6ddSu28",
          auth: auth,
          range: "scanned",
          valueInputOption: "RAW",
          requestBody: {
            values: [[
                json.ticketNumber,
                json.supplier,
                json.product,
                json.payloadVolume,
                json.carNumber,
                json.scannedPayloadAt,
                json.scannedEmptyAt,
                json.operator,
                json.createdAt,
            ]]
          }
        })
      } catch (error) {
        if (error) {
          throw error;
        }
      }

      const baseResponse: BaseResponse<MessageContent> = {
        status: 0,
        message: 'success',
        data: "",
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