/**
 * Store to subscribe and dispatch actions.
 */
export type Store<State extends object, Action extends object> = {
  listen: (fn: (s: State) => void) => void;
  dispatch: (action: Action) => void;
};

/**
 * Reducer function that takes the current state and an action and returns the new state.
 */
type Reducer<State extends object, Action extends object> = (
  state: State,
  action: Action
) => State;

/**
 * Creates a reducer store with the specified initial state and reducer function.
 */
export type CreateReducerStore<
  State extends object,
  Action extends object
> = (p: {
  initial: State;
  reducer: Reducer<State, Action>;
}) => Store<State, Action>;

/**
 * Creates a reducer store with the specified initial state and reducer function.
 */
export declare const createReducerStore: CreateReducerStore<object, object>;
