import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { image, apiKey } = await req.json();

        if (!apiKey) {
            return NextResponse.json({ error: "API Key is required" }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        // Extract base64
        const base64Data = image.split(',')[1];

        const prompt = `
      Look at this image of a store sign.
      Write a Single React Functional Component that looks EXACTLY like this sign using Tailwind CSS.
      
      Requirements:
      1. Use ONLY Tailwind CSS for styling. No external CSS files.
      2. The component should accept a 'data' prop with the following keys: { name, price, size, promo, storeName, storeNum, storeAddress }.
      3. Use these keys to populate the text. If a key is missing, provide a reasonable default or hide the element.
      4. If the sign shows "SALE" or specific badges, use 'data.promo' to conditionally render them.
      5. The component should be designed for 8.5x11 inch paper (approx 816px width) or responsive.
      6. Return ONLY the code. Do not include markdown backticks or explanations.
      7. Name the component "CustomSign".
      8. Use 'lucide-react' for icons if needed.
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
