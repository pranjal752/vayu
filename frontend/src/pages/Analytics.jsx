import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  ShieldAlert,
  MapPin,
  ClipboardList,
  ArrowRight,
  Activity,
} from "lucide-react";
import useAQIStore from "../store/useAQIStore";
import { getAQIColor, getAQILabel } from "../utils/aqiColors";
import AQIHeatmap from "../components/AQIHeatmap";

const card = (extra = {}) => ({
  background: "rgba(19,42,35,0.74)",
  border: "1px solid rgba(167,243,208,0.14)",
  borderRadius: 14,
  ...extra,
});

const SectionTitle = ({ children }) => (
  <div
    style={{
      fontSize: 12,
      fontWeight: 700,
      color: "#b7cfc5",
      marginBottom: 14,
    }}
  >
    {children}
  </div>
);

const AQITooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const aqi = payload[0]?.value;
  return (
    <div
      style={{
        background: "rgba(17,39,33,0.96)",
        border: `1px solid ${getAQIColor(aqi)}35`,
        borderRadius: 8,
        padding: "7px 11px",
      }}
    >
      <div style={{ fontSize: 9.5, color: "#86a89c", marginBottom: 3 }}>
        {label}
      </div>
      <div style={{ fontSize: 14, fontWeight: 800, color: getAQIColor(aqi) }}>
        {aqi} AQI
      </div>
    </div>
  );
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const monthlyData = MONTHS.map((m, i) => ({
  month: m,
  aqi: Math.round(180 + Math.sin((i + 6) * 0.8) * 80 + (i > 8 ? 60 : 0)),
  pm25: Math.round(85 + Math.sin((i + 6) * 0.8) * 35 + (i > 8 ? 28 : 0)),
}));

const HOURS = Array.from({ length: 24 }, (_, h) => {
  const t = `${String(h).padStart(2, "0")}:00`;
  const diurnal = Math.sin((h * Math.PI) / 12) * 55;
  return {
    hour: t,
    aqi: Math.round(200 + diurnal + (Math.random() * 20 - 10)),
  };
});

