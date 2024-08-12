/**
 * @type {import("./types").CreateReducerStore}
 */
export const createReducerStore = ({ initial, reducer }) => {
  // Array to store the state over time for undo functionality.
  const stateOverTime = [initial];

  // Array of listeners to push updates to.
  const listeners = [];

  /**
   * Registers a listener function that will be called with the current state.
   *
   * @param {(s: T) => void} fn - The listener function to register.
   * @template T - The type of the state.
   */
  const listen = (fn) => {
    listeners.push(fn);
    onState(fn);
  };

  /**
   * Calls a listener function with the current state.
   *
   * @param {(s: T) => void} fn - The listener function to call.
   * @template T - The type of the action.
   */
  const onState = (fn) => {
    const currentState = stateOverTime[stateOverTime.length - 1];
    fn(currentState);
  };

  /**
   * Dispatches an action to the reducer to update the state and notifies all listeners.
   * @param {A} action - The action to dispatch.
   * @template A - The type of the action.
   */
  const dispatch = (action) => {
    const currentState = stateOverTime[stateOverTime.length - 1];
    const nextState = reducer(currentState, action);
    stateOverTime.push(nextState);
    listeners.forEach(onState);
  };

  return { listen, dispatch };
};
