"use server";

import Groq from "groq-sdk";

export async function analyzePasswordMetrics(
  entropy: number,
  crackTime: string,
  breachCount: number
) {
  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const prompt = `Act as a Senior Cybersecurity Auditor for Veritas. Provide a 2-sentence expert risk assessment and 3 high-entropy "Diceware" phrase alternatives based ONLY on these metrics: Entropy Score: ${entropy}, Crack Time: ${crackTime}, Breach Count: ${breachCount}. Do not ask for the password. Format as plain text.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
    });

    return chatCompletion.choices[0]?.message?.content || "Analysis unavailable.";
  } catch (error) {
    console.error("Groq API Error:", error);
    return "Error communicating with the security oracle.";
  }
}
