export async function createBitrixLead(data: {
  name: string;
  lastName?: string;
  phone?: string;
  email?: string;
}) {
  const webhookUrl = process.env.BITRIX_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new Error("BITRIX_WEBHOOK_URL is not configured");
  }

  const formattedWebhookUrl = webhookUrl.endsWith("/")
    ? webhookUrl
    : `${webhookUrl}/`;

  const params = new URLSearchParams();

  params.append("FIELDS[TITLE]", "Gemini Voice Bot Lead");
  params.append("FIELDS[NAME]", data.name);

  if (data.lastName) {
    params.append("FIELDS[LAST_NAME]", data.lastName);
  }

  if (data.email) {
    params.append("FIELDS[EMAIL][0][VALUE]", data.email);
    params.append("FIELDS[EMAIL][0][VALUE_TYPE]", "WORK");
  }

  if (data.phone) {
    params.append("FIELDS[PHONE][0][VALUE]", data.phone);
    params.append("FIELDS[PHONE][0][VALUE_TYPE]", "WORK");
  }

  const response = await fetch(
    `${formattedWebhookUrl}crm.lead.add.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    }
  );

  const result = await response.json();

  if (!response.ok || result.error) {
    throw new Error(
      result.error_description || "Failed to create Bitrix lead"
    );
  }

  return result;
}
