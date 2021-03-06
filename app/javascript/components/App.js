import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import styled from 'styled-components';
// import uuid from 'uuid';
import axios from 'axios';

import Todo from './Todo';
import Header from './Layout/Header';
import TodoCreate from './TodoCreate';
import About from './pages/About';

const csrfToken = document.querySelector('[name="csrf-token"]').content
axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken

const Body = styled.div`
  background: #916dd5;
`
class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      tasks: [
        // {id: uuid.v4(), title: "This is a tak", description: "Go to the library", completed: false },
        // {id: uuid.v4(), title: "I have to do this now", description: "Go to the gym", completed: false },
        // {id: uuid.v4(), title: "I am in a hurry", description: "Cook some food", completed: false }
      ]
    }
  }

  componentDidMount() {
    // Getting the data from jsonplaceholder
    // axios.get('http://jsonplaceholder.typicode.com/todos?_limit=1')
    //   .then((data) => {
    //     this.setState({
    //       tasks: data.data
    //     })
    //   })
    //   .catch((data) =>{
    //     console.log(data);
    //   })

    // Getting the data from the back with ruby
    axios.get('/fetch_tasks.json')
      .then((data) => {
        this.setState({
          tasks: data.data.tasks
        })
      })
      .catch((data) => {
        console.log(data)
      })
  }

  markComplete = (id) => {
    axios.post('/mark_completed.json', {
      id: id
    })
    .then((data) => {
      this.setState({
        tasks: this.state.tasks.map(todo => {
          if(todo.id === id) {
            todo.completed = !todo.completed
          }
          return todo;
        })
      })
    })
    .catch((data) => {
      console.log(data)
    })
    // this.setState({
    //   tasks: this.state.tasks.map(todo => {
    //     if(todo.id === id) {
    //       todo.completed = !todo.completed
    //     }
    //     return todo;
    //   })
    // })
  }

  deleteTask = (id) => {
    //LOCAL STATE
    // let newState = this.state.tasks.filter(f => f.id != id)
    // this.setState({ tasks: newState });

    //USING JSON PLACEHOLDER
    // axios.delete(`http://jsonplaceholder.typicode.com/todos/${id}`)
    //   .then((data) =>{
    //     this.setState({
    //       tasks: [...this.state.tasks.filter(f => f.id !== id)]
    //     })
    //   })

    //BACKEND
    axios.delete('/destroy.json',{
      data:{id}
    })
    .then((data) => {
      this.setState({
        tasks: [...this.state.tasks.filter(f => f.id !== id)]
      })
      console.log(this.state.tasks)
    })
  }

  addTodo = (title, description) => {
    //LOCAL STATE
    // const newTodo = {
    //   id: uuid.v4(),
    //   title,
    //   description,
    //   completed: false
    // }
    // this.setState({ tasks: [...this.state.tasks, newTodo]})

    // USING JSONPLACEHOLDER
    // axios.post('http://jsonplaceholder.typicode.com/todos', {
    //   id: uuid.v4(),
    //   title,
    //   description,
    //   completed: false
    // })
    // .then((data) => {
    //   this.setState({ tasks: [...this.state.tasks, data.data] })
    // })

    //BACKEND
    axios.post('/create_task.json', {
      title,
      description
    })
    .then((data) => {
      const newItem = {
        title,
        description,
        completed: false,
        id: data.data.task.id,
        created_at: data.data.task.created_at,
        updated_at: data.data.task.updated_at
      }
      this.setState({
        tasks: [...this.state.tasks, newItem]
      })
    })
    .catch((data) => {
      console.log(data)
    })
  }


  render() {
    return (
      <Router>
        <Body>
          <Header />
          <Route exact path="/" render={props => (
            <React.Fragment>
              <TodoCreate addTodo={this.addTodo} />
              <Todo 
                todos={this.state.tasks} 
                markComplete={this.markComplete} 
                deleteTask={this.deleteTask}
              />
            </React.Fragment>
          )} />
          <Route path="/about" component={About} />
        </Body>
      </Router>
    )
  };
};

export default App;