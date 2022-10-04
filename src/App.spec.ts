import { configureStore } from "@reduxjs/toolkit";
import { addTodo, removeTodo, rootReducer, updateTodos } from "./store";

describe("Todo Test", () => {
  it("should add todo", () => {
    const store = configureStore({
      reducer: rootReducer,
    });
    store.dispatch(addTodo({ id: "1", text: "test", description: "test" }));
    expect(store.getState().todos).toEqual([
      { id: "1", text: "test", description: "test" },
    ]);
  });

  it("should remove todo", () => {
    const store = configureStore({
      reducer: rootReducer,
    });
    store.dispatch(addTodo({ id: "1", text: "test", description: "test" }));
    store.dispatch(removeTodo({ id: "1" }));
    expect(store.getState().todos).toEqual([]);
  });

  it("should undo", () => {
    const store = configureStore({
      reducer: rootReducer,
    });
    store.dispatch(addTodo({ id: "1", text: "test", description: "test" }));
    store.dispatch(removeTodo({ id: "1" }));
    store.dispatch(updateTodos({ action: "UNDO" }));

    expect(store.getState().todos).toEqual([
      { id: "1", text: "test", description: "test" },
    ]);
  });

  it("should redo", () => {
    const store = configureStore({
      reducer: rootReducer,
    });
    store.dispatch(addTodo({ id: "1", text: "test", description: "test" }));
    store.dispatch(removeTodo({ id: "1" }));
    store.dispatch(updateTodos({ action: "UNDO" }));
    store.dispatch(updateTodos({ action: "REDO" }));

    expect(store.getState().todos).toEqual([]);
  });

  it("should not undo", () => {
    const store = configureStore({
      reducer: rootReducer,
    });
    store.dispatch(addTodo({ id: "1", text: "test", description: "test" }));
    store.dispatch(removeTodo({ id: "1" }));
    store.dispatch(updateTodos({ action: "UNDO" }));
    store.dispatch(updateTodos({ action: "UNDO" }));
    store.dispatch(updateTodos({ action: "UNDO" }));

    expect(store.getState().todos).toEqual([]);
  });

  it("should not redo", () => {
    const store = configureStore({
      reducer: rootReducer,
    });
    store.dispatch(addTodo({ id: "1", text: "test", description: "test" }));
    store.dispatch(removeTodo({ id: "1" }));
    store.dispatch(updateTodos({ action: "UNDO" }));
    store.dispatch(updateTodos({ action: "REDO" }));
    store.dispatch(updateTodos({ action: "REDO" }));

    expect(store.getState().todos).toEqual([]);
  });

  it("should multiple undo", () => {
    const store = configureStore({
      reducer: rootReducer,
    });
    store.dispatch(addTodo({ id: "1", text: "test", description: "test" }));
    store.dispatch(addTodo({ id: "2", text: "test", description: "test" }));
    store.dispatch(removeTodo({ id: "1" }));
    store.dispatch(updateTodos({ action: "UNDO" }));
    store.dispatch(updateTodos({ action: "UNDO" }));
    expect(store.getState().todos).toEqual([
      { id: "1", text: "test", description: "test" },
    ]);
  });

  it("should multiple redo", () => {
    const store = configureStore({
      reducer: rootReducer,
    });
    store.dispatch(addTodo({ id: "1", text: "test", description: "test" }));
    store.dispatch(addTodo({ id: "2", text: "test", description: "test" }));
    store.dispatch(removeTodo({ id: "1" }));
    store.dispatch(updateTodos({ action: "UNDO" }));
    store.dispatch(updateTodos({ action: "UNDO" }));
    store.dispatch(updateTodos({ action: "REDO" }));
    store.dispatch(updateTodos({ action: "REDO" }));
    expect(store.getState().todos).toEqual([
      { id: "2", text: "test", description: "test" },
    ]);
  });

  it("should multiple undo and redo", () => {
    const store = configureStore({
      reducer: rootReducer,
    });
    store.dispatch(addTodo({ id: "1", text: "test", description: "test" }));
    store.dispatch(addTodo({ id: "2", text: "test", description: "test" }));
    store.dispatch(removeTodo({ id: "1" }));
    store.dispatch(updateTodos({ action: "UNDO" }));
    store.dispatch(updateTodos({ action: "UNDO" }));
    store.dispatch(updateTodos({ action: "REDO" }));
    store.dispatch(updateTodos({ action: "UNDO" }));
    expect(store.getState().todos).toEqual([
      { id: "1", text: "test", description: "test" },
    ]);
  });
});
