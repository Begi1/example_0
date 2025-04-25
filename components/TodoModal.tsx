import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from "@mui/material";

interface TodoModalProps {
  closeModal: () => void;
}

const TodoModal: React.FC<TodoModalProps> = ({ closeModal }) => {
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
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModal} color="primary">
          Cancel
        </Button>
        <Button onClick={closeModal} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TodoModal;
