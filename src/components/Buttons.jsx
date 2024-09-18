
export const Buttons = ({ color, active, showingPattern, index, onClick }) => {
  const { activated, activeColor } = active;

  return (
    <button
      className={`w-32 h-32 ${color} 
      ${activated && activeColor === color ? "opacity-100 brightness-150" : "opacity-40"}
      ${index === 0 ? "rounded-tl-full" : index === 1 ? "rounded-tr-full" : index === 2 ? "rounded-bl-full": "rounded-br-full"}`}
      onClick={() => onClick(color)}
      disabled={showingPattern}
    ></button>
  );
};
