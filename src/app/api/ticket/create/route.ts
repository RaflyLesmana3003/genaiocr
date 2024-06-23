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
          key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCkcPmxXNvr2KVH\nJDwI0GTnAdoHSdTB4aWmgruzdz8sFAXQ9wLlrHvXs6pN4S/NHqQKP7i7pfJv2es6\n1quVU4JAh4FEch6wgdeyOUBOhfNNuI/CEeOzXzLfU0/317RbPcfonUiWjNmB4JHf\n+RQ+VS39pASEuibqQ48PSeVU2vTppNbef4pRLeCB5MEF+trFcBnpXhyEAdvOexwc\nDJsRnCeLjRgbjvjXROF/74MQOpUkQO3A20R5j1hTfMsS4qwdTlMkrGT4MSreyjZ1\nEgB9C4rokENAiU2kISAM3O/Fa9bf0RmGmuwqU1CXb9FiiVe9q1ukmMRUlfq6tCMJ\n1xfNDOYfAgMBAAECggEAAWiQ+u/srPciE0Xq2GMl5MSjSsSwdH4A8+LSxhVouRvt\ndii8zEgkl2hhNmGODe0L7U/hE9phWovnSThlfStF8P+NdTn1AVYGCZoWmZWUIT+f\ncO4Y9oRY5IjLeo1NF4BOogjBgmiabv5ZbC2vUAldZ3rBfybeW8tQV7UuUwJnw/Mz\nTEBAspKTZzPOZ4Ew3n5eGohg5aHocecpm1IIm6miAiNM0nFHM/8TZDPLVXitXbkl\nGqdW38f3ugS6xX2WZ30nWHr6az9+c3eLtpQGb9sAR4jmTbASlbgZ7TDN7pj57tu6\nAZn8N+bvP1Ex2b5mu3ra3HnKno/2+zXHQMJzDrdGQQKBgQDhOep9IZQfm7ndTQhp\njgcULuSB6Qq/cxh1W3+dC17AJKuMF8fENj9F/lGBjEbKxWdRFpTPQkq3lKm5aJ6T\n7uSvmhrNncGeIi1quBWxueq8ykBHGAwLulKtbYVfqQZBSVSf+KQensqlkIR6v04p\nLyEV1A+X5bhE/de/Mnjh4m2bKQKBgQC66ORG4X19MyVKzTK6VFaB+TDlFvMfe8rb\nIWYbp5L9F9evGLYJe3+AeN4Qv4noSaNrgLlLqOX+F2VBTHVlhi1c3ggPWFjiV16J\ntJeDHHey0IyP9O9zkQS6ZO/7Z7AivKVuAOTyYpItWDMqu3B5tVdXwQlIPkHyUEbl\na5H7An1oBwKBgAF157BiDFzcHKtzuW89zYvy9eZlxX0SWQFB06UIEtg6JKam7NO3\n6lcg3BRz/W2JNC9Rbyuc6XEhVKxwIj8hWHhPDodw03WcESFVCkb5xqzsvtf3LvTQ\ng4K+aBQDu5emyxayfRX5v6StOD63iOE5fgRvOJ6qjbRc1Q5XXHNSjZVpAoGAMKqD\nBZGgwwCWLSvQkYN0ItNnT77x/riU0QmZNIolU5Dpr8WXYFCvmhvedi3pEnpZ+pvB\no1mOyOH+k0n9JzoQhaWqI5S1T/m/u8sxyAmZgQ2cC7+SuVyBBqdRdPxCeEj2KfZB\npnrT5MqaR/4WAxqca1Tvvce4FAei7glcMScsz/ECgYEAq69xBFgawv1oePn4X6NX\n9gX/9E1eWRV8888GZ8Rnv4wuuZXccX6MVt0m7PI1Qf+gcO0C1Mfk5Lv1bCqarSX0\ngQNEY0R71oH8D7x2U6j5kX/wHqPaL3nJwi5izoROLRoX2P+XT8ISnSBUCegGH4Nw\nlv0HpizeXnngGqgvHWyoMTI=\n-----END PRIVATE KEY-----\n",
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
                json.payloadVolume,
                json.product,
                json.supplier,
                json.operator,
                json.driver,
                json.carNumber,
                json.scannedPayloadAt,
                json.scannedEmptyAt,
                json.createdAt,
                json.imageUrl,
                new Date().toLocaleDateString("en-US", {year: 'numeric', month: '2-digit', day: '2-digit'}),
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