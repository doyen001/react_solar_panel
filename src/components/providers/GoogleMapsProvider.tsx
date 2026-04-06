"use client";

import { createContext, useContext } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import {
  GOOGLE_MAPS_LIBRARIES,
  GOOGLE_MAPS_LOADER_ID,
} from "@/utils/googleMaps";

type GoogleMapsContextValue = {
  isLoaded: boolean;
  loadError?: Error;
};

const GoogleMapsContext = createContext<GoogleMapsContextValue>({
  isLoaded: false,
});

export function GoogleMapsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: GOOGLE_MAPS_LOADER_ID,
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </GoogleMapsContext.Provider>
  );
}

export function useGoogleMaps() {
  return useContext(GoogleMapsContext);
}
