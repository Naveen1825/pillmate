import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json(
        { error: "Missing imageBase64 in request body" },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "moonshotai/Kimi-K2.5:fastest",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Analyze this prescription image. It may be in ANY language.

Return ONLY valid JSON (no markdown):
{
    "detected_language": "language code (en/es/hi/ar/zh/fr/de/pt/ru/ja)",
    "detected_language_name": "language name",
    "medications": [
        {
            "name_english": "medication name in English",
            "dicription": "dicription of the megication in 30 to 40 words",
            "megication_importance": "Importance of taking that medicin",
            "timing": ["morning", "afternoon", "evening", "night"],
            "with_food": ["before food", "after food", "with food"]
        }
    ]
}

If unclear, return: {"detected_language": "unknown", "detected_language_name": "Unknown", "medications": []}`,
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${imageBase64}`,
                  },
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    console.log('Raw Hugging Face Response:', data);

    if (!response.ok) {
      console.error('Hugging Face API Error:', data);
      return NextResponse.json(
        { error: "Failed to analyze prescription", details: data },
        { status: response.status }
      );
    }

    // Extract the content from Hugging Face response
    let responseText = data.choices?.[0]?.message?.content;
    console.log('Response Text:', responseText);

    if (!responseText) {
      return NextResponse.json(
        { error: "No content in Hugging Face response" },
        { status: 500 }
      );
    }

    // Strip markdown code blocks if present
    if (responseText.includes('```json')) {
      responseText = responseText.replace(/```json\n?/, '').replace(/```$/, '');
    }

    // Parse JSON response
    const analysis = JSON.parse(responseText);
    console.log('Parsed Analysis:', analysis);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error in analyze route:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
