"use client";

const colors = [
  "#FFFFFF", "#E5E5E5", "#A3A3A3", "#525252", "#000000",
  "#FF0000", "#FF6B00", "#FFD600", "#00FF00", "#00B4FF",
  "#0066FF", "#8B00FF", "#FF00C7", "#FF69B4", "#8B4513",
];

interface PaletteProps {
  selectedColor: string;
  onSelect: (color: string) => void;
}

export default function Palette({ selectedColor, onSelect }: PaletteProps) {
  return (
    <div className="p-4 border-b">
      <div className="text-xs uppercase tracking-widest text-gray-500 mb-3">Палитра</div>
      <div className="grid grid-cols-5 gap-2">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onSelect(color)}
            className={`w-10 h-10 rounded-xl border-2 transition-all ${
              selectedColor === color ? "border-red-600 scale-110" : "border-transparent"
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
}