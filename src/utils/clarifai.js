
export async function getEmbedding(imageUrl) {
  try {
    const response = await fetch('https://dxbvyikkyypjcllwuqqn.supabase.co/functions/v1/get-embedding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl }),
    });

    const { embedding } = await response.json();
    return embedding || null;
  } catch (error) {
    console.error('❌ Error fetching embedding:', error);
    return null;
  }
}

export const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};
