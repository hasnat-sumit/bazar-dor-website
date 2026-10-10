
"use client";

import { useEffect, useState } from "react";

const DateLabel = () => {
  const [date, setDate] = useState("");

  useEffect(() => {
    setDate(
      new Date().toLocaleDateString("bn-BD", {
        dateStyle: "full",
      })
    );
  }, []);

  return (
    <p className="min-h-5 text-xs text-gray-600 sm:text-sm">
      {date}
    </p>
  );
};

export default DateLabel;
