import {
  Box,
  Button,
  createStyles,
  Group,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { addTodo, removeTodo, State, updateTodos } from "./store";

const getRandomId = () => Math.random().toString(36).substr(2, 9);

function App() {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const [todoForm, setTodo] = useState({ text: "", description: "" });
  const todos = useSelector((state: State) => state.todos);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const [name, value] = [e.target.name, e.target.value];
    setTodo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!todoForm.text) {
      return;
    }
    dispatch(addTodo({ id: getRandomId(), ...todoForm }));
    setTodo({ text: "", description: "" });
  };

  const handleRemove = (id: string) => {
    dispatch(removeTodo({ id }));
  };

  const handleUndo = () => {
    dispatch(updateTodos({ action: "UNDO" }));
  };

  const handleRedo = () => {
    dispatch(updateTodos({ action: "REDO" }));
  };

  return (
    <Stack
      className={classes.root}
      onKeyDown={getHotkeyHandler([
        ["mod+Z", handleUndo],
        ["mod+Y", handleRedo],
      ])}
    >
      <Title align="center" color={"grape"} my="xl">
        Todo with Undo
      </Title>
      <TextInput
        name="text"
        label="Add new todo"
        onChange={handleChange}
        value={todoForm.text}
        onKeyDown={getHotkeyHandler([["mod+Enter", handleSubmit]])}
      />
      <Textarea
        name="description"
        label="Add description"
        onChange={handleChange}
        value={todoForm.description}
        onKeyDown={getHotkeyHandler([["mod+Enter", handleSubmit]])}
      />
      <Button onClick={handleSubmit}>Add Todo</Button>
      <Group grow>
        <Button variant="light" color="grape" onClick={handleUndo}>
          Undo
        </Button>
        <Button variant="light" color="cyan" onClick={handleRedo}>
          Redo
        </Button>
      </Group>
      {todos.length ? (
        <>
          <Text align="center" size={"lg"} weight={"bold"}>
            Todos
          </Text>

          <Stack spacing={"sm"}>
            {todos.map((todo) => (
              <Group key={todo.id} grow>
                <Box>
                  <Text>{todo.text}</Text>
                  <Text size={"xs"} color={"dimmed"}>
                    {todo.description}
                  </Text>
                </Box>
                <Button size="xs" onClick={() => handleRemove(todo.id)}>
                  Delete
                </Button>
              </Group>
            ))}
          </Stack>
        </>
      ) : (
        <Text align="center">No todos</Text>
      )}
    </Stack>
  );
}

export default App;

const useStyles = createStyles((theme) => ({
  root: {
    padding: "4rem 2rem",
    margin: "auto",
    [`@media (min-width: ${theme.breakpoints.md}px)`]: {
      padding: "4rem 20rem",
    },
    [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
      padding: '4rem 30rem'
    }
  },
}));
