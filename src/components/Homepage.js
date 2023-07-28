import React, { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import { uid } from "uid";
import { set, ref, onValue, remove, update } from "firebase/database";
import "./homepage.css";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from '@mui/icons-material/Logout';
import CheckIcon from '@mui/icons-material/Check';
import { DataArrayOutlined } from "@mui/icons-material";
import axios from 'axios';

export default function Homepage() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [tempUidd, setTempUidd] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {        
        onValue(ref(db, `/users/${auth.currentUser.uid}`), (snapshot) => {
          setPhoneNumber(snapshot.val().phoneNumber);
          setTodos([]);
          const data = snapshot.val().todos;
          console.log(data) 
          if (data !== null && data !== undefined) {
            Object.values(data).map((todo) => {
              setTodos((oldArray) => [...oldArray, todo]);
            });
          }
        });
      } else if (!user) {
        navigate("/");
      }
    });
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  // add
  const writeToDatabase = () => {
    const uidd = uid();
    set(ref(db, `/users/${auth.currentUser.uid}/todos/${uidd}`), {
      todo: todo,
      uidd: uidd,
    });

    axios.post('http://localhost:3001/sms', {
   message: `New task added: ${todo}`,
   to: phoneNumber,
 })
 .then((res) => {
   if (res.data.success) {
     console.log('SMS sent successfully');
   } else {
     console.error('Failed to send SMS');
   }
 })
 .catch((error) => {
   if (error.response) {
     // The request was made and the server responded with a status code
     // that falls out of the range of 2xx
     console.error(error.response.data);
     console.error(error.response.status);
     console.error(error.response.headers);
   } else if (error.request) {
     // The request was made but no response was received
     console.error(error.request);
   } else {
     // Something happened in setting up the request that triggered an Error
     console.error('Error', error.message);
   }
   console.error(error.config);
 });
    setTodo("");
  };

  // update
  const handleUpdate = (todo) => {
    setIsEdit(true);
    setTodo(todo.todo);
    setTempUidd(todo.uidd);
    setPhoneNumber(todo.phoneNumber);
  };

  const handleEditConfirm = () => {
    update(ref(db, `/users/${auth.currentUser.uid}/todos/${tempUidd}`), {
      todo: todo,
      tempUidd: tempUidd,
    });

    setTodo("");
    setIsEdit(false);
  };

  // delete
  const handleDelete = (uid) => {
    remove(ref(db, `/users/${auth.currentUser.uid}/todos/${uid}`));
  };

  return (
    <div className="homepage">
      <input
        className="add-edit-input"
        type="text"
        placeholder="Add todo..."
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
      />

      {todos.map((todo, index) => (
        <div className="todo" key={index}>
          <h1>{todo.todo}</h1>
          <EditIcon
            fontSize="large"
            onClick={() => handleUpdate(todo)}
            className="edit-button"
          />
          <DeleteIcon
            fontSize="large"
            onClick={() => handleDelete(todo.uidd)}
            className="delete-button"
          />
        </div>
      ))}

      {isEdit ? (
        <div>
        <CheckIcon onClick={handleEditConfirm} className="add-confirm-icon"/>
        </div>
      ) : (
        <div>
          <AddIcon onClick={writeToDatabase} className="add-confirm-icon" />
        </div>
      )}
        <LogoutIcon onClick={handleSignOut} className="logout-icon" />
    </div>
  );
}