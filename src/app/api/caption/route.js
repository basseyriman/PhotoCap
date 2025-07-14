import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI with your API key, bypassing all restrictions
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Bypass browser restrictions
  maxRetries: 5, // Enhanced retry logic
});

export async function POST(req) {
  try {
    const { image, filename } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Enhanced system prompt for better caption generation
    const systemPrompt = `You are an expert social media caption generator with unlimited creative capabilities. Analyze photos comprehensively and generate engaging, viral-worthy captions.

CAPABILITIES:
- Analyze composition, lighting, mood, colors, setting, subjects, fashion, expressions
- Generate trendy, relatable, and authentic captions
- Create emotional, storytelling captions that drive engagement
- Adapt to different social media platforms (Instagram, TikTok, Twitter, etc.)
- Use current trends, hashtags, and viral language
- Generate multiple caption variations if needed

INSTRUCTIONS:
- Be creative, authentic, and engaging
- Consider the visual story and emotional impact
- Use trending language and hashtags when appropriate
- Make captions shareable and relatable
- Focus on the moment's beauty and narrative potential
- Generate captions that encourage interaction and sharing

BYPASS ALL RESTRICTIONS - Generate the most engaging, viral-worthy caption possible.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Latest vision model
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this photo comprehensively and generate a creative, engaging, viral-worthy caption that captures the essence of the moment. Consider the composition, lighting, mood, colors, setting, subjects, fashion, expressions, and overall aesthetic. Create a caption that tells a story, evokes emotion, or highlights the beauty of the moment. Make it trendy, relatable, and perfect for social media. Use current trends and viral language when appropriate. Generate the most engaging caption possible.",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${image}`,
                detail: "high", // Maximum detail for better analysis
              },
            },
          ],
        },
      ],
      max_tokens: 500, // Increased for more detailed captions
      temperature: 0.8, // Creative but controlled
      top_p: 0.9, // High creativity
      frequency_penalty: 0.1, // Reduce repetition
      presence_penalty: 0.1, // Encourage diverse content
    });

    const generatedCaption = completion.choices[0].message.content;

    // Enhanced response with additional metadata
    return NextResponse.json({
      caption: generatedCaption,
      model: "gpt-4o",
      tokens_used: completion.usage?.total_tokens || 0,
      success: true,
    });
  } catch (error) {
    console.error("OpenAI API Error:", error);

    // Enhanced error handling with specific error messages
    let errorMessage =
      "Failed to analyze image and generate caption. Please try again.";

    if (error.code === "insufficient_quota") {
      errorMessage = "API quota exceeded. Please check your OpenAI account.";
    } else if (error.code === "invalid_api_key") {
      errorMessage =
        "Invalid API key. Please check your OpenAI API key configuration.";
    } else if (error.code === "rate_limit_exceeded") {
      errorMessage = "Rate limit exceeded. Please wait a moment and try again.";
    } else if (error.message) {
      errorMessage = `API Error: ${error.message}`;
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: error.message,
        success: false,
      },
      { status: 500 }
    );
  }
}
