import { NextResponse } from "next/server";
export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("image");
  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization":`Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model:"gpt-4o-mini",
      messages:[
        { role:"user",
          content:[
            { type:"input_text", text:"Describe this photo in detail" },
            { type:"input_image", image_url:`data:image/png;base64,${base64}` }
          ]
        }
      ]
    })
  });
  const data = await res.json();
  return NextResponse.json({ analysis: data.choices[0].message.content });
}