'use client';

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

// Only import leaflet on the client
let L: any;
if (typeof window !== 'undefined') {
  L = require('leaflet');
  // Fix marker icons
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

const destinations = [
  { name: 'Bali, Indonesia', lat: -8.4095, lng: 115.1889, tours: ['Bali Paradise Explorer'] },
  { name: 'Tokyo, Japan', lat: 35.6895, lng: 139.6917, tours: ['Japanese Cultural Journey'] },
  { name: 'Santorini, Greece', lat: 36.3932, lng: 25.4615, tours: ['Santorini Romance'] },
  { name: 'Swiss Alps, Switzerland', lat: 46.561, lng: 8.767, tours: ['Swiss Alps Adventure'] },
];

export default function DestinationsMap() {
  const { resolvedTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setMounted(true);
  }, []);

  const isLight = mounted && resolvedTheme === 'light';

  // Choose tile URL based on theme
  const tileUrl = isLight
    ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

  // Text & Glow Colors
  const textColor = isLight ? 'text-slate-800' : 'text-white';
  const subtitleColor = isLight ? 'text-slate-600' : 'text-slate-400';
  const mapBgColor = isLight ? '#f1f5f9' : '#0f172a';
  const gradientFrom = isLight ? 'from-blue-500/20' : 'from-blue-600/5';

  if (!isClient) {
    return (
      <section className="py-32 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 flex justify-center items-center min-h-[600px]">
        <div className="w-12 h-12 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </section>
    );
  }

  return (
    <section className="py-32 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden transition-colors duration-500">
      
      {/* Ambient Background Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[1000px] ${gradientFrom} blur-[150px] rounded-full pointer-events-none`} />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Animated Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${textColor} tracking-tight transition-colors duration-500`}>
            Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Footprint</span>
          </h2>
          <p className={`${subtitleColor} text-lg max-w-2xl mx-auto font-light transition-colors duration-500`}>
            Discover our curated selection of breathtaking destinations across the globe. Hover and explore your next journey.
          </p>
        </motion.div>

        {/* Animated Map Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className={`relative p-1 rounded-[2rem] shadow-2xl max-w-6xl mx-auto transition-colors duration-500 ${
            isLight
              ? 'bg-white shadow-blue-900/10'
              : 'bg-gradient-to-b from-white/10 to-transparent shadow-blue-900/20'
          }`}
        >
          <div className={`rounded-[31px] overflow-hidden relative transition-colors duration-500`}>
            {/* Map container */}
            <MapContainer
              center={[25, 10]}
              zoom={2.5}
              style={{ height: '550px', width: '100%', backgroundColor: mapBgColor }}
              scrollWheelZoom={false}
              className="z-0"
            >
              <TileLayer
                url={tileUrl}
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
              {destinations.map((dest, i) => (
                <Marker key={i} position={[dest.lat, dest.lng]}>
                  <Popup>
                    <div className="p-1">
                      <strong className="text-slate-900 block mb-1 font-semibold">{dest.name}</strong>
                      <span className="text-blue-600 text-sm font-medium">{dest.tours.join(', ')}</span>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </motion.div>
      </div>
    </section>
  );
}