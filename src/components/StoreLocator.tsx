import React, {useEffect, useRef, useState} from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {Button} from '@/components/ui/button';
import {MapPin, Navigation, Clock, Phone} from 'lucide-react';

interface Store {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    hours: string;
    lat: number;
    lng: number;
    distance?: number;
}

// Sample store data - in production, this would come from your database
const sampleStores: Store[] = [
    {
        id: '1',
        name: 'Downtown Store',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        phone: '(212) 555-0101',
        hours: '9 AM - 9 PM',
        lat: 40.7484,
        lng: -73.9857
    },
    {
        id: '2',
        name: 'Midtown Pickup Point',
        address: '456 5th Avenue',
        city: 'New York',
        state: 'NY',
        zip: '10018',
        phone: '(212) 555-0102',
        hours: '8 AM - 10 PM',
        lat: 40.7549,
        lng: -73.9840
    },
    {
        id: '3',
        name: 'Brooklyn Store',
        address: '789 Atlantic Ave',
        city: 'Brooklyn',
        state: 'NY',
        zip: '11217',
        phone: '(718) 555-0103',
        hours: '10 AM - 8 PM',
        lat: 40.6840,
        lng: -73.9750
    },
    {
        id: '4',
        name: 'Queens Pickup Point',
        address: '321 Queens Blvd',
        city: 'Queens',
        state: 'NY',
        zip: '11375',
        phone: '(718) 555-0104',
        hours: '9 AM - 9 PM',
        lat: 40.7282,
        lng: -73.8317
    }
];

interface StoreLocatorProps {
    onSelectStore?: (store: Store) => void;
    showList?: boolean;
}

const StoreLocator: React.FC<StoreLocatorProps> = ({onSelectStore, showList = true}) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const markersRef = useRef<mapboxgl.Marker[]>([]);
    const [stores, setStores] = useState<Store[]>(sampleStores);
    const [selectedStore, setSelectedStore] = useState<Store | null>(null);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [isLocating, setIsLocating] = useState(false);

    // Calculate distance between two points using Haversine formula
    const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
        const R = 3959; // Earth's radius in miles
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const findNearMe = () => {
        if (!navigator.geolocation) {
            return;
        }

        setIsLocating(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const {latitude, longitude} = position.coords;
                setUserLocation({lat: latitude, lng: longitude});

                // Calculate distances and sort stores
                const storesWithDistance = stores.map(store => ({
                    ...store,
                    distance: calculateDistance(latitude, longitude, store.lat, store.lng)
                })).sort((a, b) => (a.distance || 0) - (b.distance || 0));

                setStores(storesWithDistance);

                // Center map on user location
                if (map.current) {
                    map.current.flyTo({
                        center: [longitude, latitude],
                        zoom: 12
                    });

                    // Add user location marker
                    const userEl = document.createElement('div');
                    userEl.className = 'w-4 h-4 bg-primary rounded-full border-2 border-primary-foreground shadow-lg';

                    new mapboxgl.Marker(userEl)
                        .setLngLat([longitude, latitude])
                        .addTo(map.current);
                }

                setIsLocating(false);
            },
            (error) => {
                console.error('Location error:', error);
                setIsLocating(false);
            }
        );
    };

    useEffect(() => {
        if (!mapContainer.current) return;

        const token = import.meta.env.VITE_MAPBOX_TOKEN;
        if (!token) return;

        mapboxgl.accessToken = token;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/light-v11',
            center: [-73.9857, 40.7484], // NYC default
            zoom: 11,
        });

        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Add store markers
        map.current.on('load', () => {
            stores.forEach(store => {
                if (!map.current) return;

                const el = document.createElement('div');
                el.className = 'w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform';
                el.innerHTML = '<svg class="w-4 h-4 text-primary-foreground" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>';

                el.addEventListener('click', () => {
                    setSelectedStore(store);
                    map.current?.flyTo({
                        center: [store.lng, store.lat],
                        zoom: 14
                    });
                });

                const marker = new mapboxgl.Marker(el)
                    .setLngLat([store.lng, store.lat])
                    .addTo(map.current);

                markersRef.current.push(marker);
            });
        });

        return () => {
            markersRef.current.forEach(marker => marker.remove());
            map.current?.remove();
        };
    }, []);

    const handleSelectStore = (store: Store) => {
        setSelectedStore(store);
        map.current?.flyTo({
            center: [store.lng, store.lat],
            zoom: 14
        });
        onSelectStore?.(store);
    };

    const token = import.meta.env.VITE_MAPBOX_TOKEN;

    if (!token) {
        return (
            <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Map unavailable - Mapbox token not configured</p>
            </div>
        );
    }

    return (
        <div className="grid lg:grid-cols-3 gap-6">
            {/* Map */}
            <div className="lg:col-span-2">
                <div className="relative w-full h-96 rounded-lg overflow-hidden border border-border">
                    <div ref={mapContainer} className="absolute inset-0"/>
                    <Button
                        variant="secondary"
                        size="sm"
                        className="absolute top-3 left-3 gap-2"
                        onClick={findNearMe}
                        disabled={isLocating}
                    >
                        <Navigation className="w-4 h-4"/>
                        {isLocating ? 'Locating...' : 'Find Near Me'}
                    </Button>
                </div>
            </div>

            {/* Store List */}
            {showList && (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    <h3 className="font-semibold text-lg">Nearby Stores</h3>
                    {stores.map(store => (
                        <button
                            key={store.id}
                            onClick={() => handleSelectStore(store)}
                            className={`w-full text-left p-4 rounded-lg border transition-colors ${
                                selectedStore?.id === store.id
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/50'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium">{store.name}</h4>
                                {store.distance !== undefined && (
                                    <span className="text-sm text-primary font-medium">
                    {store.distance.toFixed(1)} mi
                  </span>
                                )}
                            </div>
                            <div className="space-y-1 text-sm text-muted-foreground">
                                <p className="flex items-center gap-2">
                                    <MapPin className="w-3 h-3"/>
                                    {store.address}, {store.city}, {store.state} {store.zip}
                                </p>
                                <p className="flex items-center gap-2">
                                    <Clock className="w-3 h-3"/>
                                    {store.hours}
                                </p>
                                <p className="flex items-center gap-2">
                                    <Phone className="w-3 h-3"/>
                                    {store.phone}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StoreLocator;