export default function Analytics() {
  const { wards, cityHistory, sourceBreakdown, alerts } = useAQIStore();
  const navigate = useNavigate();

  const wardBarData = [...wards]
    .sort((a, b) => b.aqi - a.aqi)
    .slice(0, 12)
    .map((w) => ({
      name: w.name.length > 12 ? `${w.name.slice(0, 12)}...` : w.name,
      aqi: w.aqi,
      color: getAQIColor(w.aqi),
    }));

  const peakEvents = wards
    .filter((w) => w.aqi > 300)
    .sort((a, b) => b.aqi - a.aqi);
  const cityAqiAvg = Math.round(
    wards.reduce((sum, w) => sum + w.aqi, 0) / wards.length,
  );
  const topRiskWards = [...wards].sort((a, b) => b.risk - a.risk).slice(0, 5);
  const criticalAlerts = alerts.filter((a) => a.severity === "critical").length;

  const advisory =
    cityAqiAvg > 300
      ? "Hazardous conditions. Keep outdoor exposure minimal and use N95 masks."
      : cityAqiAvg > 200
        ? "Very unhealthy air. Sensitive groups should stay indoors as much as possible."
        : cityAqiAvg > 150
          ? "Unhealthy conditions. Reduce prolonged outdoor activity."
          : "Air quality is acceptable for most people today.";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        width: "100%",
        animation: "fadeSlideIn 0.4s ease",
      }}
    >
      <div>
        <h1
          style={{ fontSize: 22, fontWeight: 800, color: "#eaf5ef", margin: 0 }}
        >
          Analytics Command Center
        </h1>
        <p style={{ fontSize: 11.5, color: "#7da095", marginTop: 4 }}>
          Full-spectrum intelligence view for temporal trends, source behavior
          and high-risk ward operations.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 12,
        }}
      >
        {[
          {
            label: "Annual Avg AQI",
            value: 248,
            color: "#a855f7",
            note: "Very Unhealthy",
          },
          {
            label: "Worst Month",
            value: "Nov",
            color: "#ef4444",
            note: "AQI avg 342",
          },
          {
            label: "Best Month",
            value: "Jul",
            color: "#22c55e",
            note: "AQI avg 124",
          },
          {
            label: "Hazardous Days",
            value: 43,
            color: "#ef4444",
            note: "This year",
          },
          {
            label: "Critical Alerts",
            value: criticalAlerts,
            color: criticalAlerts > 0 ? "#ef4444" : "#22c55e",
            note: "Live status",
          },
        ].map(({ label, value, color, note }) => (
          <div key={label} style={card({ padding: "14px 16px" })}>
            <div
              style={{
                fontSize: 10,
                color: "#88a89d",
                fontWeight: 700,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              {label}
            </div>
            <div
              style={{ fontSize: 26, fontWeight: 800, color, lineHeight: 1 }}
            >
              {value}
            </div>
            <div style={{ fontSize: 10, color: "#6f9085", marginTop: 4 }}>
              {note}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 14,
        }}
      >
        <div style={card({ padding: 16 })}>
          <SectionTitle>24-Hour AQI Trend (City-Wide)</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              data={cityHistory}
              margin={{ top: 5, right: 4, bottom: 0, left: -20 }}
            >
              <defs>
                <linearGradient id="h24" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.26} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(167,243,208,0.08)"
                vertical={false}
              />
              <XAxis
                dataKey="time"
                tick={{ fill: "#7da095", fontSize: 9 }}
                tickLine={false}
                axisLine={false}
                interval={5}
              />
              <YAxis
                tick={{ fill: "#7da095", fontSize: 9 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={<AQITooltip />}
                cursor={{
                  stroke: "#34d399",
                  strokeOpacity: 0.25,
                  strokeWidth: 1,
                }}
              />
              <Area
                type="monotone"
                dataKey="aqi"
                stroke="#34d399"
                strokeWidth={2}
                fill="url(#h24)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={card({ padding: 16 })}>
          <SectionTitle>Monthly Average AQI (2025)</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={monthlyData}
              margin={{ top: 5, right: 4, bottom: 0, left: -20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(167,243,208,0.08)"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: "#7da095", fontSize: 9 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: "#7da095", fontSize: 9 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={<AQITooltip />}
                cursor={{ fill: "rgba(167,243,208,0.05)" }}
              />
              <Bar dataKey="aqi" radius={[4, 4, 0, 0]}>
                {monthlyData.map((d) => (
                  <Cell
                    key={d.month}
                    fill={getAQIColor(d.aqi)}
                    fillOpacity={0.75}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div
          style={card({
            padding: 14,
            background: `linear-gradient(145deg, ${getAQIColor(cityAqiAvg)}10 0%, rgba(19,42,35,0.86) 68%)`,
            border: `1px solid ${getAQIColor(cityAqiAvg)}2a`,
          })}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              marginBottom: 9,
            }}
          >
            <Activity size={14} style={{ color: getAQIColor(cityAqiAvg) }} />
            <div style={{ fontSize: 11.5, fontWeight: 700, color: "#eaf5ef" }}>
              Live Air Snapshot
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "end",
              justifyContent: "space-between",
              marginBottom: 7,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 9.5,
                  color: "#7da095",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  fontWeight: 700,
                }}
              >
                City AQI
              </div>
              <div
                style={{
                  fontSize: 34,
                  lineHeight: 1,
                  fontWeight: 900,
                  color: getAQIColor(cityAqiAvg),
                }}
              >
                {cityAqiAvg}
              </div>
            </div>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: getAQIColor(cityAqiAvg),
                border: `1px solid ${getAQIColor(cityAqiAvg)}30`,
                background: `${getAQIColor(cityAqiAvg)}12`,
                padding: "3px 8px",
                borderRadius: 999,
              }}
            >
              {getAQILabel(cityAqiAvg)}
            </span>
          </div>

          <p
            style={{
              fontSize: 10.5,
              color: "#9cb8ae",
              lineHeight: 1.45,
              marginBottom: 8,
            }}
          >
            {advisory}
          </p>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}
          >
            <div
              style={{
                border: "1px solid rgba(167,243,208,0.12)",
                background: "rgba(167,243,208,0.05)",
                borderRadius: 8,
                padding: "7px 8px",
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: "#7da095",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                Critical Alerts
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: criticalAlerts > 0 ? "#ef4444" : "#22c55e",
                }}
              >
                {criticalAlerts}
              </div>
            </div>
            <div
              style={{
                border: "1px solid rgba(167,243,208,0.12)",
                background: "rgba(167,243,208,0.05)",
                borderRadius: 8,
                padding: "7px 8px",
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: "#7da095",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                Hazardous Wards
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#ef4444" }}>
                {peakEvents.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 14,
        }}
      >
        <div style={card({ padding: 16 })}>
          <SectionTitle>Ward-wise AQI Comparison (Top 12)</SectionTitle>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={wardBarData}
              layout="vertical"
              margin={{ top: 0, right: 20, bottom: 0, left: 70 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(167,243,208,0.08)"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fill: "#7da095", fontSize: 9 }}
                tickLine={false}
                axisLine={false}
                domain={[0, 500]}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: "#a6c4b8", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                width={68}
              />
              <Tooltip
                content={<AQITooltip />}
                cursor={{ fill: "rgba(167,243,208,0.05)" }}
              />
              <Bar dataKey="aqi" radius={[0, 4, 4, 0]}>
                {wardBarData.map((d) => (
                  <Cell key={d.name} fill={d.color} fillOpacity={0.75} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={card({ padding: 16 })}>
          <SectionTitle>Diurnal AQI Pattern</SectionTitle>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={HOURS}
              margin={{ top: 5, right: 4, bottom: 0, left: -22 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(167,243,208,0.08)"
                vertical={false}
              />
              <XAxis
                dataKey="hour"
                tick={{ fill: "#7da095", fontSize: 8 }}
                tickLine={false}
                axisLine={false}
                interval={5}
              />
              <YAxis
                tick={{ fill: "#7da095", fontSize: 9 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={<AQITooltip />}
                cursor={{ stroke: "#34d399", strokeOpacity: 0.3 }}
              />
              <Line
                type="monotone"
                dataKey="aqi"
                stroke="#34d399"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={card({ padding: 16 })}>
          <SectionTitle>Source Distribution</SectionTitle>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                data={sourceBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={36}
                outerRadius={56}
                paddingAngle={3}
                dataKey="value"
              >
                {sourceBreakdown.map((e) => (
                  <Cell key={e.name} fill={e.color} opacity={0.82} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v, n) => [`${v}%`, n]}
                contentStyle={{
                  background: "rgba(17,39,33,0.96)",
                  border: "1px solid rgba(167,243,208,0.18)",
                  borderRadius: 8,
                  fontSize: 11,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 7,
              marginTop: 8,
            }}
          >
            {sourceBreakdown.map(({ name, value, color }) => (
              <div
                key={name}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 2,
                      background: color,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: 10.5, color: "#a6c4b8" }}>
                    {name}
                  </span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color }}>
                  {value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 14,
        }}
      >
        <div style={card({ padding: 14 })}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              marginBottom: 10,
            }}
          >
            <Sparkles size={14} style={{ color: "#60a5fa" }} />
            <div style={{ fontSize: 11.5, fontWeight: 700, color: "#eaf5ef" }}>
              Action Center
            </div>
          </div>
          {[
            {
              title: "Open Hotspot Map",
              sub: "Inspect highest AQI wards now",
              onClick: () => navigate("/dashboard"),
              color: "#3b82f6",
            },
            {
              title: "Review Citizen Reports",
              sub: "Validate on-ground complaints",
              onClick: () => navigate("/reports"),
              color: "#22c55e",
            },
          ].map((item) => (
            <button
              key={item.title}
              onClick={item.onClick}
              style={{
                width: "100%",
                textAlign: "left",
                border: `1px solid ${item.color}2d`,
                background: `${item.color}0d`,
                borderRadius: 9,
                padding: "9px 10px",
                cursor: "pointer",
                marginBottom: 7,
                color: "#cfe1d9",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 700 }}>
                  {item.title}
                </span>
                <ArrowRight size={12} style={{ color: item.color }} />
              </div>
              <div style={{ fontSize: 9.5, color: "#7da095", marginTop: 2 }}>
                {item.sub}
              </div>
            </button>
          ))}
        </div>

        <div style={card({ padding: 14 })}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              marginBottom: 10,
            }}
          >
            <ShieldAlert size={14} style={{ color: "#f97316" }} />
            <div style={{ fontSize: 11.5, fontWeight: 700, color: "#eaf5ef" }}>
              Top Risk Wards
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {topRiskWards.map((ward, idx) => {
              const color = getAQIColor(ward.aqi);
              return (
                <button
                  key={ward.id}
                  onClick={() => navigate(`/ward/${ward.id}`)}
                  style={{
                    width: "100%",
                    border: `1px solid ${color}24`,
                    background: `${color}0d`,
                    borderRadius: 8,
                    padding: "8px 10px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 999,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 9,
                      fontWeight: 800,
                      background: "rgba(148,163,184,0.15)",
                      color: "#cbd5e1",
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </span>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        color: "#eaf5ef",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {ward.name}
                    </div>
                    <div style={{ fontSize: 9, color: "#7da095" }}>
                      Risk {ward.risk} • AQI {ward.aqi}
                    </div>
                  </div>
                  <MapPin size={12} style={{ color }} />
                </button>
              );
            })}
          </div>
        </div>

        <div style={card({ padding: 14 })}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              marginBottom: 8,
            }}
          >
            <ClipboardList size={14} style={{ color: "#a78bfa" }} />
            <div style={{ fontSize: 11.5, fontWeight: 700, color: "#eaf5ef" }}>
              Operator Notes
            </div>
          </div>
          <ul
            style={{
              margin: 0,
              paddingLeft: 16,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <li style={{ fontSize: 10.5, color: "#a6c4b8" }}>
              Prioritize response in wards with AQI above 300.
            </li>
            <li style={{ fontSize: 10.5, color: "#a6c4b8" }}>
              Validate citizen reports against source spikes.
            </li>
            <li style={{ fontSize: 10.5, color: "#a6c4b8" }}>
              Push health advisories during evening peaks.
            </li>
          </ul>
        </div>
      </div>

      <div style={card({ padding: 16 })}>
        <SectionTitle>
          Current Hazardous / Very Unhealthy Zones ({peakEvents.length} wards)
        </SectionTitle>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}
          >
            <thead>
              <tr>
                {[
                  "Ward",
                  "AQI",
                  "PM2.5",
                  "PM10",
                  "NO2",
                  "Source",
                  "Risk",
                  "Trend",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "6px 10px",
                      color: "#7da095",
                      fontWeight: 700,
                      fontSize: 10,
                      borderBottom: "1px solid rgba(167,243,208,0.12)",
                      letterSpacing: "0.4px",
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {peakEvents.map((w, i) => {
                const color = getAQIColor(w.aqi);
                return (
                  <tr
                    key={w.id}
                    style={{
                      background:
                        i % 2 === 0 ? "transparent" : "rgba(167,243,208,0.03)",
                    }}
                  >
                    <td
                      style={{
                        padding: "8px 10px",
                        color: "#eaf5ef",
                        fontWeight: 600,
                      }}
                    >
                      {w.name}
                    </td>
                    <td style={{ padding: "8px 10px", fontWeight: 800, color }}>
                      {w.aqi}
                    </td>
                    <td style={{ padding: "8px 10px", color: "#a6c4b8" }}>
                      {w.pm25}
                    </td>
                    <td style={{ padding: "8px 10px", color: "#a6c4b8" }}>
                      {w.pm10}
                    </td>
                    <td style={{ padding: "8px 10px", color: "#a6c4b8" }}>
                      {w.no2}
                    </td>
                    <td style={{ padding: "8px 10px", color: "#a6c4b8" }}>
                      {w.source}
                    </td>
                    <td
                      style={{
                        padding: "8px 10px",
                        color: w.risk > 75 ? "#ef4444" : "#f59e0b",
                        fontWeight: 700,
                      }}
                    >
                      {w.risk}
                    </td>
                    <td
                      style={{
                        padding: "8px 10px",
                        color:
                          w.trend === "up"
                            ? "#ef4444"
                            : w.trend === "down"
                              ? "#22c55e"
                              : "#7da095",
                      }}
                    >
                      {w.trend === "up"
                        ? "▲ Rising"
                        : w.trend === "down"
                          ? "▼ Falling"
                          : "▬ Stable"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div style={card({ padding: 16, height: "500px" })}>
        <SectionTitle>AQI Geographical Heatmap</SectionTitle>
        <AQIHeatmap />
      </div>
    </div>
  );
}
