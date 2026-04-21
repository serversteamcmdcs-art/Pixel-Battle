"use client";

import { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { io, Socket } from "socket.io-client";

const CANVAS_SIZE = 2000;
const CELL_SIZE = 8;

interface PixelCanvasProps {
  selectedColor: string;
}

export interface PixelCanvasRef {
  placePixel: () => void;
}

const PixelCanvas = forwardRef<PixelCanvasRef, PixelCanvasProps>(({ selectedColor }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [pixels, setPixels] = useState<Map<string, string>>(new Map());
  const [hovered, setHovered] = useState<{ x: number; y: number } | null>(null);
  const [lastHovered, setLastHovered] = useState<{ x: number; y: number } | null>(null);
  const [cooldownEnd, setCooldownEnd] = useState(0);

  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const socketRef = useRef<Socket | null>(null);

  // Подключение к Socket.io
  useEffect(() => {
    socketRef.current = io();

    // Получаем все существующие пиксели при загрузке
    fetch("/api/pixels")
      .then(res => res.json())
      .then((data: { x: number; y: number; color: string }[]) => {
        const map = new Map<string, string>();
        data.forEach(p => map.set(`${p.x},${p.y}`, p.color));
        setPixels(map);
      });

    // Реал-тайм обновления
    socketRef.current.on("pixel-placed", (pixel: { x: number; y: number; color: string }) => {
      setPixels(prev => new Map(prev).set(`${pixel.x},${pixel.y}`, pixel.color));
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = Math.floor(window.innerWidth * 0.68);
    canvas.height = Math.floor(window.innerHeight * 0.78);

    ctx.fillStyle = "#fafafa";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const startX = Math.max(0, Math.floor(-offset.x / (CELL_SIZE * scale)));
    const startY = Math.max(0, Math.floor(-offset.y / (CELL_SIZE * scale)));
    const endX = Math.min(CANVAS_SIZE, startX + Math.ceil(canvas.width / (CELL_SIZE * scale)) + 1);
    const endY = Math.min(CANVAS_SIZE, startY + Math.ceil(canvas.height / (CELL_SIZE * scale)) + 1);

    for (let x = startX; x < endX; x++) {
      for (let y = startY; y < endY; y++) {
        const key = `${x},${y}`;
        const color = pixels.get(key);
        if (color) {
          ctx.fillStyle = color;
          ctx.fillRect(
            Math.floor(x * CELL_SIZE * scale + offset.x),
            Math.floor(y * CELL_SIZE * scale + offset.y),
            Math.ceil(CELL_SIZE * scale),
            Math.ceil(CELL_SIZE * scale)
          );
        }
      }
    }

    // Сетка
    ctx.strokeStyle = "rgba(0,0,0,0.08)";
    ctx.lineWidth = 1;
    for (let x = startX; x <= endX; x++) {
      ctx.beginPath();
      ctx.moveTo(Math.floor(x * CELL_SIZE * scale + offset.x), 0);
      ctx.lineTo(Math.floor(x * CELL_SIZE * scale + offset.x), canvas.height);
      ctx.stroke();
    }
    for (let y = startY; y <= endY; y++) {
      ctx.beginPath();
      ctx.moveTo(0, Math.floor(y * CELL_SIZE * scale + offset.y));
      ctx.lineTo(canvas.width, Math.floor(y * CELL_SIZE * scale + offset.y));
      ctx.stroke();
    }
  }, [pixels, scale, offset]);

  useEffect(() => {
    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, [draw]);

  const getCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left - offset.x) / (CELL_SIZE * scale));
    const y = Math.floor((e.clientY - rect.top - offset.y) / (CELL_SIZE * scale));
    return {
      x: Math.max(0, Math.min(CANVAS_SIZE - 1, x)),
      y: Math.max(0, Math.min(CANVAS_SIZE - 1, y)),
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      setOffset(o => ({ x: o.x + dx, y: o.y + dy }));
      lastPos.current = { x: e.clientX, y: e.clientY };
      return;
    }

    const coords = getCoords(e);
    setHovered(coords);
    setLastHovered(coords);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(s => Math.max(0.3, Math.min(12, s * factor)));
  };

  // Функция, которую вызывает кнопка «ПОСТАВИТЬ»
  const placePixel = useCallback(() => {
    if (!lastHovered) return;
    if (Date.now() < cooldownEnd) {
      alert("Подождите окончания кулдауна!");
      return;
    }

    const { x, y } = lastHovered;
    const key = `${x},${y}`;

    // Отправляем на сервер
    fetch("/api/pixels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ x, y, color: selectedColor }),
    })
      .then(res => {
        if (res.ok) {
          // Локально добавляем сразу
          setPixels(prev => new Map(prev).set(key, selectedColor));
          setCooldownEnd(Date.now() + 5 * 60 * 1000); // 5 минут
        }
      });
  }, [lastHovered, selectedColor, cooldownEnd]);

  useImperativeHandle(ref, () => ({ placePixel }));

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseDown={(e) => {
          isDragging.current = true;
          lastPos.current = { x: e.clientX, y: e.clientY };
        }}
        onMouseUp={() => { isDragging.current = false; }}
        onMouseLeave={() => { isDragging.current = false; setHovered(null); }}
        onWheel={handleWheel}
        className="border border-gray-200 rounded-xl shadow-sm cursor-crosshair select-none"
      />

      {/* Hover координаты */}
      {hovered && (
        <div
          className="absolute bg-black/90 text-white text-xs px-3 py-1.5 rounded pointer-events-none z-10 font-mono"
          style={{
            left: hovered.x * CELL_SIZE * scale + offset.x + 25,
            top: hovered.y * CELL_SIZE * scale + offset.y - 35,
          }}
        >
          ({hovered.x}, {hovered.y})
        </div>
      )}

      {/* Кулдаун */}
      {cooldownEnd > Date.now() && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-red-600 text-white px-5 py-2 rounded-full text-sm font-medium shadow-lg">
          Следующий пиксель через {Math.ceil((cooldownEnd - Date.now()) / 1000)} сек
        </div>
      )}
    </div>
  );
});

PixelCanvas.displayName = "PixelCanvas";
export default PixelCanvas;