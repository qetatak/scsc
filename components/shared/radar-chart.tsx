interface RadarAxisPoint {
  axis: string;
  value: number; // 0 to 100
}

interface RadarChartProps {
  data?: RadarAxisPoint[];
  axes?: RadarAxisPoint[];
  size?: number;
}

export function RadarChart({ data, axes, size = 300 }: RadarChartProps) {
  const points = data ?? axes ?? [];
  const center = size / 2;
  const radius = size * 0.215;
  const totalAxes = points.length || 1;

  const getCoordinates = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / totalAxes - Math.PI / 2;
    const r = (Math.max(0, Math.min(100, value)) / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const gridLevels = [25, 50, 75, 100];

  const polygonPoints = points
    .map((item, idx) => {
      const pt = getCoordinates(idx, item.value);
      return `${pt.x},${pt.y}`;
    })
    .join(' ');

  return (
    <div className="flex w-full flex-col items-center justify-center overflow-hidden">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="h-auto max-w-full overflow-visible"
        role="img"
        aria-label="مخطط رادار لمهارات الطالب ونقاط القوة"
      >
        {/* Concentric Polygons */}
        {gridLevels.map((lvl) => {
          const pts = points
            .map((_, idx) => {
              const p = getCoordinates(idx, lvl);
              return `${p.x},${p.y}`;
            })
            .join(' ');
          return (
            <polygon
              key={lvl}
              points={pts}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-[#E3E8F0] dark:text-[#1E325C]"
            />
          );
        })}

        {/* Axis Spokes */}
        {points.map((_, idx) => {
          const end = getCoordinates(idx, 100);
          return (
            <line
              key={idx}
              x1={center}
              y1={center}
              x2={end.x}
              y2={end.y}
              stroke="currentColor"
              strokeWidth="1"
              className="text-[#E3E8F0] dark:text-[#1E325C]"
            />
          );
        })}

        {/* Data Polygon */}
        <polygon
          points={polygonPoints}
          fill="rgba(47, 107, 255, 0.14)"
          stroke="#2F6BFF"
          strokeWidth="2"
        />

        {/* Vertex Dots & Labels */}
        {points.map((item, idx) => {
          const pt = getCoordinates(idx, item.value);
          const labelPt = getCoordinates(idx, 152);
          return (
            <g key={item.axis}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={3.5}
                className="fill-[#2F6BFF] stroke-[#FAFBFC] dark:stroke-[#0A1630]"
                strokeWidth="1.5"
              />
              <text
                x={labelPt.x}
                y={labelPt.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-[#0A1630] dark:fill-[#FAFBFC] text-[12px] font-semibold"
              >
                {item.axis} ({item.value}%)
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
