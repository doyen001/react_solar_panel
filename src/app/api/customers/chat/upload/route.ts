import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { CUSTOMER_ACCESS_COOKIE } from "@/lib/auth/customer-cookies";
import { saveChatUploadToPublic } from "@/lib/server/chat-upload";

export async function POST(request: Request) {
  const jar = await cookies();
  if (!jar.get(CUSTOMER_ACCESS_COOKIE)?.value) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ message: "Invalid form data." }, { status: 400 });
  }

  const file = formData.get("file");
  const kindRaw = formData.get("kind");
  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Missing file." }, { status: 400 });
  }

  const uploadKind =
    kindRaw === "attachment" ? ("attachment" as const) : ("image" as const);

  const result = await saveChatUploadToPublic(file, uploadKind);
  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: 400 });
  }

  return NextResponse.json({
    url: result.url,
    filename: result.filename,
  });
}
