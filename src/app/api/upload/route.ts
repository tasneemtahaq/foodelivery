import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export const dynamic = "force-dynamic";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  console.log("📤 Upload API called");
  console.log("Cloud name:", process.env.CLOUDINARY_CLOUD_NAME);
  console.log("API Key exists:", !!process.env.CLOUDINARY_API_KEY);
  console.log("API Secret exists:", !!process.env.CLOUDINARY_API_SECRET);

  try {
    const formData = await request.formData();
    const file     = formData.get("file") as File;

    console.log("File received:", file?.name, file?.size);

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes  = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log("Buffer size:", buffer.length);

    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder:  "mama-soups",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary error:", error);
            reject(error);
          } else {
            console.log("✅ Cloudinary success:", result?.secure_url);
            resolve(result as { secure_url: string });
          }
        }
      );
      stream.end(buffer);
    });

    return NextResponse.json({
      success:   true,
      imagePath: result.secure_url,
    });

  } catch (error) {
    console.error("❌ Upload failed:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}