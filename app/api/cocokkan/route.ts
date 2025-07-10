export async function POST(req: Request) {
  const { source_sentence, sentences } = await req.json();

  const response = await fetch('https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/sentence-similarity', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.HF_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: {
        source_sentence,
        sentences,
      },
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    return new Response(JSON.stringify({ error: result }), { status: 500 });
  }

  return Response.json(result); // array of scores
}
