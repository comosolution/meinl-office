import { GoogleMap, OverlayView, useLoadScript } from "@react-google-maps/api";
import Image from "next/image";
import { Company } from "../lib/interfaces";
import { mapStyles } from "../lib/map";

const mapContainerStyle = {
  width: "100%",
  height: "360px",
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: mapStyles,
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
            zIndex: 20,
            width: 20,
            height: 20,
            transform: "translate(-50%, -100%)",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#ef233c",
            }}
          >
            <Image src="/logo_w.svg" alt="Meinl Logo" width={20} height={20} />
          </div>
          <div
            style={{
              position: "absolute",
              bottom: -8,
              left: 0,
              width: 0,
              height: 0,
              borderLeft: "10px solid transparent",
              borderRight: "10px solid transparent",
              borderTop: "8px solid #ef233c",
            }}
          />
        </div>
      </OverlayView>
    </GoogleMap>
  );
}
