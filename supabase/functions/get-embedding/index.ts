import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, content-type, apikey, x-client-info",
  };

  // ✅ Handle preflight (CORS)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // ✅ Reject other methods
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return new Response("Missing imageUrl", { status: 400, headers: corsHeaders });
    }

    const clarifaiRes = await fetch(
      "https://api.clarifai.com/v2/users/clarifai/apps/main/models/CLIP-ViT-L-14-DataComp-XL-s13B-b90K/versions/54772a548e6f42509cb1fd9fc43762bb/outputs",
      {
        method: "POST",
        headers: {
          Authorization: `Key ${Deno.env.get("CLARIFAI_PAT")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: [{ data: { image: { url: imageUrl } } }],
        }),
      }
    );

    const result = await clarifaiRes.json();
    const embedding = result.outputs?.[0]?.data?.embeddings?.[0]?.vector;

    return new Response(JSON.stringify({ embedding }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response("Internal Server Error", {
      status: 500,
      headers: corsHeaders,
    });
  }
});