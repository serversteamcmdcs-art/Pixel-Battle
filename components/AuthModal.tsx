"use client";

import { useState } from "react";

interface AuthModalProps {
  onClose: () => void;
  onLogin: (username: string, clan?: string) => void;
}

export default function AuthModal({ onClose, onLogin }: AuthModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [clan, setClan] = useState("Без клана");

  const clans = ["Без клана", "Red Empire", "Blue Legion", "Pixel Knights", "Void Raiders", "Rainbow Squad"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return alert("Введите никнейм");

    onLogin(username, clan === "Без клана" ? undefined : clan);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="px-8 pt-8 pb-6 text-center">
          <h2 className="text-3xl font-bold">ИГР | PIXEL BATTLE</h2>
          <p className="text-gray-500 mt-2">{isRegister ? "Создание аккаунта" : "Вход в аккаунт"}</p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
          <div>
            <label className="block text-sm mb-1 font-medium">Никнейм</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-red-500"
              placeholder="urlunok17"
              required
            />
          </div>

          {isRegister && (
            <>
              <div>
                <label className="block text-sm mb-1 font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-red-500"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 font-medium">Пароль</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-red-500"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 font-medium">Клан</label>
                <select
                  value={clan}
                  onChange={(e) => setClan(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-red-500 bg-white"
                >
                  {clans.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 py-4 rounded-2xl text-white font-bold text-lg transition"
          >
            {isRegister ? "Зарегистрироваться" : "Войти"}
          </button>
        </form>

        <div className="px-8 pb-8 text-center">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-sm text-gray-500 hover:text-red-600"
          >
            {isRegister ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться"}
          </button>
        </div>

        <button onClick={onClose} className="absolute top-5 right-5 text-2xl text-gray-400 hover:text-gray-600">✕</button>
      </div>
    </div>
  );
}