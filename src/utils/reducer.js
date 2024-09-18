const TYPES = {
  pattern: Symbol(),
  playerPattern: Symbol(),
  isPlaying: Symbol(),
  showingPattern: Symbol(),
  userClick: Symbol(),
  score: Symbol(),
};

const reducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case TYPES.pattern:
      return {
       ...state,
       pattern: payload
      }
    case TYPES.playerPattern:
      return {
        ...state,
        playerPattern: payload
      }
    case TYPES.isPlaying:
      return {
        ...state,
        isPlaying: payload
      }
    case TYPES.showingPattern:
      return {
        ...state,
        showingPattern: payload
      }
    case TYPES.userClick:
      return {
        ...state,
        userClick: payload
      }
    case TYPES.score:
      return {
        ...state,
        score: payload
      }

    default:
      return state;
  }
};

export { reducer, TYPES }

