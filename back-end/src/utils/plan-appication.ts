export const formatMoney = (
  amount: number | string,
  locale = "en-IN",
  currency = "INR"
): string => {
  if (typeof amount === "string" && isNaN(Number(amount))) {
    return amount;
  }

  const numericAmount = typeof amount === "string" ? Number(amount) : amount;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(numericAmount);
};

export const generateHtmlContent = (data: PlanApplicationData) => {
  const {
    name,
    email,
    phone,
    whatsapp,
    location,
    planId,
    planTitle,
    planPrice,
  } = data;

  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #2c3e50;">New Plan Application Received</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tbody>
          <tr style="background: #f8f8f8;">
            <td style="padding: 8px; font-weight: bold;">Plan</td>
            <td style="padding: 8px;">${planTitle} (${formatMoney(planPrice)})</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Name</td>
            <td style="padding: 8px;">${name}</td>
          </tr>
          <tr style="background: #f8f8f8;">
            <td style="padding: 8px; font-weight: bold;">Email</td>
            <td style="padding: 8px;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Phone</td>
            <td style="padding: 8px;">${phone}</td>
          </tr>
          <tr style="background: #f8f8f8;">
            <td style="padding: 8px; font-weight: bold;">WhatsApp</td>
            <td style="padding: 8px;">${whatsapp}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Location</td>
            <td style="padding: 8px;">${location}</td>
          </tr>
          <tr style="background: #f8f8f8;">
            <td style="padding: 8px; font-weight: bold;">Plan ID</td>
            <td style="padding: 8px;">${planId}</td>
          </tr>
        </tbody>
      </table>
      <p style="margin-top: 20px; font-size: 0.9em; color: #666;">
        This is an automated email from your website application.
      </p>
    </div>
  `;
};

export const generateTextContent = (data: PlanApplicationData) => {
  const {
    name,
    email,
    phone,
    whatsapp,
    location,
    planId,
    planTitle,
    planPrice,
  } = data;

  return `
New Plan Application Received

Plan: ${planTitle} (${formatMoney(planPrice)})
Name: ${name}
Email: ${email}
Phone: ${phone}
WhatsApp: ${whatsapp}
Location: ${location}
Plan ID: ${planId}

This is an automated email from your website application.
  `.trim();
};

export interface PlanApplicationData {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
  planId: string;
  planTitle: string | number;
  planPrice: string | number;
}