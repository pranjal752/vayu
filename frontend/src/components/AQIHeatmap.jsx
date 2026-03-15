import { useState } from "react";
import useAQIStore from "../store/useAQIStore";
import { getAQIColor, getAQILabel, getAQIBorder } from "../utils/aqiColors";

// Simple geographical projection (Mercator-like for basic positioning)
function latLngToXY(lat, lng, centerLat, centerLng, scale = 10000) {
  const x = (lng - centerLng) * scale * Math.cos((centerLat * Math.PI) / 180);
  const y = (centerLat - lat) * scale;
  return { x, y };
}

export default function AQIHeatmap() {
  const { wards } = useAQIStore();
  const [hoveredWard, setHoveredWard] = useState(null);

  if (wards.length === 0) {
    return (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ color: "#64748b" }}>Loading ward data...</div>
      </div>
    );
  }

  // Calculate center and bounds
  const centerLat =
    wards.reduce((sum, ward) => sum + ward.lat, 0) / wards.length;
  const centerLng =
    wards.reduce((sum, ward) => sum + ward.lng, 0) / wards.length;

  // Convert coordinates to screen positions
  const wardPositions = wards.map((ward) => ({
    ...ward,
    ...latLngToXY(ward.lat, ward.lng, centerLat, centerLng),
  }));

  // Calculate view bounds
  const minX = Math.min(...wardPositions.map((w) => w.x));
  const maxX = Math.max(...wardPositions.map((w) => w.x));
  const minY = Math.min(...wardPositions.map((w) => w.y));
  const maxY = Math.max(...wardPositions.map((w) => w.y));

  const padding = 50;
  const viewBoxWidth = maxX - minX + padding * 2;
  const viewBoxHeight = maxY - minY + padding * 2;
  const viewBoxX = minX - padding;
  const viewBoxY = minY - padding;

  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      {/* Floating tooltip */}
      {hoveredWard && (
        <div
          style={{
            position: "absolute",
            left: hoveredWard.mx + 16,
            top: hoveredWard.my - 12,
            background: "rgba(5,8,18,0.98)",
            border: `1px solid ${getAQIBorder(hoveredWard.ward.aqi)}`,
            borderRadius: 12,
            padding: "12px 16px",
            minWidth: 200,
            boxShadow: `0 12px 40px rgba(0,0,0,0.6), 0 0 24px ${getAQIColor(hoveredWard.ward.aqi)}1a`,
            zIndex: 1000,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              fontSize: 12.5,
              fontWeight: 700,
              color: "#f1f5f9",
              marginBottom: 8,
            }}
          >
            {hoveredWard.ward.name}
          </div>
          <div style={{ display: "flex", gap: 18, marginBottom: 8 }}>
            <div>
              <div
                style={{
                  fontSize: 8.5,
                  color: "#475569",
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                AQI
              </div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 900,
                  color: getAQIColor(hoveredWard.ward.aqi),
                  lineHeight: 1,
                  textShadow: `0 0 18px ${getAQIColor(hoveredWard.ward.aqi)}60`,
                }}
              >
                {hoveredWard.ward.aqi}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 8.5,
                  color: "#475569",
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                LEVEL
              </div>
              <div
                style={{
                  marginTop: 4,
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: getAQIColor(hoveredWard.ward.aqi),
                  background: `${getAQIColor(hoveredWard.ward.aqi)}18`,
                  border: `1px solid ${getAQIColor(hoveredWard.ward.aqi)}30`,
                  padding: "2px 8px",
                  borderRadius: 10,
                }}
              >
                {getAQILabel(hoveredWard.ward.aqi)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SVG Map */}
      <svg
        viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`}
        style={{ width: "100%", height: "100%" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background grid */}
        <defs>
          <pattern
            id="geo-grid"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 100 0 L 0 0 0 100"
              fill="none"
              stroke="rgba(148,163,184,0.03)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect
          width={viewBoxWidth}
          height={viewBoxHeight}
          x={viewBoxX}
          y={viewBoxY}
          fill="url(#geo-grid)"
        />

        {/* Ward circles */}
        {wardPositions.map((ward) => {
          const color = getAQIColor(ward.aqi);
          const radius = Math.max(8, Math.min(25, ward.aqi / 12));
          const isHovered = hoveredWard?.ward?.id === ward.id;

          return (
            <g key={ward.id}>
              {/* Glow effect for high AQI */}
              {ward.aqi > 300 && (
                <circle
                  cx={ward.x}
                  cy={ward.y}
                  r={radius + 4}
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                  opacity="0.3"
                  style={{ filter: "blur(2px)" }}
                />
              )}

              {/* Main circle */}
              <circle
                cx={ward.x}
                cy={ward.y}
                r={radius}
                fill={`${color}${isHovered ? "22" : "11"}`}
                stroke={color}
                strokeWidth={isHovered ? 2 : 1}
                strokeOpacity={isHovered ? 0.85 : 0.45}
                style={{ cursor: "pointer" }}
                onMouseEnter={(e) =>
                  setHoveredWard({
                    ward,
                    mx: e.clientX,
                    my: e.clientY,
                  })
                }
                onMouseLeave={() => setHoveredWard(null)}
                onMouseMove={(e) =>
                  setHoveredWard((h) =>
                    h ? { ...h, mx: e.clientX, my: e.clientY } : null,
                  )
                }
              />

              {/* AQI value text */}
              <text
                x={ward.x}
                y={ward.y - radius - 5}
                textAnchor="middle"
                fill={color}
                fontSize={Math.max(8, Math.min(14, radius / 2))}
                fontWeight="900"
                style={{ pointerEvents: "none" }}
              >
                {ward.aqi}
              </text>

              {/* Ward name */}
              <text
                x={ward.x}
                y={ward.y + radius + 12}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="8"
                fontWeight="600"
                style={{ pointerEvents: "none" }}
              >
                {ward.name.length > 10
                  ? `${ward.name.slice(0, 10)}...`
                  : ward.name}
              </text>
            </g>
          );
        })}

        {/* North indicator */}
        <text
          x={viewBoxX + viewBoxWidth - 20}
          y={viewBoxY + 25}
          textAnchor="middle"
          fill="#475569"
          fontSize="12"
          fontWeight="700"
        >
          N
        </text>
        <line
          x1={viewBoxX + viewBoxWidth - 20}
          y1={viewBoxY + 30}
          x2={viewBoxX + viewBoxWidth - 20}
          y2={viewBoxY + 45}
          stroke="#475569"
          strokeWidth="2"
        />
      </svg>

      {/* Legend */}
      <div
        style={{
          position: "absolute",
          bottom: 10,
          left: 10,
          background: "rgba(5,8,18,0.9)",
          border: "1px solid rgba(148,163,184,0.2)",
          borderRadius: 8,
          padding: "8px 12px",
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        {[
          { label: "Good", range: "0–50", color: "#22c55e" },
          { label: "Moderate", range: "51–100", color: "#eab308" },
          { label: "Sensitive", range: "101–150", color: "#f97316" },
          { label: "Unhealthy", range: "151–200", color: "#ef4444" },
          { label: "V.Unhealthy", range: "201–300", color: "#a855f7" },
          { label: "Hazardous", range: "301+", color: "#dc2626" },
        ].map(({ label, range, color }) => (
          <div
            key={label}
            style={{ display: "flex", alignItems: "center", gap: 4 }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                background: color,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 9, color: "#cbd5e1" }}>{label}</span>
            <span style={{ fontSize: 8, color: "#64748b" }}>({range})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
