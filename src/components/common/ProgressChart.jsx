import React, { useState, useCallback } from "react";

/**
 * Generates an SVG path string for a smooth curve using cubic bezier splines.
 * @param {Array<Array<number>>} points - An array of [x, y] coordinate pairs.
 * @returns {string} The SVG path data string.
 */
const getCurvePath = (points) => {
  if (points.length < 2) {
    return "";
  }

  const path = points.reduce((acc, point, i, a) => {
    if (i === 0) {
      return `M ${point[0]},${point[1]}`;
    }
    const [prevX, prevY] = a[i - 1];
    const [currX, currY] = point;

    // Calculate control points for a smooth "S" curve between points
    const cp1x = prevX + (currX - prevX) / 2;
    const cp1y = prevY;
    const cp2x = cp1x;
    const cp2y = currY;

    return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${currX},${currY}`;
  }, "");

  return path;
};

/**
 * A reusable, interactive progress chart component that visualizes a series of scores over time.
 * It renders a large, animated area chart with interactive tooltips and modern styling.
 *
 * @param {object} props - The component props.
 * @param {Array<object>} props.data - An array of data objects to plot. Each object should have a 'score' (number) and 'date' (string) property.
 * @returns {JSX.Element} The rendered progress chart component.
 */
const ProgressChart = ({ data }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Guard against null or empty data.
  if (!data || data.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center text-slate-500">
        <p>No data to display</p>
      </div>
    );
  }

  // Define chart dimensions to fill the container
  const chartWidth = 100;
  const chartHeight = 100;

  // Helper to scale X coordinates
  const scaleX = (index) =>
    data.length > 1 ? (index / (data.length - 1)) * chartWidth : chartWidth / 2;
  // Helper to scale Y coordinates
  const scaleY = (score) => chartHeight - (score / 100) * chartHeight;

  // Create path strings for the line and area
  const pointsArray = data.map((d, i) => [scaleX(i), scaleY(d.score)]);
  const linePath =
    data.length > 1
      ? getCurvePath(pointsArray)
      : `M 0,${scaleY(data[0].score)} L ${chartWidth},${scaleY(data[0].score)}`;
  const areaPath = `${linePath} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`;

  // Memoized mouse move handler for performance
  const handleMouseMove = useCallback(
    (event) => {
      const svgRect = event.currentTarget.getBoundingClientRect();
      const svgX = event.clientX - svgRect.left;
      const percentX = svgX / svgRect.width;

      // Find the index of the closest data point
      const closestIndex = Math.round(percentX * (data.length - 1));
      const pointData = data[closestIndex];

      if (pointData) {
        setHoveredPoint({
          ...pointData,
          cx: scaleX(closestIndex),
          cy: scaleY(pointData.score),
        });
      }
    },
    [data]
  );

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  return (
    <div
      className="relative h-full w-full cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <svg
        className="h-full w-full"
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        preserveAspectRatio="none"
      >
        {/* Reusable definitions */}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
          <filter
            id="chart-shadow"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feDropShadow
              dx="0"
              dy="1"
              stdDeviation="1"
              floodColor="#8b5cf6"
              floodOpacity="0.3"
            />
          </filter>
        </defs>

        {/* Main chart group */}
        <g>
          {/* Chart visuals */}
          <path
            d={areaPath}
            fill="url(#areaGradient)"
            className="opacity-0 animate-fade-in"
            style={{ animationDelay: "500ms" }}
          />
          <path
            d={linePath}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
            className="animate-draw"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: "url(#chart-shadow)" }}
          />

          {/* Hover effects: line and point */}
          {hoveredPoint && (
            <g
              className="pointer-events-none transition-opacity duration-200"
              style={{ opacity: 1 }}
            >
              <line
                x1={hoveredPoint.cx}
                y1={chartHeight}
                x2={hoveredPoint.cx}
                y2={0}
                stroke="#a78bfa"
                strokeWidth="0.5"
                strokeDasharray="2"
              />
              <circle
                cx={hoveredPoint.cx}
                cy={hoveredPoint.cy}
                r="3"
                fill="#a78bfa"
                stroke="white"
                strokeWidth="1"
              />
            </g>
          )}
        </g>
      </svg>

      {/* Tooltip with Score and Date */}
      {hoveredPoint && (
        <div
          className="pointer-events-none absolute rounded-lg bg-slate-800/80 p-2 text-white shadow-lg transition-all duration-100"
          style={{
            left: `${hoveredPoint.cx}%`,
            top: `${hoveredPoint.cy}%`,
            transform: `translate(-50%, -120%)`,
          }}
        >
          <div className="text-center">
            <p className="text-sm font-bold">{hoveredPoint.score}</p>
            <p className="text-xs opacity-70">
              {new Date(hoveredPoint.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      )}

      {/* Embedded CSS for animations */}
      <style>{`
        .animate-draw {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: draw 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        @keyframes draw {
          to { stroke-dashoffset: 0; }
        }
        .animate-fade-in {
          opacity: 0;
          animation: fade-in 0.75s ease-out forwards;
          animation-delay: 0.2s;
        }
        @keyframes fade-in {
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ProgressChart;
