import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export const dynamic = "force-dynamic";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    // Check cloudinary config
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return NextResponse.json(
        { error: "Cloudinary not configured" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file     = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Convert to buffer
    const bytes  = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder:        "mama-soups",
              resource_type: "image",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result as { secure_url: string });
            }
          )
          .end(buffer);
      }
    );

    console.log("✅ Uploaded:", result.secure_url);

    return NextResponse.json({
      success:   true,
      imagePath: result.secure_url,
    });

  } catch (error) {
    console.error("❌ Upload error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}