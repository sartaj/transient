/**
 * Type alias for the listener function that receives the current state.
 *
 * @template T - The type of the state.
 */
type Listener<T> = (state: T) => void;

/**
 * Type alias for the dispatch function that sends an action to the reducer.
 *
 * @template A - The type of the action.
 */
type Dispatcher<A> = (action: A) => void;

/**
 * Creates a simple reducer store that tracks state over time for undo functionality
 * and allows listeners to be notified of state changes.
 *
 * @template T - The type of the state.
 * @template A - The type of the action.
 * @param {Object} params - The parameters.
 * @param {T} params.initial - The initial state.
 * @param {(state: T, action: A) => T} params.reducer - The reducer function to update the state.
 * @returns {[Listener<T>, Dispatcher<A>]} A tuple containing the listen function and the dispatch function.
 */
type CreateReducerStore<T, A> = (params: {
  initial: T;
  reducer: (state: T, action: A) => T;
}) => [Listener<T>, Dispatcher<A>];
