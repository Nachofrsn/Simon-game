import { useState, useEffect, useReducer } from "react";
import { Buttons } from "./components/Buttons";
import { UIbuttons } from "./components/UIbuttons";
import useSound from "use-sound";
import firstSound from "../src/sounds/firstSound.mp3";
import { useColors } from "./hooks/useColors";
import "./index.css";
import { reducer, TYPES } from "./utils/reducer"; 


const App = () => {
  const [play] = useSound(firstSound);

  const [state, dispatch] = useReducer(reducer, {
    pattern: [],
    playerPattern: [],
    isPlaying: false,
    showingPattern: true,
    userClick: 0,
    score: 0,
  });

  const [active, setActive] = useState({
    activated: false,
    activeColor: "",
  });
  const [haslost, setHaslost] = useState(false);
  const [gameModes, setGameModes] = useState({
    addClass: 1100,
    removeClass: 500,
  });

  const { colors, handleColors, handleColorSequence } = useColors(
    dispatch,
    TYPES.showingPattern,
    state.pattern,
    active,
    gameModes,
    setActive,
    play
  );

  useEffect(() => {
    if (state.isPlaying) {
      //FUNCION QUE ACTIVA LA SECUENCIA DE COLORES CUANDO SE AGREGA UN COLOR AL PATRON
      handleColorSequence("computer");
    }
  }, [state.pattern]); //EFFECT QUE SE EJECUTA CADA VEZ QUE SE AGREGA UN NUEVO COLOR AL PATRON

  useEffect(() => {
    if (state.isPlaying) {
      handleSetPattern();
    }
  }, [state.isPlaying]); //EFFECT QUE SE EJECUTA CADA VEZ QUE SE INICIA EL JUEGO

  useEffect(() => {
    if (state.isPlaying && state.playerPattern.length > 0) {
      //VARIABLE CREADA POR ASINCRONISMO EN ESTADO
      let click = state.userClick + 1;
      //SI EL CLICK ES MENOR A LA LONGITUD DEL PATRON SEGUIRA COMPARANDO. SI NO, AUMENTA EL SCORE Y AGREGA UN COLOR AL PATRON
      if (click <= state.pattern.length) {
        if (
          state.pattern[state.userClick] ===
          state.playerPattern[state.userClick]
        ) {
          dispatch({ type: TYPES.userClick, payload: click });
          if (click === state.pattern.length) {
            handleSetPattern();
            dispatch({ type: TYPES.userClick, payload: 0 });
            dispatch({ type: TYPES.score, payload: state.score + 1 });
            dispatch({ type: TYPES.playerPattern, payload: [] });
          }
        } else {
          setHaslost(true);
          dispatch({ type: TYPES.isPlaying, payload: false });
          dispatch({ type: TYPES.pattern, payload: [] });
          dispatch({ type: TYPES.playerPattern, payload: [] });
          dispatch({ type: TYPES.userClick, payload: 0 });
          localStorage.setItem("score", JSON.stringify(state.score));
          dispatch({ type: TYPES.score, payload: 0 });
          dispatch({ type: TYPES.showingPattern, payload: true });
        }
      }
    }
  }, [state.playerPattern]); //EFFECT QUE SE EJECUTA CADA VEZ QUE EL JUGADOR HACE CLICK

  const handleSetPattern = () => {
    dispatch({
      type: TYPES.pattern,
      payload: state.pattern.concat(
        colors[Math.floor(Math.random() * colors.length)]
      ),
    });
  };

  //FUNCION PARA MANEJAR LOS CLICKS DEL JUGADOR
  const handleClick = (color) => {
    dispatch({
      type: TYPES.playerPattern,
      payload: state.playerPattern.concat(color),
    });
    handleColorSequence("player", color);
    return play();
  };

  return state.isPlaying ? (
    <main className="w-full h-screen flex flex-col justify-center items-center bg-gray-800">
      <div className="-mt-48">
        <h2
          className={`text-white font-serif text-center ${
            state.showingPattern === false ? "visible" : "invisible"
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
              showingPattern={state.showingPattern}
              index={index}
              onClick={handleClick}
            />
          ))}
        </div>
        <h2 className="text-white text-center mt-4 font-serif">
          Score: {state.score}
        </h2>
      </div>
    </main>
  ) : state.isPlaying === false && haslost ? (
    <section className="w-full h-screen bg-gray-800 flex flex-col justify-center items-center z-10 backdrop-brightness-0">
      <h2 className="text-white">
        Game over. Score: {localStorage.getItem("score")}
      </h2>
      <h2 className="text-white">Reset game?</h2>
      <span>
        <button
          className="bg-blue-400 w-14 m-5 p-2 hover:animate-pulse rounded-md"
          onClick={() => (
            dispatch({ type: TYPES.isPlaying, payload: true }), setHaslost(false)
          )}
        >
          Yes
        </button>
        <button
          className="bg-blue-400 w-14 p-2 hover:animate-pulse rounded-md"
          onClick={() => (
            dispatch({ type: TYPES.isPlaying, payload: false }), setHaslost(false)
          )}
        >
          No
        </button>
      </span>
    </section>
  ) : (
    <section className="w-full h-screen bg-gray-800 relative">
      <h1 className="mb-4 text-4xl text-white text-center pt-5 translate-y-11 duration-700 font-mono">
        Simon Game
      </h1>
      <div className="flex flex-col justify-center items-center absolute top-0 left-0 right-0 bottom-0 -mt-36 sm:mt-1">
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
              showingPattern={state.showingPattern}
              index={index}
            />
          ))}
        </div>
        <UIbuttons onClick={handleColors} text="Change colors" />
        <UIbuttons
          onClick={() => dispatch({ type: TYPES.isPlaying, payload: true })}
          text="Start"
        />
      </div>
    </section>
  );
};

export default App;
