export default function StreamersOverlay() {
  return (
    <div className="absolute top-20 right-6 bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl p-4 w-64 z-30">
      <div className="text-xs uppercase tracking-widest text-gray-500 mb-3">Стримеры</div>
      
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="w-12 h-12 bg-red-500 rounded-xl flex-shrink-0" />
          <div>
            <div className="font-medium">twitch.tv/iwantdie</div>
            <div className="text-xs text-green-600">● LIVE • 12.4K</div>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="w-12 h-12 bg-purple-500 rounded-xl flex-shrink-0" />
          <div>
            <div className="font-medium">twitch.tv/pixelwar</div>
            <div className="text-xs text-green-600">● LIVE • 8.9K</div>
          </div>
        </div>
      </div>
      
      <button className="text-xs text-gray-400 hover:text-gray-600 mt-4">Скрыть оверлей ×</button>
    </div>
  );
}