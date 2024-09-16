export const UIbuttons = ({ text, onClick }) => {
  return (
    <button
      className="mt-3 rounded-lg bg-blue-500 text-white p-2 px-6 animate-pulse"
      onClick={onClick}
    >{text}</button>
  );
};
