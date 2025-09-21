import React from "react";

export const Spinner = ({ size = 40, color = "#60a5fa", className = "" }) => (
  <div
    className={`spinner ${className}`}
    style={{
      display: "inline-block",
      width: size,
      height: size,
    }}
    aria-label="Loading"
    role="status"
  >
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      style={{ display: "block" }}
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeDasharray="90,150"
        strokeDashoffset="0"
        strokeLinecap="round"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 25 25"
          to="360 25 25"
          dur="1s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
    <style jsx>{`
      .spinner {
        vertical-align: middle;
      }
    `}</style>
  </div>
);
