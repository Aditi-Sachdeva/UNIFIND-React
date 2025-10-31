import { serve } from "https://deno.land/std/http/server.ts";

serve(async (req) => {
 
  if (req.method === "OPTIONS") {
    return new Response("OK", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return new Response("Missing imageUrl", {
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const clarifaiRes = await fetch(
      "https://api.clarifai.com/v2/users/clarifai/apps/main/models/CLIP-ViT-L-14-DataComp-XL-s13B-b90K/versions/54772a548e6f42509cb1fd9fc43762bb/outputs",
      {
        method: "POST",
        headers: {
          Authorization: `Key ${Deno.env.get("CLARIFAI_PAT")}`, // 🔐 Secure token from Supabase secrets
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: [
            {
              data: {
                image: {
                  url: imageUrl,
                },
              },
            },
          ],
        }),
      }
    );

    const result = await clarifaiRes.json();
    const embedding = result.outputs?.[0]?.data?.embeddings?.[0]?.vector;

    if (!embedding) {
      return new Response("No embedding returned", {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    return new Response(JSON.stringify({ embedding }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response("Internal Server Error", {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});