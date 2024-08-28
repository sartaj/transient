/**
 * @type {import('./create-reducer-store').createReducerStore}
 */
export const createReducerStore = ({ initialState, reducer }) => {
  // Array to store the state over time for undo functionality.
  const stateOverTime = [initialState];
  const actionsOverTime = [];

  // Array of listeners to push updates to.
  const listeners = [];

  const listen = (fn) => {
    listeners.push(fn);
    onState(fn);
  };

  const onState = (fn) => {
    const currentState = stateOverTime[stateOverTime.length - 1];
    const lastAction = actionsOverTime[actionsOverTime.length - 1];
    fn(currentState, lastAction);
  };

  const dispatch = (action) => {
    const currentState = stateOverTime[stateOverTime.length - 1];
    const nextState = reducer(currentState, action);
    stateOverTime.push(nextState);
    actionsOverTime.push(action);
    listeners.forEach(onState);
  };

  return { listen, dispatch };
};
