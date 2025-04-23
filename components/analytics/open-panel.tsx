import { OpenPanelComponent } from "@openpanel/nextjs";

export default function OpenPanel() {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  const clientId = process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID;
  if (!clientId) {
    return null;
  }

  return (
    <OpenPanelComponent
      clientId={clientId}
      trackScreenViews={true}
      trackAttributes={true}
      trackOutgoingLinks={true}
    />
  );
}
