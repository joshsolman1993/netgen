import React from "react";

type Props = {
  name: string;
  description: string;
};

export default function ZoneTooltip({ name, description }: Props) {
  return (
    <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-[200px] bg-black/80 text-cyan-200 text-xs p-3 rounded-lg shadow-xl border border-cyan-500/30 backdrop-blur-sm z-50 pointer-events-none">
      <div className="font-semibold text-sm mb-1 text-cyan-300">{name}</div>
      <div className="opacity-80 leading-tight">{description}</div>
    </div>
  );
}
