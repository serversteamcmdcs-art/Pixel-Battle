"use client";

import { useState, useEffect, useRef } from "react";
import PixelCanvas, { PixelCanvasRef } from "@/components/PixelCanvas";
import TopBar from "@/components/TopBar";
import Palette from "@/components/Palette";
import UserList from "@/components/UserList";
import BottomCounter from "@/components/BottomCounter";
import AuthModal from "@/components/AuthModal";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [currentColor, setCurrentColor] = useState("#FF0000");
  const [currentTab, setCurrentTab] = useState<"Paint" | "Heatmap" | "Zones" | "Bans">("Paint");

  const canvasRef = useRef<PixelCanvasRef>(null);

  const handlePlacePixel = () => {
    if (!isLoggedIn) {
      alert("Войдите в аккаунт, чтобы ставить пиксели!");
      setShowAuth(true);
      return;
    }
    canvasRef.current?.placePixel();
  };

  const handleLogin = (newUsername: string) => {
    setUsername(newUsername);
    setIsLoggedIn(true);
  };

  return (
    <div className="h-screen flex flex-col bg-[#f4f4f4] overflow-hidden">
      <TopBar 
        isLoggedIn={isLoggedIn} 
        onLogin={() => setShowAuth(true)} 
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        username={username}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex items-center justify-center bg-white relative">
          <PixelCanvas ref={canvasRef} selectedColor={currentColor} />
        </div>

        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          <Palette selectedColor={currentColor} onSelect={setCurrentColor} />
          <UserList username={username} isLoggedIn={isLoggedIn} />
          
          <div className="mt-auto p-4">
            <button
              onClick={handlePlacePixel}
              disabled={!isLoggedIn}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-6 text-2xl rounded-2xl shadow-lg transition"
            >
              ПОСТАВИТЬ
            </button>
          </div>
        </div>
      </div>

      <BottomCounter />
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onLogin={handleLogin} />}
    </div>
  );
}