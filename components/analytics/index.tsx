import GoogleAnalytics from "./google-analytics";
import OpenPanelAnalytics from "./open-panel";

export default function Analytics() {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  return (
    <>
      <OpenPanelAnalytics />

      <GoogleAnalytics />
    </>
  );
}
