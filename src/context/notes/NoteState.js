import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const initialNotes = [];
  const [notes, setNotes] = useState(initialNotes);

  // Below CRUD operations are written with API Calls

  // Get all notes (Read Operation)
  const getNotes = async() => {

    // API Call
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token":localStorage.getItem('token')
      },
    });
    const json = await response.json();
    console.log(json);
    setNotes(json);
  };

  // Add a note  (Create Operation)
  const addNote = async(title, description, tag) => {

    // API Call
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token":localStorage.getItem('token')
      },
      body: JSON.stringify({title, description, tag}), 
    });
    const note = await response.json(); 

    // Client Side Logic
    setNotes(notes.concat(note));
  };

  // Delete a note (Delete Operation)
  const deleteNote = async (id) => {

    // API Call
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token":localStorage.getItem('token')
      },
    });
    const json = response.json();

    // Client Side Deletion
    console.log(json);
    console.log("Deleting note with id: " + id);
    const newNotes = notes.filter((note) => note._id !== id);
    setNotes(newNotes);
  };

  // Edit a note (Update Operation)
  const editNote = async (id, title, description, tag) => {

    // API Call
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token":localStorage.getItem('token')
      },
      body: JSON.stringify({title, description, tag}), 
    });
    const json = await response.json();
    console.log(json);

    // Logic to edit note on client side
    let newNotes = JSON.parse(JSON.stringify(notes)); // Creating copy of notes
    for (let i = 0; i < newNotes.length; i++) {
      const element = newNotes[i];
      if (element._id === id) {
        newNotes[i].title = title;
        newNotes[i].description = description;
        newNotes[i].tag = tag;
        break;
      }
    }
    setNotes(newNotes);
  };

  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
