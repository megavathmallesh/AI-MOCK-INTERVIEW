import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";
import axios from "axios";
import { json } from "stream/consumers";
import { aj } from "@/utils/arcjet";
import { currentUser, auth } from "@clerk/nextjs/server";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export async function POST(request: NextRequest) {
  try {

    const user = await currentUser()
    //  Get file from formData
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const jobTitle = formData.get("jobTitle") as string;
    const jobDescription = formData.get("jobDescription") as string;
    await auth();

    const decision = await aj.protect(request, { userId: user?.primaryEmailAddress?.emailAddress ?? "", requested: 5 }); // Deduct 5 tokens from the bucket
    console.log("Arcjet decision", decision);

    const isSubscribedUser = user?.publicMetadata?.plan === 'pro';


    if (decision.conclusion === 'DENY' && isSubscribedUser) {
      return NextResponse.json({
        status: 429,
        result: "You Have Reached Your Daily Limit. Please Try Again After 24 Hours."
      });
    }


    let webhookData: string | null = null;

    if (file) {
      // ✅ Convert file to buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      console.log("📤 Uploading file to ImageKit...");

      // ✅ Upload to ImageKit
      const uploadResponse = await imagekit.upload({
        file: buffer,
        fileName: `resume-${Date.now()}.pdf`,
      });

      console.log("✅ ImageKit Upload Success:", uploadResponse.url);

      try {
        console.log("📡 Calling n8n webhook...");

        const webhookUrl =
          "http://127.0.0.1:5678/webhook/generated-interview-question"; //  change if needed

        const result = await axios.post(
          webhookUrl,
          {
            resumeUrl: uploadResponse.url,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            timeout: 60000, // avoid hanging
          }
        );

        const textParts = (result.data ?? [])
          .flatMap((item: any) =>
            item.content?.parts?.map((part: any) => part.text ?? "") ?? []
          )
          .filter((txt: string) => txt !== "");

        webhookData = textParts.join("\n");
        console.log("✅ Webhook Success (textParts):", webhookData);

      } catch (webhookError: any) {
        console.error(
          "❌ Webhook Error:",
          webhookError.response?.data || webhookError.message
        );
      }

      // ✅ Final response
      return NextResponse.json(
        {
          success: true,
          fileUrl: uploadResponse.url,
          webhookResponse: webhookData,
        },
        { status: 200 }
      );
    }
    else {

      try {
        console.log("📡 Calling n8n webhook...");

        const webhookUrl =
          "http://127.0.0.1:5678/webhook/generated-interview-question"; // 🔥 change if needed

        const result = await axios.post(
          webhookUrl,
          {
            resumeUrl: null,
            jobTitle: jobTitle,
            jobDescription: jobDescription,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            timeout: 60000, // avoid hanging
          }
        );

        const textParts = (result.data ?? [])
          .flatMap((item: any) =>
            item.content?.parts?.map((part: any) => part.text ?? "") ?? []
          )
          .filter((txt: string) => txt !== "");

        webhookData = textParts.join("\n");
        console.log("✅ Webhook Success (textParts):", webhookData);


      } catch (webhookError: any) {
        console.error(
          "❌ Webhook Error:",
          webhookError.response?.data || webhookError.message
        );
      }

      // ✅ Final response
      return NextResponse.json(
        {
          success: true,
          fileUrl: null,
          webhookResponse: webhookData,
        },
        { status: 200 }
      );


    }

  } catch (error: any) {
    console.error("🔥 SERVER ERROR:", error);

    return NextResponse.json(
      {
        error: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}