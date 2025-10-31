import { toast } from "react-hot-toast"; // make sure you've installed: npm install react-hot-toast

export async function sendMatchEmail(lostEmail, foundEmail, itemName) {
  try {
    // Step 1: Show a loading toast
    toast.loading("Sending email...");

    // Step 2: Call the Supabase function
    const response = await fetch("https://dxbvyikkyypjcllwuqqn.supabase.co/functions/v1/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ lostEmail, foundEmail, itemName }),
    });

    const result = await response.json();

    // Step 3: Dismiss loading toast
    toast.dismiss();

    // Step 4: Handle success or failure
    if (result.success) {
      toast.success("Email sent successfully!");
    } else {
      toast.error("Failed to send email.");
    }

    console.log("Email function result:", result);
    return result;
  } catch (error) {
    // Step 5: Handle network or unexpected errors
    toast.dismiss();
    toast.error("Error calling send-email function.");
    console.error("Error calling email function:", error);
    return { success: false, message: "Error calling send-email function" };
  }
}
