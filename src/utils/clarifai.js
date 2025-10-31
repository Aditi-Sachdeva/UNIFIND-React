
// export const getImageEmbedding = async (imageUrl) => {
//   try {
//     console.log("🔍 Requesting embedding for:", imageUrl);

//     // Use full Supabase function URL when running locally
//     const SUPABASE_FUNCTION_URL = "https://dxbvyikkyypjcllwuqqn.functions.supabase.co/get-embedding";

//     const response = await fetch(SUPABASE_FUNCTION_URL, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ imageUrl }),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("❌ Supabase function error:", errorText);
//       return null;
//     }

//     const { embedding } = await response.json();
//     console.log("✅ Embedding received:", embedding?.slice(0, 5)); // show first 5 values

//     return embedding;
//   } catch (error) {
//     console.error("❌ Network error while fetching embedding:", error.message);
//     return null;
//   }
// };

// export const cosineSimilarity = (vecA, vecB) => {
//   const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
//   const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
//   const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
//   return dotProduct / (magnitudeA * magnitudeB);
// };


import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  "https://dxbvyikkyypjcllwuqqn.supabase.co",
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const getImageEmbedding = async (imageUrl) => {
  try {
    console.log("🔍 Requesting embedding for:", imageUrl);

    const SUPABASE_FUNCTION_URL =
      "https://dxbvyikkyypjcllwuqqn.functions.supabase.co/get-embedding";

    // Get current session to extract access token
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const accessToken = session?.access_token;
    if (!accessToken) {
      console.error("❌ No access token found. User might not be logged in.");
      return null;
    }

    const response = await fetch(SUPABASE_FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // ✅ include auth header
      },
      body: JSON.stringify({ imageUrl }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Supabase function error:", errorText);
      return null;
    }

    const { embedding } = await response.json();
    console.log("✅ Embedding received:", embedding?.slice(0, 5));

    return embedding;
  } catch (error) {
    console.error("❌ Network error while fetching embedding:", error.message);
    return null;
  }
};

export const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};
