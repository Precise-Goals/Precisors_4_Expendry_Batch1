import { NextResponse } from "next/server";
import { generateNonce, createAuthChallenge } from "@/lib/auth";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  const nonce = generateNonce(address);
  const message = createAuthChallenge(nonce);

  return NextResponse.json({
    success: true,
    nonce,
    message,
  });
}

export async function POST(request) {
  let address = null;
  try {
    const body = await request.json();
    address = body.address || null;
  } catch {
    // Body is optional
  }

  const nonce = generateNonce(address);
  const message = createAuthChallenge(nonce);

  return NextResponse.json(
    {
      success: true,
      nonce,
      message,
    },
    { status: 200 }
  );
}
