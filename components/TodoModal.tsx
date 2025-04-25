import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";

// Interfaces for Todo
interface Todo {
  id: string;
  title: string;
  description: string;
}

interface TodoModalProps {
  closeModal: () => void;
  addTodo: (todo: Todo) => void;
}

const TodoModal: React.FC<TodoModalProps> = ({ closeModal, addTodo }) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleCreate = () => {
    const newTodo: Todo = {
      id: new Date().toISOString(),
      title,
      description,
    };
    addTodo(newTodo);
    closeModal();
  };

  return (
    <Dialog open={true} onClose={closeModal}>
      <DialogTitle>Create Todo</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="todoTitle"
          label="Title"
          type="text"
          fullWidth
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          margin="dense"
          id="todoDescription"
          label="Description"
          type="text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModal} color="primary">
          Cancel
        </Button>
        <Button onClick={handleCreate} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TodoModal;
