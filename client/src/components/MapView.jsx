import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';

export default function MapView({ listings = [], activeListingId = null }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Fix standard Leaflet icon paths
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    // Default center (San Francisco / Palo Alto Bay Area student tech hub or US colleges)
    const initialLat = listings[0]?.latitude || 37.7749;
    const initialLng = listings[0]?.longitude || -122.4194;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([initialLat, initialLng], 12);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Add markers for each listing
    const validMarkers = [];

    listings.forEach(listing => {
      const lat = listing.latitude || 37.7749 + (Math.random() - 0.5) * 0.05;
      const lng = listing.longitude || -122.4194 + (Math.random() - 0.5) * 0.05;

      const isCurrentActive = listing.id === activeListingId;

      // Custom price marker HTML
      const priceHtml = `
        <div style="
          background: ${isCurrentActive ? '#0d9488' : '#0a1420'};
          color: white;
          padding: 4px 8px;
          border-radius: 20px;
          font-weight: 700;
          font-size: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          border: 2px solid white;
          white-space: nowrap;
          cursor: pointer;
        ">
          $${listing.price}
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: priceHtml,
        iconSize: [60, 24],
        iconAnchor: [30, 12]
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      // Popup
      const popupContent = `
        <div style="font-family: inherit; width: 190px;">
          <img src="${listing.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300'}" style="width: 100%; height: 95px; object-fit: cover; border-radius: 8px; margin-bottom: 6px;" />
          <h4 style="font-weight: 700; font-size: 13px; margin: 0 0 4px 0; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${listing.title}</h4>
          <p style="font-size: 11px; color: #0d9488; font-weight: 600; margin: 0 0 6px 0;">${listing.nearby_college || 'Campus Area'}</p>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong style="color: #0f172a; font-size: 14px;">$${listing.price} <span style="font-size: 10px; color: #64748b;">/ mo</span></strong>
            <a href="/listings/${listing.id}" style="color: #0284c7; font-size: 11px; font-weight: 600; text-decoration: none;">View Details →</a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      markersRef.current.push(marker);
      validMarkers.push([lat, lng]);
    });

    // Fit bounds if multiple listings
    if (validMarkers.length > 1) {
      const bounds = L.latLngBounds(validMarkers);
      map.fitBounds(bounds, { padding: [40, 40] });
    } else if (validMarkers.length === 1) {
      map.setView(validMarkers[0], 13);
    }

  }, [listings, activeListingId]);

  return (
    <div className="w-full h-full min-h-[380px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative">
      <div ref={mapContainerRef} className="w-full h-full" />
      <div className="absolute top-3 right-3 z-[400] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow-md">
        📍 {listings.length} Campus Rentals Shown
      </div>
    </div>
  );
}
