import { useEffect, useState } from "react";

export const useColors = (dispatch, showingPatternType, pattern, active, gameModes, setActive, play) => {
  const [colors, setColors] = useState([
    "bg-red-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-yellow-500",
  ]);

  const [changeColors, setChangeColors] = useState([
    "bg-purple-500",
    "bg-pink-500",
    "bg-cyan-500",
    "bg-orange-500",
    "bg-indigo-500",
    "bg-gray-500",
    "bg-teal-500",
    "bg-lime-500",
  ]);

  //FUNCION QUE CAMBIA LOS COLORES DEL JUEGO
  const handleColors = () => {
    let availableColors = [...changeColors];
    let newColors = [];
    for (let i = 0; i < 4; i++) {
      let randomIndex = Math.floor(Math.random() * availableColors.length);
      let chosenColor = availableColors[randomIndex];
      newColors.push(chosenColor);
      availableColors = availableColors.filter(
        (color, index) => index !== randomIndex
      );
    }
    setChangeColors(availableColors.concat(colors));
    setColors(newColors);
  };

  const handleColorSequence = (type, color) => {
    if (type === "player") {
      setActive({ activated: true, activeColor: color });
      setTimeout(() => {
        setActive({ activated: false, activeColor: "" });
      }, gameModes.removeClass);
    } else {
      dispatch({ type: showingPatternType, payload: true });
      let i = 0;
      const interval = setInterval(() => {
        if (i < pattern.length) {
          setActive({ activated: true, activeColor: pattern[i] });
          play();
          setTimeout(() => {
            setActive({ activated: false, activeColor: "" });
          }, 500);
          i++;
        } else {
          clearInterval(interval);
          dispatch({ type: showingPatternType, payload: false });
        }
      }, gameModes.addClass);
    }
  };

  return { colors, handleColors, handleColorSequence };
};
