"use client";

import { useState } from "react";

type Tab = "Paint" | "Heatmap" | "Zones" | "Bans";

interface TopBarProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
  onlineCount: number;
  username?: string;           // ← Добавили этот пропс
}

export default function TopBar({
  isLoggedIn,
  onLogin,
  currentTab,
  onTabChange,
  onlineCount,
  username = "Гость",         // ← Значение по умолчанию
}: TopBarProps) {
  return (
    <div className="h-14 bg-white border-b flex items-center px-6 justify-between z-40">
      {/* Логотип */}
      <div className="flex items-center gap-3">
        <div className="text-2xl font-black tracking-tighter">ИГР</div>
        <div className="text-xl font-bold">PIXEL BATTLE</div>
      </div>

      {/* Онлайн */}
      <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-medium">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        {onlineCount.toLocaleString("ru-RU")} онлайн
      </div>

      {/* Вкладки */}
      <div className="flex gap-8 text-sm font-medium">
        {(["Paint", "Heatmap", "Zones", "Bans"] as const).map((tab) => (
          <div
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`pb-3 cursor-pointer transition-all ${
              currentTab === tab
                ? "border-b-4 border-red-600 text-red-600 font-semibold"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Правая часть */}
      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="font-medium text-sm">@{username}</div>
              <div className="text-xs text-gray-500">1245 пикселей</div>
            </div>
            <div className="w-8 h-8 bg-purple-600 rounded-full" />
          </div>
        ) : (
          <button
            onClick={onLogin}
            className="px-6 py-2 bg-black hover:bg-zinc-800 text-white rounded-xl font-medium transition"
          >
            Войти
          </button>
        )}
      </div>
    </div>
  );
}