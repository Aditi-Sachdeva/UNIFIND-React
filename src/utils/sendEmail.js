import { toast } from "react-hot-toast"; // ensure: npm install react-hot-toast

export async function sendMatchEmail(lostEmail, foundEmail, itemName) {
  // Store loading toast id so it can be dismissed properly
  const toastId = toast.loading("Sending email...");

  try {
    const response = await fetch(
      "https://dxbvyikkyypjcllwuqqn.supabase.co/functions/v1/send-email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ lostEmail, foundEmail, itemName }),
      }
    );

    const result = await response.json();
    console.log("📨 Email function result:", result);

    toast.dismiss(toastId); // ensure the loading toast is cleared

    if (result.success) {
      toast.success("Email sent successfully!");
    } else {
      toast.error("Failed to send email.");
    }

    return result;
  } catch (error) {
    toast.dismiss(toastId);
    toast.error("Error calling send-email function.");
    console.error("Error calling email function:", error);

    return { success: false, message: "Error calling send-email function" };
  }
}
