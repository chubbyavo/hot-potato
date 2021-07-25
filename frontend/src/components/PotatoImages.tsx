import React from "react";

export function PotatoImage({
  potatoType,
}: {
  potatoType: number;
}): JSX.Element {
  switch (potatoType) {
    case 0:
      return <TempPotatoImageType0 />;
    case 1:
      return <TempPotatoImageType1 />;
    case 2:
      return <TempPotatoImageType2 />;
    default:
      throw new Error("Invalid potato type");
  }
}

const TempPotatoImageType0 = () => (
  <svg height="200" width="200" className="rounded-lg">
    <rect width="100%" height="100%" fill="dimgray" />
    <ellipse
      cx="100"
      cy="100"
      rx="90"
      ry="70"
      stroke="black"
      strokeWidth="3"
      fill="goldenrod"
      transform="rotate(25, 100, 100)"
    />
    <text x="57" y="95">
      {"I'm a potato (0)"}
    </text>
    <text x="18" y="115">
      {"(placeholder for artwork)"}
    </text>
  </svg>
);

const TempPotatoImageType1 = () => (
  <svg height="200" width="200" className="rounded-lg">
    <rect width="100%" height="100%" fill="darkslategray" />
    <ellipse
      cx="100"
      cy="100"
      rx="90"
      ry="70"
      stroke="black"
      strokeWidth="3"
      fill="darkgoldenrod"
      transform="rotate(-25, 100, 100)"
    />
    <text x="57" y="95">
      {"I'm a potato (1)"}
    </text>
    <text x="18" y="115">
      {"(placeholder for artwork)"}
    </text>
  </svg>
);

const TempPotatoImageType2 = () => (
  <svg height="200" width="200" className="rounded-lg">
    <rect width="100%" height="100%" fill="orange" />
    <ellipse
      cx="100"
      cy="100"
      rx="90"
      ry="70"
      stroke="black"
      strokeWidth="3"
      fill="goldenrod"
      transform="rotate(25, 100, 100)"
    />
    <text x="57" y="95">
      {"I'm a potato (2)"}
    </text>
    <text x="18" y="115">
      {"(placeholder for artwork)"}
    </text>
  </svg>
);
