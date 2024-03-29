import React, { useState, useEffect } from 'react';
import { Button, FormControl, Input, InputLabel } from "@material-ui/core";
import './App.css';
import Todo from './Todo';
import db from './firebase';
import firebase from "firebase";
import { makeStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import SaveIcon from '@material-ui/icons/Save';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

function App() {
  /* in a state variable, 'todos' refer to the array elemets and 'setTodos' is used to append
  to 'todos'. Here we start with an empty list and then 'todos' will be an empty array and 
  'setTodos' will append to it. Also, it's a temporary memory, state will be cleared everytime
  we hit refresh. */
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const classes = useStyles();

  useEffect(() => {
    db.collection('todos').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setTodos(snapshot.docs.map(doc => ({
        id: doc.id,
        todo: doc.data().todo
      })))
    })
  }, [])

  const addTodo = (event) => {
    event.preventDefault();/* to stop page from refreshing everytime we click submit button */
    /*adding to firebase.*/
    db.collection('todos').add({
      todo: input,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    setTodos([...todos, input])/* spread in JS says, append input to todos, not replace */
    setInput('')/*clearing the input field after adding to list*/
  }
  return (
    <div className="App">
      <form>
        {/* Associating state 'input' variable to JSX */}
        <FormControl>
          <InputLabel>What do you want to do? </InputLabel>
          <Input value={input} /* variable and changing variable using 'setInput' */
            onChange={event => setInput(event.target.value)}>
          </Input>
        </FormControl>
        <Button
            variant="contained"
            color="primary"
            size="large"
            disabled={!input} /* keep button disabled till something is written in input field. */
            type="submit"
            onClick={addTodo}
            className={classes.button}
            startIcon={<SaveIcon />}>
            Add to my notes.
            </Button>
      </form>
        <ul>
          {todos.map(todo => (
            <Todo todo={todo}></Todo>
          ))}
        </ul>
    </div>
  );
}

export default App;
