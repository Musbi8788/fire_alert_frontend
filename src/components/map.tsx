import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { FireReport } from "@workspace/api-client-react";
import { Badge } from "./ui";
import { formatDate } from "@/lib/utils";
import { MapPin, Clock, Info } from "lucide-react";

// Fix standard marker icon issue in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom fire marker
const fireIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const resolvedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Gambia Center
const GAMBIA_CENTER: [number, number] = [13.4549, -16.5790];

// Helper to update map bounds when reports change
function MapBoundsUpdater({ reports }: { reports: FireReport[] }) {
  const map = useMap();
  useEffect(() => {
    if (reports.length > 0) {
      const bounds = L.latLngBounds(reports.map(r => [r.latitude, r.longitude]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [reports, map]);
  return null;
}

interface ReportsMapProps {
  reports: FireReport[];
  className?: string;
  autoZoom?: boolean;
}

export function ReportsMap({ reports, className = "h-[500px] w-full", autoZoom = true }: ReportsMapProps) {
  // Prevent SSR issues
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className={`bg-muted animate-pulse rounded-xl ${className}`} />;

  return (
    <div className={`rounded-xl overflow-hidden shadow-inner border border-border relative z-0 ${className}`}>
      <MapContainer 
        center={GAMBIA_CENTER} 
        zoom={11} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {autoZoom && reports.length > 0 && <MapBoundsUpdater reports={reports} />}
        
        {reports.map((report) => (
          <Marker 
            key={report.id} 
            position={[report.latitude, report.longitude]}
            icon={report.status === 'resolved' ? resolvedIcon : fireIcon}
          >
            <Popup className="custom-popup">
              <div className="w-64">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-foreground">Report #{report.id}</h4>
                  <Badge variant={report.status}>{report.status}</Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                  {report.description}
                </p>
                
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-foreground">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span className="truncate">{report.address || 'Unknown Address'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>{formatDate(report.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <Info className="w-3.5 h-3.5 text-primary" />
                    <span>Reported by {report.fullName}</span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
