
import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import AdminLogin from './components/auth/AdminLogin'
import StudentLogin from './components/auth/StudentLogin'
import AdminDashboard from './components/Admin/AdminDashboard'
import StudentDashboard from './components/StudentDashboard'
import Test from './components/tests/Test'
import CreateTest from './components/tests/CreateTest'

import './css/main.css'

class App extends Component {
  render() {
    return ( 
      <div className="App">
        <div className="main_container">
          <BrowserRouter>
            <Switch>
              <Route path='/student/test/:id' component={Test} />
              <Route path='/student/:id' component={StudentDashboard} />
              <Route path='/login/student' component={StudentLogin} />
              <Route path='/login/admin-3Qa' component={AdminLogin} />
              <Route path='/student' component={StudentLogin} />
              <Route exact path='/admin' component={AdminDashboard} />
              <Route path='/create-test' component={CreateTest} />
              <Route component={StudentLogin} />
            </Switch>
          </BrowserRouter>
        </div>
      </div>
    );
  }
}

export default App;

