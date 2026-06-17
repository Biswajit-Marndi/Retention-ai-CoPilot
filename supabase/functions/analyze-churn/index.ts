import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AccountData {
  id: string;
  accountName: string;
  monthlyLogins: number;
  supportTickets: number;
  featureUsageChange: number;
  npsScore: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { accounts } = await req.json() as { accounts: AccountData[] };

    if (!accounts || !Array.isArray(accounts) || accounts.length === 0) {
      return new Response(JSON.stringify({ error: "No accounts provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const groqApiKey = Deno.env.get("GROQ_API_KEY");
    if (!groqApiKey) {
      return new Response(JSON.stringify({ error: "GROQ_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const analyses = [];

    for (const account of accounts) {
      const prompt = `You are a Customer Success Manager.
Return valid JSON only.
Schema:
{
  "risk_level": "High" | "Medium" | "Low",
  "confidence": <number between 0-100>,
  "risk_factors": ["factor 1", "factor 2", "factor 3"],
  "evidence": ["Monthly Logins: <value> — <why it contributed>", "Support Tickets: <value> — <why it contributed>", ...],
  "interventions": ["Schedule a 30-day check-in call to re-engage the stakeholder", "Set up a feature walkthrough for underutilized capabilities", ...],
  "explanation": "2-3 sentence explanation of why this account is at risk",
  "recommended_action": "specific actionable recommendation"
}
Do not return markdown.
Do not return prose outside JSON.

Customer: ${account.accountName}
- Monthly Logins: ${account.monthlyLogins}
- Feature Adoption: ${account.featureUsageChange}%
- Support Tickets (last 30 days): ${account.supportTickets}
- NPS Score: ${account.npsScore}

The "evidence" field must list the raw metrics that most contributed to the risk assessment, each as a short bullet describing the metric value and why it signals churn risk. Include only the metrics that are concerning; omit healthy ones.

The "interventions" field must contain 2-4 specific, actionable steps a Customer Success Manager should take to reduce churn risk. Write each from a CSM perspective using first-person intent (e.g. "Schedule a...", "Arrange a...", "Create a..."). Each intervention must directly address one of the identified risk factors. Be concrete — specify timeframes, meeting types, or deliverables where possible. Avoid vague advice like "monitor the account" or "keep an eye on it".

Risk scoring guidelines:
- High: login < 5, OR support > 10, OR nps < 0, OR feature usage decline > 30%
- Medium: login 5-15, OR support 5-10, OR nps 0-6, OR feature usage decline 10-30%
- Low: otherwise healthy metrics`;

      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${groqApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: "You are a customer success analytics expert. Always respond with valid JSON only, no markdown formatting." },
              { role: "user", content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 500,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Groq API error for ${account.accountName}:`, errorText);
          const fallbackEvidence: string[] = [];
          const fallbackInterventions: string[] = [];
          if (account.monthlyLogins < 15) {
            fallbackEvidence.push(`Monthly Logins: ${account.monthlyLogins} — Below healthy threshold`);
            fallbackInterventions.push("Schedule a re-engagement call this week to understand reduced login activity");
          }
          if (account.supportTickets > 5) {
            fallbackEvidence.push(`Support Tickets: ${account.supportTickets} — Elevated volume indicates frustration`);
            fallbackInterventions.push("Escalate open support tickets and arrange a root-cause review with the support team");
          }
          if (account.npsScore < 7) {
            fallbackEvidence.push(`NPS Score: ${account.npsScore} — Below acceptable range`);
            fallbackInterventions.push("Conduct a detractor interview to uncover pain points and build a remediation plan");
          }
          if (account.featureUsageChange < 0) {
            fallbackEvidence.push(`Feature Adoption: ${account.featureUsageChange}% — Declining usage trend`);
            fallbackInterventions.push("Arrange a tailored feature walkthrough to highlight underutilized capabilities");
          }
          if (fallbackEvidence.length === 0) fallbackEvidence.push("No strongly concerning metrics detected");
          if (fallbackInterventions.length === 0) fallbackInterventions.push("Schedule a routine check-in call to maintain engagement");

          analyses.push({
            accountId: account.id,
            accountName: account.accountName,
            riskLevel: "Medium",
            evidence: fallbackEvidence,
            interventions: fallbackInterventions,
            churnExplanation: "Unable to generate AI analysis. Using fallback assessment based on metrics.",
            topRiskFactors: [
              account.monthlyLogins < 15 ? "Below average login activity" : "Login activity stable",
              account.supportTickets > 5 ? "Elevated support tickets" : "Support volume normal",
              account.npsScore < 7 ? "NPS score needs attention" : "NPS score acceptable"
            ],
            recommendedAction: "Review account metrics manually and schedule check-in call.",
            confidenceScore: 60,
          });
          continue;
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || "";

        let analysis;
        try {
          analysis = JSON.parse(content);
        } catch {
          console.error("Failed to parse Groq response:", content);
          analysis = {
            riskLevel: "Medium",
            churnExplanation: "Unable to parse AI response. Using fallback assessment.",
            riskFactors: ["Manual review recommended"],
            evidence: [`Monthly Logins: ${account.monthlyLogins}`, `Support Tickets: ${account.supportTickets}`, `NPS Score: ${account.npsScore}`],
            interventions: ["Schedule a check-in call to review account health", "Audit recent support interactions for recurring issues"],
            recommendedAction: "Review account manually and schedule follow-up.",
          };
        }

        analyses.push({
          accountId: account.id,
          accountName: account.accountName,
          riskLevel: analysis.risk_level || "Medium",
          evidence: analysis.evidence || [],
          interventions: analysis.interventions || [],
          churnExplanation: analysis.explanation || "Analysis unavailable.",
          topRiskFactors: analysis.risk_factors || ["Standard monitoring recommended"],
          recommendedAction: analysis.recommended_action || "Continue monitoring account.",
          confidenceScore: analysis.confidence || Math.floor(70 + Math.random() * 25),
        });
      } catch (error) {
        console.error(`Error analyzing ${account.accountName}:`, error);
        analyses.push({
          accountId: account.id,
          accountName: account.accountName,
          riskLevel: "Medium",
          evidence: [`Monthly Logins: ${account.monthlyLogins}`, `Support Tickets: ${account.supportTickets}`, `NPS Score: ${account.npsScore}`],
          interventions: ["Schedule a check-in call to review account health", "Audit recent support interactions for recurring issues"],
          churnExplanation: "Analysis error occurred. Using fallback assessment.",
          topRiskFactors: ["Manual review recommended"],
          recommendedAction: "Review account manually.",
          confidenceScore: 50,
        });
      }
    }

    return new Response(JSON.stringify({ analyses }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
