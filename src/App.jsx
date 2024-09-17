import { useState, useEffect } from "react";
import { Buttons } from "./components/Buttons";
import { UIbuttons } from "./components/UIbuttons";
import "./index.css";

const App = () => {
  const colorTypes = [
    ["bg-red-500", "bg-green-500", "bg-blue-500", "bg-yellow-500"],
    ["bg-orange-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500"],
    ["bg-gray-500", "bg-teal-500", "bg-cyan-500", "bg-lime-500"],
    ["bg-emerald-500", "bg-rose-500", "bg-violet-500", "bg-sky-500"],
  ]; //COLORES

  const [colors, setColors] = useState([
    "bg-red-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-yellow-500",
  ]);
  const [pattern, setPattern] = useState([]);
  const [playerPattern, setPlayerPattern] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showingPattern, setShowingPattern] = useState(true);
  const [userClick, setuserClick] = useState(0);
  const [Score, setScore] = useState(0);
  const [active, setActive] = useState({
    activated: false,
    activeColor: "",
  });
  const [leaderboard, setLeaderboard] = useState([]); //CREAR LEADERBOARD CON LOCAL STORAGE
  const [haslost, setHaslost] = useState(false);
  const [gameModes, setGameModes] = useState({
    addClass: 1100,
    removeClass: 500,
  });

  useEffect(() => {
    if (isPlaying) {
      //FUNCION QUE ACTIVA LA SECUENCIA DE COLORES CUANDO SE AGREGA UN COLOR AL PATRON
      handleColorSequence("computer");
    }
  }, [pattern]); //EFFECT QUE SE EJECUTA CADA VEZ QUE SE AGREGA UN NUEVO COLOR AL PATRON

  useEffect(() => {
    if (isPlaying) {
      handleSetPattern();
    }
  }, [isPlaying]); //EFFECT QUE SE EJECUTA CADA VEZ QUE SE INICIA EL JUEGO

  useEffect(() => {
    if (isPlaying && playerPattern.length > 0) {
      //VARIABLE CREADA POR ASINCRONISMO EN ESTADO
      let click = userClick + 1;
      //SI EL CLICK ES MENOR A LA LONGITUD DEL PATRON SEGUIRA COMPARANDO. SI NO, AUMENTA EL SCORE Y AGREGA UN COLOR AL PATRON
      if (click <= pattern.length) {
        if (pattern[userClick] === playerPattern[userClick]) {
          setuserClick(userClick + 1);
          if (click === pattern.length) {
            handleSetPattern();
            setuserClick(0);
            setScore(Score + 1);
            setPlayerPattern([]);
          }
        } else {
          setHaslost(true);
          setIsPlaying(false);
          setPattern([]);
          setPlayerPattern([]);
          setuserClick(0);
          localStorage.setItem("score", JSON.stringify(Score));
          setScore(0);
          setShowingPattern(true);
        }
      }
    }
  }, [playerPattern]); //EFFECT QUE SE EJECUTA CADA VEZ QUE EL JUGADOR HACE CLICK

  const handleSetPattern = () => {
    setPattern([...pattern, colors[Math.floor(Math.random() * colors.length)]]);
  };

  const handleColorSequence = (type, color) => {
    if (type === "player") {
      setActive({ activated: true, activeColor: color });
      setTimeout(() => {
        setActive({ activated: false, activeColor: "" });
      }, gameModes.removeClass);
    } else {
      setShowingPattern(true);
      let i = 0;
      const interval = setInterval(() => {
        if (i < pattern.length) {
          setActive({ activated: true, activeColor: pattern[i] });
          setTimeout(() => {
            setActive({ activated: false, activeColor: "" });
          }, 500);
          i++;
        } else {
          clearInterval(interval);
          setShowingPattern(false);
        }
      }, gameModes.addClass);
    }
  };

  //FUNCION PARA MANEJAR LOS CLICKS DEL JUGADOR
  const handleClick = (color) => {
    setPlayerPattern([...playerPattern, color]);
    handleColorSequence("player", color);
    return play();
  };

  const handleColors = () => {
    let index = Math.floor(Math.random() * 4);
    do {
      index = Math.floor(Math.random() * 4);
    } while (colorTypes[0][index] === colors[0]);
    setColors([
      colorTypes[0][index],
      colorTypes[1][index],
      colorTypes[2][index],
      colorTypes[3][index],
    ]);
  };

  return isPlaying ? (
    <main className="w-full h-screen flex flex-col justify-center items-center bg-gray-800">
      <div className="-mt-48">
        <h2
          className={`text-white font-serif text-center ${
            showingPattern === false ? "visible" : "invisible"
          }`}
        >
          Tu turno
        </h2>
        <div className="grid grid-rows-2 grid-cols-2 gap-2">
          {colors.map((color, index) => (
            <Buttons
              key={index}
              color={color}
              active={active}
              showingPattern={showingPattern}
              index={index}
              onClick={handleClick}
            />
          ))}
        </div>
        <h2 className="text-white text-center mt-4 font-serif">Score: {Score}</h2>
      </div>
    </main>
  ) : isPlaying === false && haslost ? (
    <section className="w-full h-screen bg-gray-800 flex flex-col justify-center items-center z-10 backdrop-brightness-0">
      <h2 className="text-white">
        Game over. Score: {localStorage.getItem("score")}
      </h2>
      <h2 className="text-white">Reset game?</h2>
      <span>
        <button
          className="bg-blue-400 w-14 m-5"
          onClick={() => (setIsPlaying(true), setHaslost(false))}
        >
          Yes
        </button>
        <button
          className="bg-blue-400 w-14"
          onClick={() => (setIsPlaying(false), setHaslost(false))}
        >
          No
        </button>
      </span>
    </section>
  ) : (
    <section className="w-full h-screen bg-gray-800 relative">
      <h1 className="mb-6 text-4xl text-white text-center pt-5 translate-y-11 duration-700 font-mono">
        Simon Game
      </h1>
      <div className="flex flex-col justify-center items-center absolute top-0 left-0 right-0 bottom-0 -mt-44">
        <span>
          <label className="text-white mb-2 mr-2" htmlFor="gameModes">
            Select game mode:
          </label>
          <select
            name="gameModes"
            id="modes"
            className="mb-8 p-1 bg-black text-white rounded-lg"
            onChange={({ target }) =>
              target.value === "easy"
                ? setGameModes({ addClass: 1100, removeClass: 500 })
                : target.value === "medium"
                ? setGameModes({ addClass: 800, removeClass: 400 })
                : setGameModes({ addClass: 550, removeClass: 200 })
            }
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </span>
        <div className="grid grid-rows-2 grid-cols-2 gap-2">
          {colors.map((color, index) => (
            <Buttons
              key={index}
              color={color}
              active={active}
              showingPattern={showingPattern}
              index={index}
            />
          ))}
        </div>
        <UIbuttons onClick={handleColors} text="Change colors" />
        <UIbuttons onClick={() => setIsPlaying(true)} text="Start" />
      </div>
    </section>
  );
};

export default App;
