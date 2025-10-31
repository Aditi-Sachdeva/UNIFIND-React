// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders });
  }

  let body;
  try {
    body = await req.json();
  } catch (err) {
    console.error("❌ Failed to parse JSON:", err);
    return new Response(JSON.stringify({ error: "Invalid JSON", details: String(err) }), { status: 400, headers: corsHeaders });
  }

  const { lostEmail, foundEmail, itemName } = body || {};
  console.log("📦 Received:", { lostEmail, foundEmail, itemName });

  const gmailUser = Deno.env.get("GMAIL_USER");
  const gmailPassword = Deno.env.get("GMAIL_APP_PASSWORD");

  if (!gmailUser || !gmailPassword) {
    console.error("❌ Gmail credentials not set");
    return new Response(JSON.stringify({ error: "Email credentials not configured" }), { status: 500, headers: corsHeaders });
  }

  if (!lostEmail || !foundEmail || !itemName) {
    console.log("⚠️ Missing fields");
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: corsHeaders });
  }

  const safeItemName = String(itemName);
  const safeLostEmail = String(lostEmail);
  const safeFoundEmail = String(foundEmail);

  try {
    const client = new SMTPClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 465,
        tls: true,
        auth: { username: gmailUser, password: gmailPassword },
      },
    });

    try {
      console.log("📧 Sending email to owner:", safeLostEmail);
      await client.send({
        from: gmailUser,
        to: safeLostEmail,
        subject: "🎉 Great News! Your Lost Item Has Been Found - UNIFIND",
        content: `Item: ${safeItemName}\nFinder: ${safeFoundEmail}`,
        html: `<div><strong>Item:</strong> ${safeItemName}<br/><strong>Finder:</strong> ${safeFoundEmail}</div>`,
      });
    } catch (sendErr) {
      console.error("❌ Failed sending to owner:", sendErr);
      return new Response(JSON.stringify({ error: "Failed to send to owner", details: String(sendErr) }), { status: 500, headers: corsHeaders });
    }

    try {
      console.log("📧 Sending email to finder:", safeFoundEmail);
      await client.send({
        from: gmailUser,
        to: safeFoundEmail,
        subject: "🎉 Thank You — Item Matched - UNIFIND",
        content: `Item: ${safeItemName}\nOwner: ${safeLostEmail}`,
        html: `<div><strong>Item:</strong> ${safeItemName}<br/><strong>Owner:</strong> ${safeLostEmail}</div>`,
      });
    } catch (sendErr) {
      console.error("❌ Failed sending to finder:", sendErr);
      return new Response(JSON.stringify({ error: "Failed to send to finder", details: String(sendErr) }), { status: 500, headers: corsHeaders });
    }

    await client.close();
    console.log("✅ Emails sent to both users");
    return new Response(JSON.stringify({ success: true, message: "Emails sent to both users" }), { status: 200, headers: corsHeaders });
  } catch (err) {
    console.error("❌ General email error:", err);
    return new Response(JSON.stringify({ error: "Email send failed", details: String(err) }), { status: 500, headers: corsHeaders });
  }
});
