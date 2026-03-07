const ChatSkeleton = () => {
  // alternating left/right bubble widths to look natural
  const bubbles = [
    { mine: false, w: "w-48" },
    { mine: true, w: "w-36" },
    { mine: false, w: "w-64" },
    { mine: true, w: "w-52" },
    { mine: false, w: "w-40" },
    { mine: true, w: "w-44" },
    { mine: false, w: "w-56" },
    { mine: true, w: "w-32" },
  ];
  return (
    <div className="flex flex-col flex-1 h-full">
      {/* Header skeleton */}

      {/* Messages skeleton */}
      <div className="flex-1 overflow-hidden px-4 py-4 space-y-3">
        {bubbles.map((b, i) => (
          <div
            key={i}
            className={`flex gap-2 ${b.mine ? "flex-row-reverse" : "flex-row"}`}
          >
            {!b.mine && (
              <div className="w-8 h-8 rounded-full bg-surface-hover animate-pulse flex-shrink-0 mt-1" />
            )}
            <div
              className={`${b.w} h-9 rounded-2xl animate-pulse ${
                b.mine
                  ? "bg-primary/20 rounded-br-sm"
                  : "bg-surface-hover rounded-bl-sm"
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
export default ChatSkeleton;