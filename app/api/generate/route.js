import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { image, apiKey, width, height } = await req.json();

        // Determine size metadata
        const hasCustomSize = width && height;
        const sizeMetadata = hasCustomSize ? `${width}x${height}` : "8.5x11";


        if (!apiKey) {
            return NextResponse.json({ error: "API Key is required" }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        // Extract base64
        const base64Data = image.split(',')[1];

        const prompt = `
      You are an expert React/Tailwind developer and graphic designer.
      Analyze the provided image of a store sign. Your goal is to replicate the DESIGN and LAYOUT of the sign, but ENHANCE it to look modern, premium, and clean.

      ### ASPECT RATIO & SIZING:
      1. **User Provided**: The user ${hasCustomSize ? 'sent specific dimensions: ' + width + 'x' + height : 'did NOT provide specific dimensions'}.
      2. **Visual Analysis**: ${hasCustomSize ? 'Respect the user provided dimensions.' : 'Visually analyze the uploaded photo. Determine its natural aspect ratio (Portrait, Landscape, or Square). If it looks like a standard 8.5x11 sign, use "8.5x11". If it is wider than it is tall, use "11x8.5" or "5x1". If it is a small square, use "4x4". Decide on the most logical common inch-based size.'}

      ### DESIGN & CONTENT RULES:
      1. **IMAGE DISREGARD**: COMPLETELY DISREGARD/IGNORE product photos. Do NOT include image tags.
      2. **LAYOUT FOCUS**: Replicate typographic layout, color scheme, and vibe.
      3. **DYNAMIC SCALING (CRITICAL)**: 
         - **NO Conditional Logic**: Do NOT add "if (size === ...)" checks. Hardcode the styles for exactly ${sizeMetadata}.
         - **Size-to-Font Mapping**:
           - **Shelf Talkers (e.g., 5x1, 4x1)**: Title: 'text-sm' (14px), Price: 'text-xl', Detail: 'text-[8px]'. Layout: Use 'flex-row'.
           - **Small Signs (e.g., 4x5, 5x7)**: Title: 'text-2xl' (24px), Price: 'text-5xl', Detail: 'text-xs'. Layout: Vertical.
           - **Standard Posters (8.5x11)**: Title: 'text-6xl' (60px), Price: 'text-9xl', Detail: 'text-xl'.
         - **Mandatory Limits**: NEVER use 'text-6xl' or larger if the sign width is less than 6 inches.
         - **Bleed Prevention**: Use 'overflow-hidden' and 'line-clamp-2' or 'line-clamp-3' for titles.
      4. **ENHANCEMENT**: Make it professional. Use clean spacing and modern contrasts.
      5. **STRICT INPUT DATA CONTRACT**:
         The component must accept a single prop 'data' with these OPTIONAL keys:
         { name: string, price: string|number, size: string, promo: string, 
           message1Content: string, message2Content: string, 
           storeName: string, storeNum: string, storeAddress: string }

      ### CODING RULES (CRITICAL):
      1. **Safe Destructuring**:
         const { name='', price=0, size='', promo='', message1Content='', message2Content='', storeName='', storeNum='', storeAddress='' } = data || {};

      2. **Robust Price Handling**:
         const priceStr = (price || '0.00').toString();
         const [dollars, cents] = priceStr.split('.');

      3. **Dynamic Content Mapping**:
         - Map prominent header text to {name}.
         - Map description/secondary text to {message1Content} or {message2Content}.
         - Do NOT hardcode specific product names. Use variables.

      4. **Styling & Layout**:
         - Use ONLY Tailwind CSS.
         - **Container**: Use 'w-full h-full p-2 flex items-center justify-between overflow-hidden'.
         - **Vertical Balance**: If height > 3in, use 'flex-col'. If height < 2in, use 'flex-row'.

      5. **Metadata & Export**:
         - At the end of the file, you MUST add exactly:
           CustomSign.size = "{DETECTED_OR_PROVIDED_SIZE}"; 
           export default CustomSign;

      ### OUTPUT FORMAT:
      - Return ONLY the raw JSX code. No markdown.
      - Component Name: "CustomSign" (import React).
    `;

        const imagePart = {
            inlineData: {
                data: base64Data,
                mimeType: "image/jpeg", // Assuming jpeg or png, api is flexible
            },
        };

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        let text = response.text();

        // Clean up markdown if present
        text = text.replace(/```javascript/g, '').replace(/```jsx/g, '').replace(/```/g, '');

        return NextResponse.json({ code: text });

    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
