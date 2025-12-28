import React, {useEffect, useRef} from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {Package, Truck, Home} from 'lucide-react';

interface DeliveryMapProps {
    origin?: { lat: number; lng: number };
    destination: { lat: number; lng: number };
    currentLocation?: { lat: number; lng: number };
    status?: string;
}

const DeliveryMap: React.FC<DeliveryMapProps> = ({
                                                     origin = {lat: 34.0522, lng: -118.2437}, // LA default
                                                     destination,
                                                     currentLocation,
                                                     status = 'in_transit'
                                                 }) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const markersRef = useRef<mapboxgl.Marker[]>([]);

    useEffect(() => {
        if (!mapContainer.current) return;

        const token = import.meta.env.VITE_MAPBOX_TOKEN;
        if (!token) {
            console.error('Mapbox token not configured');
            return;
        }

        mapboxgl.accessToken = token;

        // Calculate center point between current location and destination
        const center = currentLocation
            ? [(currentLocation.lng + destination.lng) / 2, (currentLocation.lat + destination.lat) / 2]
            : [(origin.lng + destination.lng) / 2, (origin.lat + destination.lat) / 2];

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/light-v11',
            center: center as [number, number],
            zoom: 10,
        });

        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Origin marker (warehouse)
        const originEl = document.createElement('div');
        originEl.className = 'w-8 h-8 bg-secondary rounded-full flex items-center justify-center shadow-lg border-2 border-border';
        originEl.innerHTML = '<svg class="w-4 h-4 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24"><path d="M20 3H4a2 2 0 00-2 2v14a2 2 0 002 2h16a2 2 0 002-2V5a2 2 0 00-2-2zM4 19V7h16v12H4z"/></svg>';

        const originMarker = new mapboxgl.Marker(originEl)
            .setLngLat([origin.lng, origin.lat])
            .setPopup(new mapboxgl.Popup().setHTML('<p class="font-semibold">Warehouse</p><p class="text-sm text-muted-foreground">Origin</p>'))
            .addTo(map.current);
        markersRef.current.push(originMarker);

        // Current location marker (truck)
        if (currentLocation) {
            const truckEl = document.createElement('div');
            truckEl.className = 'w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 border-primary-foreground animate-pulse';
            truckEl.innerHTML = '<svg class="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/></svg>';

            const truckMarker = new mapboxgl.Marker(truckEl)
                .setLngLat([currentLocation.lng, currentLocation.lat])
                .setPopup(new mapboxgl.Popup().setHTML('<p class="font-semibold">Your Package</p><p class="text-sm text-muted-foreground">In Transit</p>'))
                .addTo(map.current);
            markersRef.current.push(truckMarker);
        }

        // Destination marker (home)
        const destEl = document.createElement('div');
        destEl.className = 'w-10 h-10 bg-success rounded-full flex items-center justify-center shadow-lg border-2 border-success-foreground';
        destEl.innerHTML = '<svg class="w-5 h-5 text-success-foreground" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>';

        const destMarker = new mapboxgl.Marker(destEl)
            .setLngLat([destination.lng, destination.lat])
            .setPopup(new mapboxgl.Popup().setHTML('<p class="font-semibold">Delivery Address</p><p class="text-sm text-muted-foreground">Destination</p>'))
            .addTo(map.current);
        markersRef.current.push(destMarker);

        // Draw route line
        map.current.on('load', () => {
            if (!map.current) return;

            const routeCoords = currentLocation
                ? [[origin.lng, origin.lat], [currentLocation.lng, currentLocation.lat], [destination.lng, destination.lat]]
                : [[origin.lng, origin.lat], [destination.lng, destination.lat]];

            map.current.addSource('route', {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates: routeCoords
                    }
                }
            });

            map.current.addLayer({
                id: 'route',
                type: 'line',
                source: 'route',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': 'hsl(var(--primary))',
                    'line-width': 4,
                    'line-dasharray': [2, 2]
                }
            });

            // Fit bounds to show all markers
            const bounds = new mapboxgl.LngLatBounds();
            bounds.extend([origin.lng, origin.lat]);
            if (currentLocation) bounds.extend([currentLocation.lng, currentLocation.lat]);
            bounds.extend([destination.lng, destination.lat]);

            map.current.fitBounds(bounds, {padding: 50});
        });

        return () => {
            markersRef.current.forEach(marker => marker.remove());
            map.current?.remove();
        };
    }, [origin, destination, currentLocation, status]);

    const token = import.meta.env.VITE_MAPBOX_TOKEN;

    if (!token) {
        return (
            <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Map unavailable - Mapbox token not configured</p>
            </div>
        );
    }

    return (
        <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden border border-border">
            <div ref={mapContainer} className="absolute inset-0"/>
            <div className="absolute bottom-3 left-3 bg-card/90 backdrop-blur-sm p-2 rounded-lg text-xs space-y-1">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-secondary rounded-full"/>
                    <span>Origin</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse"/>
                    <span>In Transit</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-success rounded-full"/>
                    <span>Destination</span>
                </div>
            </div>
        </div>
    );
};

export default DeliveryMap;
