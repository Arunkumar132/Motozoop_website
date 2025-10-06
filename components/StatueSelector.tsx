"use client";

import React, { useState } from "react";

const StatueSelector = ({ statues }: { statues: string[] }) => {
  const [selectedStatue, setSelectedStatue] = useState(statues[0]);

  return (
    <div className="flex flex-col gap-2 border-b border-gray-200 pb-4">
      <p className="font-semibold text-sm text-gray-700">
        Choose Statue: <span className="text-black">{selectedStatue}</span>
      </p>

      <div className="flex flex-wrap gap-3">
        {statues.map((statue, index) => (
          <button
            key={index}
            className={`px-4 py-1.5 rounded-md text-sm font-medium border transition-all ${
              selectedStatue === statue
                ? "bg-black text-white border-black"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setSelectedStatue(statue)}
          >
            {statue}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StatueSelector;
