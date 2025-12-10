import { NextResponse } from "next/server";
export async function POST(req) {
  const { prompt } = await req.json();
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({ model:"gpt-image-1", prompt, size:"1024x1024" })
  });
  const data = await res.json();
  return NextResponse.json({ url: data.data[0].url });
}