export const createReducerStore = ({ initial, reducer }) => {
  // Array to store the state over time for undo functionality.
  const stateOverTime = [initial];

  // Array of listeners to push updates to.
  const listeners = [];

  const listen = (fn) => {
    listeners.push(fn);
    onState(fn);
  };

  const onState = (fn) => {
    const currentState = stateOverTime[stateOverTime.length - 1];
    fn(currentState);
  };

  const dispatch = (action) => {
    const currentState = stateOverTime[stateOverTime.length - 1];
    const nextState = reducer(currentState, action);
    stateOverTime.push(nextState);
    listeners.forEach(onState);
  };

  return { listen, dispatch };
};
