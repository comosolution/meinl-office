import { Popover } from "@mantine/core";
import { GoogleMap, OverlayView, useLoadScript } from "@react-google-maps/api";
import { useState } from "react";
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
  draggable: false,
};

export default function Map({ company }: { company: Company }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [opened, setOpened] = useState(true);

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
        setOpened(true);
      }}
    >
      <OverlayView
        position={{ lat: company.latitude, lng: company.longitude }}
        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      >
        <Popover
          opened={opened}
          onChange={setOpened}
          width={280}
          position="top"
          offset={2}
          shadow="md"
          withinPortal={false}
        >
          <Popover.Target>
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
          </Popover.Target>
          <Popover.Dropdown>
            <div className="flex flex-col items-center text-center">
              <h3>{company.name1}</h3>
              <p className="text-xs dimmed">
                {company.strasse}, {company.plz} {company.ort}
              </p>
            </div>
          </Popover.Dropdown>
        </Popover>
      </OverlayView>
    </GoogleMap>
  );
}
