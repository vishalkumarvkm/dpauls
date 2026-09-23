export async function createBitrixLead(data: {
  title?: string;
  name: string;
  lastName?: string;
  phone?: string;
  email?: string;
  travelType?: string;
  destination?: string;
}) {
  const webhookUrl = process.env.BITRIX_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new Error("BITRIX_WEBHOOK_URL is not configured in environment variables");
  }

  const formattedWebhookUrl = webhookUrl.endsWith("/")
    ? webhookUrl
    : `${webhookUrl}/`;

  const fields: Record<string, any> = {
    TITLE: data.title || "pravakta.ai Lead",
    NAME: data.name || "Valued Customer",
  };

  if (data.lastName) {
    fields.LAST_NAME = data.lastName;
  }

  if (data.email) {
    fields.EMAIL = [{ VALUE: data.email, VALUE_TYPE: "WORK" }];
  }

  if (data.phone) {
    fields.PHONE = [{ VALUE: data.phone, VALUE_TYPE: "WORK" }];
  }

  if (data.travelType) {
    fields.UF_CRM_TRAVEL_TYPE = data.travelType;
  }

  if (data.destination) {
    fields.UF_CRM_DESTINATION = data.destination;
  }

  console.log("[Bitrix CRM] Submitting lead payload:", fields);

  const response = await fetch(
    `${formattedWebhookUrl}crm.lead.add.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields }),
    }
  );

  const result = await response.json();

  if (!response.ok || result.error) {
    console.error("[Bitrix CRM Error]:", result);
    throw new Error(
      result.error_description || result.error || "Failed to create Bitrix lead"
    );
  }

  console.log("[Bitrix CRM Success] Lead ID created:", result.result);
  return result;
}
