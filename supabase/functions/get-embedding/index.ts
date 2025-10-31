<<<<<<< HEAD

// import { serve } from "https://deno.land/std/http/server.ts";

// serve(async (req) => {
 
//   if (req.method === "OPTIONS") {
//     return new Response("OK", {
//       headers: {
//         "Access-Control-Allow-Origin": "*",
//         "Access-Control-Allow-Methods": "POST, OPTIONS",
//         "Access-Control-Allow-Headers": "Content-Type",
//       },
//     });
//   }
//   if (req.method !== "POST") {
//     return new Response("Method Not Allowed", {
//       status: 405,
//       headers: {
//         "Access-Control-Allow-Origin": "*",
//       },
//     });
//   }

//   try {
//     const { imageUrl } = await req.json();

//     if (!imageUrl) {
//       return new Response("Missing imageUrl", {
//         status: 400,
//         headers: {
//           "Access-Control-Allow-Origin": "*",
//         },
//       });
//     }

//     const clarifaiRes = await fetch(
//       "https://api.clarifai.com/v2/users/clarifai/apps/main/models/CLIP-ViT-L-14-DataComp-XL-s13B-b90K/versions/54772a548e6f42509cb1fd9fc43762bb/outputs",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Key ${Deno.env.get("CLARIFAI_PAT")}`, 
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           inputs: [
//             {
//               data: {
//                 image: {
//                   url: imageUrl,
//                 },
//               },
//             },
//           ],
//         }),
//       }
//     );

//     const result = await clarifaiRes.json();
//     const embedding = result.outputs?.[0]?.data?.embeddings?.[0]?.vector;

//     if (!embedding) {
//       return new Response("No embedding returned", {
//         status: 500,
//         headers: {
//           "Access-Control-Allow-Origin": "*",
//         },
//       });
//     }

//     return new Response(JSON.stringify({ embedding }), {
//       headers: {
//         "Content-Type": "application/json",
//         "Access-Control-Allow-Origin": "*",
//       },
//     });
//   } catch (err) {
//     console.error("Error:", err);
//     return new Response("Internal Server Error", {
//       status: 500,
//       headers: {
//         "Access-Control-Allow-Origin": "*",
//       },
//     });
//   }
// });



import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  // ✅ Handle CORS preflight (OPTIONS)
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        // 👇 Exact lowercase names (required for browsers)
        "Access-Control-Allow-Headers":
          "authorization, content-type, apikey, x-client-info",
      },
    });
  }

  // ✅ Handle POST requests
=======
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
>>>>>>> 9fcc28ed6d71e0a01a83fc59f570f2a91e959f0a
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
<<<<<<< HEAD
    if (!imageUrl) {
      return new Response("Missing imageUrl", {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }

    // ✅ Optional auth header check
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ code: 401, message: "Missing authorization header" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers":
              "authorization, content-type, apikey, x-client-info",
          },
        }
      );
    }

    // Call Clarifai API
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

    if (!embedding) {
      return new Response("No embedding returned", {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }

=======

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

>>>>>>> 9fcc28ed6d71e0a01a83fc59f570f2a91e959f0a
    return new Response(JSON.stringify({ embedding }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
<<<<<<< HEAD
        "Access-Control-Allow-Headers":
          "authorization, content-type, apikey, x-client-info",
=======
>>>>>>> 9fcc28ed6d71e0a01a83fc59f570f2a91e959f0a
      },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response("Internal Server Error", {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
<<<<<<< HEAD
        "Access-Control-Allow-Headers":
          "authorization, content-type, apikey, x-client-info",
      },
    });
  }
});
=======
      },
    });
  }
});
>>>>>>> 9fcc28ed6d71e0a01a83fc59f570f2a91e959f0a
