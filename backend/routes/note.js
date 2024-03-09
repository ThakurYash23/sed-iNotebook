// This file will contain all the ROUTES required for notes of a user. i.e. createnote, updatenote, deletenote, fetchallnotes. etc

const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/notesModel');
const { body, validationResult} = require('express-validator');

//ROUTE 1:  fetch all the notes of loggedin user using : GET "/api/notes/fetchallnotes". login required

router.get('/fetchallnotes', fetchuser, async (req, res) => { // Since this endpoint need user to loggedin that's why we need to use fetchuser to get the loggedin user details.
    
    try{
        const notes = await Note.find({user: req.user.id}) // req.user has loggedin user info from fetchuser middleware
        res.json(notes);
    }
    catch(error){
        console.log(error.message)
        res.status(500).send("Internal server error")
    }
});


//ROUTE 2:  Add a new note using : POST "/api/notes/addnote". login required

router.post('/addnote', fetchuser, [
    body('title', "Enter a valid title.").isLength({min: 3}),
    body('description', "description must have atleast 5 Character.").isLength({min: 5})
], async (req, res) => { 
    
    try{
        const { title, description, tag } = req.body;
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array() });
        }

        // Creating a Note here to save in DB along with user id
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save();
        res.json(savedNote);
    }
    catch(error){
        console.log(error.message)
        res.status(500).send("Internal server error")
    }
});

//ROUTE 3:  Update an Existing Note using : PUT "/api/notes/updatenote". login required

// PUT we basically use to update the existing entity.
router.put('/updatenote/:id', fetchuser, async (req, res) => { 
    try{
        const { title, description, tag } = req.body;

        // Create a new Note Object
        const newNote = {};
        if(title){newNote.title = title}
        if(description){newNote.description = description}
        if(tag){newNote.tag = tag}

        // Find the note to be updated and update it
        let note = await Note.findById(req.params.id);  // req.params.id means the id of note we are sending from frontend. It comes in params

        // Whether this note exist or attacker manipulates the param id
        if(!note){return res.status(404).send("Not Found")}

        // Whether this note is for logged in user or not
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed")
        }

        note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true});
        res.json({note});
    }
    catch(error){
        console.log(error.message)
        res.status(500).send("Internal server error")
    }
})

//ROUTE 4:  Delete a Note using : DELETE "/api/notes/deletenote". login required

// DELETE method of HTTP request is basically used for deletion of an entity.
router.delete('/deletenote/:id', fetchuser, async (req, res) => { 
    try{

        // Find the note to be Deleted and delete it
        let note = await Note.findById(req.params.id);  // req.params.id means the id of note we are sending from frontend. It comes in params

        // Whether this note exist or attacker manipulates the param id
        if(!note){return res.status(404).send("Not Found")}

        // Whether this note is for logged in user or not
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed")
        }

        note = await Note.findByIdAndDelete(req.params.id);
        res.json({"Success":"This note has been deleted.", note:note});
    }
    catch(error){
        console.log(error.message)
        res.status(500).send("Internal server error")
    }
})
module.exports = router;