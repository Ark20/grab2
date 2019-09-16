import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect,Switch } from 'react-router-dom';
import AuthPage from './pages/Auth'
import EventsPage from './pages/Events'
import BookingPage from './pages/Booking'
import MainNavigation from './components/Navigation/MainNavigation'
import AuthContext from './context/auth-context'

export default class App extends Component {
//set state of token and user id to be null 
state = {
  token: null,
  userId: null
 }; 
 //define login function that takes token, user id and sets state 
login = (token, userId, tokenExpiration) =>{
 this.setState({ token: token, userId: userId})
}

logout = () => {
  this.setState({ token: null, userId: null})

}//provider allows us to set current value of context 
render(){
  return (
    <BrowserRouter>
      <React.Fragment>
        <AuthContext.Provider 
        value={{
          token: this.state.token,
          userId: this.state.userId,
          login:this.login,
          logout: this.logout}}>
        <MainNavigation/>
        <main className="main">
          <Switch>
            
            {this.state.token && <Redirect from="/" to="/events" exact/>}
            {this.state.token && (
            <Redirect from="/auth" to="/events" exact/>
            )}
            {!this.state.token && (
            <Route path="/auth" component ={AuthPage}/>
            )}
            <Route path="/events" component ={EventsPage}/>
            {this.state.token && (
              <Route path="/bookings" component ={BookingPage}/>
            )}
            {!this.state.token && <Redirect to="/auth" exact/>}

          </Switch>
      </main>
      </AuthContext.Provider>
      </React.Fragment>
    </BrowserRouter>
  );
}}

