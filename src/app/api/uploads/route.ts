import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file     = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const bytes  = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Clean filename
    const filename = file.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9.\-_]/g, "");

    const filepath = path.join(process.cwd(), "public", "images", filename);
    await writeFile(filepath, buffer);

    return NextResponse.json({
      success:  true,
      imagePath: `/images/${filename}`,
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}