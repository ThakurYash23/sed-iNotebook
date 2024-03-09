import React, { useContext, useState } from "react";
import noteContext from "../context/notes/noteContext";

const AddNote = (props) => {
  const context = useContext(noteContext);
  const { addNote } = context;
  const [note, setNote] = useState({title:"", description:"", tag:""});

  const handleAddNoteClick = (e) => {
    e.preventDefault();
    addNote(note.title, note.description, note.tag);
    setNote({title:"", description:"", tag:""}); // Making Input Fields Empty Once the note is added
    props.showAlert(" Added Successfully", "success")
  }

  const handleonchange = (e) => {
    setNote({...note, [e.target.name]: e.target.value})
  }

  return (
    <div className="container my-3">
      <h2>Add a Note</h2>
      <form className="my-3">
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={note.title}
            onChange={handleonchange}
            aria-describedby="emailHelp"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <input
            type="text"
            className="form-control"
            id="description"
            name="description"
            value={note.description}
            onChange={handleonchange}
            minLength={5}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="tag" className="form-label">
            Tag
          </label>
          <input
            type="text"
            className="form-control"
            id="tag"
            name="tag"
            value={note.tag}
            onChange={handleonchange}
            minLength={5}
            required
          />
        </div>
        <button disabled={note.title.length<5 || note.description.length<5 || note.tag.length<5} type="submit" className="btn btn-primary" onClick={handleAddNoteClick}>
          {/* Disabled condition for making input field required for min of length 5 */}
          Add Note
        </button>
      </form>
    </div>
  );
};

export default AddNote;
