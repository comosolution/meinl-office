import { GLS_API } from "@/app/lib/config";
import { isPreview } from "@/app/lib/utils";

export async function POST(request: Request) {
  const user = isPreview
    ? process.env.GLS_API_USER
    : process.env.GLS_API_USER_PROD;
  const pass = isPreview
    ? process.env.GLS_API_PASSWORD
    : process.env.GLS_API_PASSWORD_PROD;
  const contactId = isPreview
    ? process.env.GLS_API_CONTACT_ID
    : process.env.GLS_API_CONTACT_ID_PROD;

  if (!user || !pass || !contactId) {
    return Response.json(
      { error: "API credentials not configured" },
      { status: 500 },
    );
  }

  const auth = Buffer.from(`${user}:${pass}`).toString("base64");

  try {
    const { Address, PickupDate, ShipmentReference, Quantity } =
      await request.json();

    const options = {
      method: "POST",
      headers: {
        Authorization: "Basic " + auth,
        "Content-Type": "application/glsVersion1+json",
      },
      body: JSON.stringify({
        Shipment: {
          IncotermCode: "10",
          Product: "PARCEL",
          ShipmentReference,
          Service: [
            {
              PickAndReturn: {
                ServiceName: "service_pickandreturn",
                PickupDate,
                SendEMailToShipper: true,
                SendEMailToConsignee: true,
                SendSMSToShipper: false,
              },
            },
          ],
          Consignee: {
            Address,
          },
          Shipper: {
            ContactID: contactId,
          },
          ShipmentUnit: Array.from({ length: Quantity }, () => ({})),
        },
        PrintingOptions: {
          ReturnLabels: {
            TemplateSet: "NONE",
            LabelFormat: "PDF",
          },
        },
      }),
    };

    const response = await fetch(GLS_API, options);

    if (!response.ok) {
      return Response.json(
        { error: "Failed to create GLS return" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to process GLS return request" },
      { status: 500 },
    );
  }
}
