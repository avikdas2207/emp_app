import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Avatar,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { createServer } from "miragejs";

// Setup MirageJS server
createServer({
  routes() {
    this.namespace = "api";

    this.get("/employees", () => [
      { id: 1, name: "John Doe", email: "john@example.com" },
      { id: 2, name: "Jane Smith", email: "jane@example.com" },
      { id: 3, name: "Jane sds", email: "erejane@example.com" },
    ]);

    this.post("/employees", (schema, request) => {
      let attrs = JSON.parse(request.requestBody);
      attrs.id = Math.floor(Math.random() * 1000);
      return { employee: attrs };
    });

    this.put("/employees/:id", (schema, request) => {
      let attrs = JSON.parse(request.requestBody);
      return { employee: attrs };
    });

    this.delete("/employees/:id", (schema, request) => {
      return { success: true };
    });
  },
});

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const response = await fetch("/api/employees");
    const data = await response.json();
    setEmployees(data);
  };

  const handleOpen = (employee = null) => {
    setCurrentEmployee(employee);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentEmployee(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const employee = Object.fromEntries(formData.entries());

    if (currentEmployee) {
      await fetch(`/api/employees/${currentEmployee.id}`, {
        method: "PUT",
        body: JSON.stringify(employee),
      });
    } else {
      await fetch("/api/employees", {
        method: "POST",
        body: JSON.stringify(employee),
      });
    }

    handleClose();
    fetchEmployees();
  };

  const handleDelete = async (id) => {
    await fetch(`/api/employees/${id}`, { method: "DELETE" });
    fetchEmployees();
  };

  return (
    <div className="container mx-auto p-4">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          background: "#ededed",
          padding: "0 10px",
        }}
      >
        <h1 className="text-2xl font-bold mb-4">Employee App</h1>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpen()}
            className="mb-4"
          >
            Add Employee
          </Button>
        </div>
      </div>

      <List>
        {employees.map((employee) => (
          <ListItem
            key={employee.id}
            className="bg-gray-100 mb-2 rounded"
            style={{ borderBottom: "1px solid #efefef" }}
          >
            <Avatar
              alt={employee.name}
              className="p-3"
              style={{ margin: "0 10px" }}
            />
            <ListItemText primary={employee.name} secondary={employee.email} />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => handleOpen(employee)}>
                <Edit />
              </IconButton>
              <IconButton edge="end" onClick={() => handleDelete(employee.id)}>
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {currentEmployee ? "Edit Employee" : "Add Employee"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Name"
              type="text"
              fullWidth
              defaultValue={currentEmployee?.name || ""}
            />
            <TextField
              margin="dense"
              name="email"
              label="Email"
              type="email"
              fullWidth
              defaultValue={currentEmployee?.email || ""}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              {currentEmployee ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default EmployeeList;
