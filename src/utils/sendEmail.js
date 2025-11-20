import { toast } from "react-hot-toast"; 

export async function sendMatchEmail(lostEmail, foundEmail, itemName) {
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
    console.log(result);

    toast.dismiss(toastId); 

    if (result.success) {
      toast.success("Email sent successfully!");
    } else {
      toast.error("Failed to send email.");
    }

  } catch (error) {
    toast.dismiss(toastId);
    toast.error("Cannot send email.");
    console.error("Error calling email function:", error);

  }
}
