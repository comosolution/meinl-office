import { GoogleMap, OverlayView, useLoadScript } from "@react-google-maps/api";
import { Company } from "../lib/interfaces";
import { mapStyles } from "../lib/map";

const mapContainerStyle = {
  width: "100%",
  height: "360px",
  borderRadius: "var(--mantine-radius-md)",
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: mapStyles,
  draggable: false,
};

export default function Map({ company }: { company: Company }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  if (!isLoaded) return null;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      options={mapOptions}
      onLoad={(mapInstance) => {
        mapInstance.setCenter({
          lat: company.latitude,
          lng: company.longitude,
        });
        mapInstance.setZoom(10);
      }}
    >
      <OverlayView
        position={{ lat: company.latitude, lng: company.longitude }}
        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      >
        <div
          style={{
            position: "relative",
            width: 36,
            height: 36,
            transform: "translate(-50%, -100%)",
            cursor: "pointer",
            zIndex: 10,
            transition: "transform 0.2s ease",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            width="36"
            height="36"
            style={{
              display: "block",
              fill: "#000",
              transition: "all 0.3s ease",
            }}
          >
            <path
              stroke="#fff"
              d="M16 0C9.4 0 4 5.4 4 12c0 7.5 9.6 18.7 11.5 20.8a.7.7 0 0 0 1 .1c1.9-2.1 11.5-13.3 11.5-20.9 0-6.6-5.4-12-12-12zm0 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"
            />
          </svg>
        </div>
      </OverlayView>
    </GoogleMap>
  );
}
