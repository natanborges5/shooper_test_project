import { Box, Text } from "@mantine/core"
import { APIProvider, Map, useMapsLibrary, useMap } from "@vis.gl/react-google-maps"
import { useEffect, useState } from "react"

export const AvisMap = ({ routeResponse }: { routeResponse: any }) => {
  const position = {
    lat: routeResponse.routes[0].legs[0].start_location.lat,
    lng: routeResponse.routes[0].legs[0].start_location.lng
  }
  return (
    <Box style={{ height: "60vh", width: "100%" }}>
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}>
        <Map center={position} zoom={12} fullscreenControl={false} gestureHandling={"cooperative"}>
          <Directions origin={routeResponse.routes[0].legs[0].start_address} destination={routeResponse.routes[0].legs[0].end_address} />
        </Map>
      </APIProvider>
    </Box>
  )
}
function Directions({ origin, destination }: { origin: string, destination: string }) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes")
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>()
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>()
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([])
  const [routeIndex, setRouteIndex] = useState(0)
  const selected = routes[routeIndex]
  const leg = selected?.legs[0]
  useEffect(() => {
    if (!routesLibrary || !map) return
    setDirectionsService(new routesLibrary.DirectionsService())
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map, preserveViewport: true }))
  }, [routesLibrary, map])
  useEffect(() => {
    if (!directionsService || !directionsRenderer) return
    directionsService.route({
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING,
    }).then(response => {
      directionsRenderer.setDirections(response)
      setRoutes(response.routes)
    })
  }, [directionsService, directionsRenderer])
  console.log(routes)
  if (!leg) return null
}