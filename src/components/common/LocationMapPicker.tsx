import { useCallback, useMemo } from 'react'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import { MapPin } from 'lucide-react'
import FormControl, { controlClass } from '../dashboard/FormControl'

const DEFAULT_CENTER = { lat: 23.7793, lng: 90.3989 }

const mapContainerStyle = {
  width: '100%',
  height: '280px',
  borderRadius: '8px',
}

const libraries: ('places')[] = ['places']

type Props = {
  latitude: string
  longitude: string
  onChange: (coords: { latitude: string; longitude: string }) => void
  disabled?: boolean
}

export default function LocationMapPicker({
  latitude,
  longitude,
  onChange,
  disabled = false,
}: Props) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'gcom-google-maps',
    googleMapsApiKey: apiKey ?? '',
    libraries,
  })

  const position = useMemo(() => {
    const lat = Number(latitude)
    const lng = Number(longitude)
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return { lat, lng }
    }
    return DEFAULT_CENTER
  }, [latitude, longitude])

  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (disabled || !event.latLng) return
      onChange({
        latitude: event.latLng.lat().toFixed(6),
        longitude: event.latLng.lng().toFixed(6),
      })
    },
    [disabled, onChange],
  )

  const handleMarkerDragEnd = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (disabled || !event.latLng) return
      onChange({
        latitude: event.latLng.lat().toFixed(6),
        longitude: event.latLng.lng().toFixed(6),
      })
    },
    [disabled, onChange],
  )

  if (!apiKey) {
    return (
      <div className="rounded-md border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
        Missing `VITE_GOOGLE_MAPS_API_KEY` in `.env.local`. Add your Google Maps
        key to enable location picking.
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
        Failed to load Google Maps. Check your API key and Maps JavaScript API
        access.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-gray-300">
        <MapPin size={16} className="text-brand-hover" />
        <span>Click the map or drag the pin to set location</span>
      </div>

      <div
        className={`overflow-hidden rounded-md border border-surface-border ${disabled ? 'pointer-events-none opacity-60' : ''}`}
      >
        {!isLoaded ? (
          <div className="flex h-[280px] items-center justify-center bg-surface-elevated text-sm text-gray-400">
            Loading map...
          </div>
        ) : (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={position}
            zoom={14}
            onClick={handleMapClick}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
              clickableIcons: false,
            }}
          >
            <Marker
              position={position}
              draggable={!disabled}
              onDragEnd={handleMarkerDragEnd}
            />
          </GoogleMap>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormControl label="Latitude" required>
          <input
            type="number"
            step="any"
            value={latitude}
            readOnly
            className={`${controlClass} cursor-default opacity-90`}
            required
          />
        </FormControl>
        <FormControl label="Longitude" required>
          <input
            type="number"
            step="any"
            value={longitude}
            readOnly
            className={`${controlClass} cursor-default opacity-90`}
            required
          />
        </FormControl>
      </div>
    </div>
  )
}
