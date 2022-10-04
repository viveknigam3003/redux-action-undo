import { configureStore, createAction, createReducer } from "@reduxjs/toolkit";
interface Todo {
  id: string;
  text: string;
  description: string;
}

export interface State {
  todos: Array<Todo>;
  undoStack: Array<{
    undo: { type: string; value: any };
    redo: { type: string; value: any };
  }>;
  undoPointer: number;
}

const initialState: State = {
  todos: [],
  undoStack: [],
  undoPointer: 0,
};

enum Actions {
  ADD_TODO = "ADD_TODO",
  REMOVE_TODO = "REMOVE_TODO",
  UPDATE_TODO = "UPDATE_TODO",
}

export const addTodo = createAction<Todo>(Actions.ADD_TODO);
export const removeTodo = createAction<{ id: string }>(Actions.REMOVE_TODO);
export const updateTodos = createAction<{ action: "UNDO" | "REDO" }>(
  Actions.UPDATE_TODO
);

const UNDO_LIMIT = 999;

export const rootReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addTodo, (state, action) => {
      // "mutate" the array by calling push()
      const nextTodos = [...state.todos, action.payload];

      state.undoStack.push({
        undo: {
          type: action.type,
          value: state.todos,
        },
        redo: { type: action.type, value: nextTodos },
      });
      state.undoPointer = state.undoStack.length;

      state.todos = nextTodos;
    })
    .addCase(removeTodo, (state, action) => {
      // Can still return an immutably-updated value if we want to
      const nextTodos = state.todos.filter((el) => el.id !== action.payload.id);

      state.undoStack.push({
        undo: {
          type: action.type,
          value: state.todos,
        },
        redo: {
          type: action.type,
          value: nextTodos,
        },
      });
      state.undoPointer = state.undoStack.length;

      state.todos = nextTodos;
    })
    .addCase(updateTodos, (state, action) => {
      if (action.payload.action === "UNDO") {
        if (state.undoPointer === 0) return;
        const { undo } = state.undoStack[state.undoPointer - 1];

        state.todos = undo.value;

        if (state.undoPointer > 0) {
          state.undoPointer--;
        }

        if (state.undoStack.length > UNDO_LIMIT) {
          state.undoStack.shift();
        }
      } else {
        if (state.undoPointer === state.undoStack.length) return;
        const { redo } = state.undoStack[state.undoPointer];

        state.todos = redo.value;

        if (state.undoPointer < state.undoStack.length) {
          state.undoPointer++;
        }

        if (state.undoStack.length > UNDO_LIMIT) {
          state.undoStack.shift();
        }
      }
    })
    .addDefaultCase((state) => state);
});

export const store = configureStore({
  reducer: rootReducer,
});
