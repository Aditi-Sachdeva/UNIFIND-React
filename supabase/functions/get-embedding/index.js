import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  const { imageUrl } = await req.json();

  const response = await fetch(
    'https://api.clarifai.com/v2/users/clarifai/apps/main/models/CLIP-ViT-L-14-DataComp-XL-s13B-b90K/versions/54772a548e6f42509cb1fd9fc43762bb/output',
    {
      method: 'POST',
      headers: {
        'Authorization': '70a9e4d63ee74855ae5eb8ddae489c9b',
        'Content-Type': 'application/json',
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

  const result = await response.json();
  const embedding = result.outputs?.[0]?.data?.embeddings?.[0]?.vector;

  return new Response(JSON.stringify({ embedding }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
