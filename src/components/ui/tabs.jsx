import React, { useState } from "react";

export function Tabs({ children, defaultValue }) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div data-tabs-value={value} className="w-full">
      {children.map((child) =>
        child.type.name === "TabsList"
          ? React.cloneElement(child, { setValue })
          : React.cloneElement(child, { value })
      )}
    </div>
  );
}

export function TabsList({ children, setValue }) {
  return (
    <div className="flex gap-2 justify-center mb-4">
      {children.map((child) => React.cloneElement(child, { setValue }))}
    </div>
  );
}

export function TabsTrigger({ children, value, setValue }) {
  return (
    <button
      className="px-4 py-2 rounded-full bg-gray-300 hover:bg-gray-400 font-semibold"
      onClick={() => setValue(value)}
    >
      {children}
    </button>
  );
}

export function TabsContent({ children, value }) {
  const parentValue = document.querySelector('[data-tabs-value]')?.getAttribute('data-tabs-value');
  if (parentValue !== value) return null;
  return (
    <div>
      {children}
    </div>
  );
}
