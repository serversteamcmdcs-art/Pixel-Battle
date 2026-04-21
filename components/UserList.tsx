"use client";

interface UserListProps {
  username: string;
  clan?: string;
  isLoggedIn: boolean;
}

export default function UserList({ username, clan, isLoggedIn }: UserListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="text-xs uppercase tracking-widest text-gray-500 mb-3">ИГРОКИ ОНЛАЙН</div>
      
      {isLoggedIn ? (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full" />
          <div>
            <div className="font-semibold">{username}</div>
            {clan && <div className="text-xs text-red-600 font-medium">● {clan}</div>}
            <div className="text-xs text-gray-500">Онлайн • Ставит пиксели</div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-400 py-10 text-sm">
          Войдите, чтобы увидеть игроков
        </div>
      )}
    </div>
  );
}