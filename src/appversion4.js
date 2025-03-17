import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { X, Plus, Edit, Trash2 } from 'lucide-react';
import './noteWidget.scss';
import './popup.scss';

const NotesWidget = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: "", content: "", category: "", tags: [] });
  const [tagInput, setTagInput] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [isPopupWindowActive, setIsPopupWindowActive] = useState(true);
  const [isMainWindowActive, setIsMainWindowActive] = useState(false);

  useEffect(() => {
    const handleMainWindowBlur = () => {
      console.log('React: Main window is blurred');
      setIsMainWindowActive(false);
      setIsPopupWindowActive(true);
    };

    const handlePopupWindowFocus = () => {
      console.log('React: Popup window is focused');
      setIsPopupWindowActive(false);
      setIsMainWindowActive(true);
      window.electron.send('open-main-window');
    };

    window.electron.receive('main-window-blur', handleMainWindowBlur);
    window.electron.receive('popup-window-focus', handlePopupWindowFocus);

    return () => {
      window.electron.removeListener('main-window-blur', handleMainWindowBlur);
      window.electron.removeListener('popup-window-focus', handlePopupWindowFocus);
    };
  }, []);

  const addNote = () => {
    if (newNote.title.trim() && newNote.content.trim()) {
      const updatedNotes = [{ ...newNote, id: Date.now() }, ...notes];
      setNotes(updatedNotes);
      setNewNote({ title: "", content: "", category: "", tags: [] });
      setTagInput("");
      setIsAddingNote(false);
    }
  };

  const handleButtonClick = () => {
    console.log('React: Opening main window before sending IPC message');
    setIsPopupWindowActive(false);
    setIsMainWindowActive(true);
    window.electron.send('open-main-window');
  };

  const updateNote = () => {
    if (editingNote) {
      setNotes(prevNotes => {
        const updatedNotes = prevNotes.map(note => 
          note.id === editingNote.id ? editingNote : note
        );
        return [editingNote, ...updatedNotes.filter(note => note.id !== editingNote.id)];
      });
      setEditingNote(null);
    }
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const addTag = () => {
    if (tagInput.trim() && !newNote.tags.includes(tagInput)) {
      setNewNote({ ...newNote, tags: [...newNote.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const removeTag = (tag) => {
    setNewNote({ ...newNote, tags: newNote.tags.filter(t => t !== tag) });
  };

  return (
    <div className="notes-widget">
      {
        (isPopupWindowActive && !isMainWindowActive &&
           <div className="popup-container">
              <Button className="popup-button" onClick={handleButtonClick}>
                Open
              </Button>
            </div>
        ) ||
      
      (!isPopupWindowActive && isMainWindowActive &&
        <div id="notes-widget-window" className="notes-widget-container">
          <div className="notes-widget-header">
            <Button onClick={() => setIsAddingNote(!isAddingNote)} className="notes-widget-button"><Plus size={20} /></Button>
            {/* <Button onClick={() => setIsWindowVisible(false)} className="notes-widget-button"><X size={20} /></Button> */}
          </div>
          {(isAddingNote || editingNote) && (
            <Card className="note-form">
              <CardHeader className="notes-widget-header">
                <h2>{editingNote ? "Edit Note" : "Add a New Note"}</h2>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Note Title"
                  value={editingNote ? editingNote.title : newNote.title}
                  onChange={(e) => editingNote ? setEditingNote({ ...editingNote, title: e.target.value }) : setNewNote({ ...newNote, title: e.target.value })}
                  className="notes-widget-input"
                />
                <Textarea
                  placeholder="Note Content"
                  value={editingNote ? editingNote.content : newNote.content}
                  onChange={(e) => editingNote ? setEditingNote({ ...editingNote, content: e.target.value }) : setNewNote({ ...newNote, content: e.target.value })}
                  className="notes-widget-textarea"
                />
                <Input
                  placeholder="Category"
                  value={editingNote ? editingNote.category : newNote.category}
                  onChange={(e) => editingNote ? setEditingNote({ ...editingNote, category: e.target.value }) : setNewNote({ ...newNote, category: e.target.value })}
                  className="notes-widget-input"
                />
                <div className="tag-container">
                  <Input
                    placeholder="Add a tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    className="notes-widget-input"
                  />
                  <Button onClick={addTag} className="notes-widget-button">Add Tag</Button>
                </div>
                <div className="tags">
                  {newNote.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag} <span onClick={() => removeTag(tag)} className="remove-tag">✕</span>
                    </span>
                  ))}
                </div>
                <div className="flex justify-between">
                  <Button onClick={() => { setIsAddingNote(false); setEditingNote(null); }} className="notes-widget-button">Cancel</Button>
                  <Button onClick={editingNote ? updateNote : addNote} className="notes-widget-button">{editingNote ? "Update Note" : "Save Note"}</Button>
                </div>
              </CardContent>
            </Card>
          )}
          <div>
            {notes.map((note) => (
              <Card key={note.id} className={`note-card ${editingNote && editingNote.id === note.id ? 'hidden' : ''}`}>
                <CardHeader className="flex justify-between">
                  <h3>{note.title}</h3>
                  <div className="flex gap-2">
                    <Button onClick={() => setEditingNote(note)} className="notes-widget-button"><Edit size={16} /></Button>
                    <Button onClick={() => deleteNote(note.id)} className="notes-widget-button"><Trash2 size={16} /></Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{note.content}</p>
                  <p className="note-category">Category: {note.category}</p>
                  <div className="tags">
                    {note.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesWidget;
