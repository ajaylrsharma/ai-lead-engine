import os
import json
import anthropic

_client = None


def _get_client():
    global _client
    if _client is None:
        _client = anthropic.Anthropic(api_key=os.environ.get('ANTHROPIC_API_KEY', ''))
    return _client


def score_lead(lead) -> dict:
    prompt = (
        f"Score this sales lead from 0–100 and explain why in 2-3 sentences.\n\n"
        f"Lead:\n"
        f"- Name: {lead.name}\n"
        f"- Company: {lead.company}\n"
        f"- Category: {lead.category}\n"
        f"- Source: {lead.source}\n"
        f"- Website: {lead.website or 'none'}\n"
        f"- Notes: {lead.notes or 'none'}\n\n"
        f"Consider: business legitimacy, reachability, and likelihood of needing outreach services.\n\n"
        f"Return ONLY valid JSON, no markdown:\n"
        f'{{\"score\": <0-100>, \"reasoning\": \"<explanation>\"}}'
    )
    try:
        response = _get_client().messages.create(
            model="claude-opus-4-7",
            max_tokens=256,
            messages=[{"role": "user", "content": prompt}],
        )
        text = response.content[0].text.strip()
        # Strip markdown code fences if present
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        return json.loads(text.strip())
    except Exception:
        return {"score": 50, "reasoning": "Automatic scoring unavailable."}


def generate_email(lead, goal: str, brand_voice: str = "professional") -> dict:
    prompt = (
        f"Write a cold outreach email for this lead.\n\n"
        f"Lead:\n"
        f"- Name: {lead.name}\n"
        f"- Company: {lead.company}\n"
        f"- Category: {lead.category}\n"
        f"- Website: {lead.website or 'none'}\n\n"
        f"Campaign goal: {goal}\n"
        f"Voice/tone: {brand_voice}\n\n"
        f"Rules:\n"
        f"- Under 150 words\n"
        f"- Value-first, no fluff\n"
        f"- One clear CTA in the last line\n"
        f"- Subject line under 60 characters\n\n"
        f"Return ONLY valid JSON, no markdown:\n"
        f'{{\"subject\": \"<subject line>\", \"body\": \"<email body>\"}}'
    )
    try:
        response = _get_client().messages.create(
            model="claude-opus-4-7",
            max_tokens=512,
            messages=[{"role": "user", "content": prompt}],
        )
        text = response.content[0].text.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        return json.loads(text.strip())
    except Exception:
        return {
            "subject": f"Quick note for {lead.company or lead.name}",
            "body": (
                f"Hi {lead.name},\n\n"
                f"I came across {lead.company or 'your business'} and wanted to reach out about {goal}.\n\n"
                f"Would you be open to a 15-minute call this week?\n\n"
                f"Best,"
            ),
        }
