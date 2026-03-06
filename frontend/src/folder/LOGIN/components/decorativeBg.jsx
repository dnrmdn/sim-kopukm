
export default function DecorativeBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -left-20 -top-10 blur-3xl opacity-30 w-72 h-72 rounded-full bg-blue-300 transform rotate-45" />
      <div className="absolute right-0 bottom-0 blur-2xl opacity-25 w-60 h-60 rounded-full bg-pink-200" />
    </div>
  );
}