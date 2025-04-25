"use client"
import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box, Card, CardContent } from "@mui/material";
import Navbar from "@/components/Navbar";
import TodoModal from "@/components/TodoModal"; // Import TodoModal

// Interfaces for Todo
interface Todo {
  id: string;
  title: string;
  description: string;
}

const TodoBoard: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [working, setWorking] = useState<Todo[]>([]);
  const [done, setDone] = useState<Todo[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const addTodo = (todo: Todo) => {
    setTodos([...todos, todo]);
  };

  const moveToWorking = (todo: Todo) => {
    setTodos(todos.filter((t) => t.id !== todo.id));
    setWorking([...working, todo]);
  };

  const moveToDone = (todo: Todo) => {
    setWorking(working.filter((t) => t.id !== todo.id));
    setDone([...done, todo]);
  };

  const moveToTodosFromWorking = (todo: Todo) => {
    setWorking(working.filter((t) => t.id !== todo.id));
    setTodos([...todos, todo]);
  };

  const moveToWorkingFromDone = (todo: Todo) => {
    setDone(done.filter((t) => t.id !== todo.id));
    setWorking([...working, todo]);
  };

  return (
    <Box>
      {/* Navbar */}
      <Navbar />

      <Box p={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <Typography variant="h6">Team</Typography>
            <Button variant="contained" color="primary" onClick={openModal}>
                Add Todo
            </Button>
        </Box>

        <Box display="flex" justifyContent="space-between" mt={2}>
          {/* Todo Section */}
          <Box flex={1}>
            <Typography variant="h6">Todos</Typography>
            <Box>
              {todos.map((todo) => (
                <Card key={todo.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="body1">{todo.title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {todo.description}
                    </Typography>
                    <Button variant="outlined" color="primary" onClick={() => moveToWorking(todo)}>
                      Move to Working
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>

          {/* Working Section */}
          <Box flex={1} sx={{ mx: 2 }}>
            <Typography variant="h6">Working</Typography>
            <Box>
              {working.map((todo) => (
                <Card key={todo.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="body1">{todo.title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {todo.description}
                    </Typography>
                    <Button variant="outlined" color="primary" onClick={() => moveToDone(todo)}>
                      Move to Done
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={() => moveToTodosFromWorking(todo)} sx={{ ml: 1 }}>
                      Move to Todos
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>

          {/* Done Section */}
          <Box flex={1}>
            <Typography variant="h6">Done</Typography>
            <Box>
              {done.map((todo) => (
                <Card key={todo.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="body1">{todo.title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {todo.description}
                    </Typography>
                    <Button variant="outlined" color="primary" onClick={() => moveToWorkingFromDone(todo)}>
                      Move to Working
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {modalOpen && <TodoModal closeModal={closeModal} addTodo={addTodo} />}
    </Box>
  );
};

export default TodoBoard;
