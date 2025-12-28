import React, {useState} from 'react';
import {Button} from '@/components/ui/button';
import {MapPin, Loader2} from 'lucide-react';
import {toast} from 'sonner';

interface LocationDetectorProps {
    onLocationDetected: (address: {
        address: string;
        city: string;
        state: string;
        zipCode: string;
        lat: number;
        lng: number;
    }) => void;
}

const LocationDetector: React.FC<LocationDetectorProps> = ({onLocationDetected}) => {
    const [isDetecting, setIsDetecting] = useState(false);

    const detectLocation = async () => {
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser');
            return;
        }

        setIsDetecting(true);

        try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                });
            });

            const {latitude, longitude} = position.coords;

            // Use Mapbox Geocoding API to get address from coordinates
            const token = import.meta.env.VITE_MAPBOX_TOKEN;

            if (!token) {
                toast.error('Map service not configured');
                setIsDetecting(false);
                return;
            }

            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${token}&types=address`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch address');
            }

            const data = await response.json();

            if (data.features && data.features.length > 0) {
                const feature = data.features[0];
                const context = feature.context || [];

                // Extract address components
                const place = context.find((c: any) => c.id.startsWith('place'));
                const region = context.find((c: any) => c.id.startsWith('region'));
                const postcode = context.find((c: any) => c.id.startsWith('postcode'));

                const addressData = {
                    address: feature.address ? `${feature.address} ${feature.text}` : feature.text || '',
                    city: place?.text || '',
                    state: region?.short_code?.replace('US-', '') || region?.text || '',
                    zipCode: postcode?.text || '',
                    lat: latitude,
                    lng: longitude
                };

                onLocationDetected(addressData);
                toast.success('Location detected successfully');
            } else {
                // Fallback: just return coordinates
                onLocationDetected({
                    address: '',
                    city: '',
                    state: '',
                    zipCode: '',
                    lat: latitude,
                    lng: longitude
                });
                toast.info('Location detected, but address lookup failed. Please enter address manually.');
            }
        } catch (error: any) {
            console.error('Location detection error:', error);
            if (error.code === 1) {
                toast.error('Location access denied. Please enable location permissions.');
            } else if (error.code === 2) {
                toast.error('Unable to determine location. Please try again.');
            } else if (error.code === 3) {
                toast.error('Location request timed out. Please try again.');
            } else {
                toast.error('Failed to detect location');
            }
        } finally {
            setIsDetecting(false);
        }
    };

    return (
        <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={detectLocation}
            disabled={isDetecting}
            className="gap-2"
        >
            {isDetecting ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin"/>
                    Detecting...
                </>
            ) : (
                <>
                    <MapPin className="w-4 h-4"/>
                    Use My Location
                </>
            )}
        </Button>
    );
};

export default LocationDetector;
