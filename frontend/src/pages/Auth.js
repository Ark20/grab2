import React, { Component } from 'react'
import './Auth.css' 
import AuthContext from '../context/auth-context'
// initate  auth page component 
//set state of logged in to true 
class AuthPage extends Component {

    state = {
        isLogin:true
    }
//
static contextType = AuthContext

    constructor(props){
    super(props)
    this.emailEl = React.createRef()
    this.passwordEl = React.createRef()  
    }
//pass in previous state and return opposite 
    switchMode = () => {
        this.setState(prevState => {
            return {isLogin: !prevState.isLogin}
        })
    }
//set submit handler for login button 
    submitHandler = (event) => {
        event.preventDefault()
        const email = this.emailEl.current.value
        const password = this.passwordEl.current.value
//if blank don't do anything 
        if(email.trim().length === 0 || password.trim().length === 0) {
            return; 
        }

        console.log(email,password)
        console.log(this.state.isLogin)
//if user credentials have been filled try logging in 
        let requestBody = {
            query: `
                query {
                    login(email: "${email}", password: "${password}") {
                    userId 
                    token
                    tokenExpiration    
                    }
                }
            `
        };
        
 //if form is being used for sign up create new user in request body      
if(!this.state.isLogin){
        requestBody = {
            query: `
                mutation {
                    createUser(userInput: {email: "${email}", password: "${password}"}) {
                       _id
                       email 
                    }
                }
            `
        }
    }
        fetch('http://localhost:8000/graphql', {// call request with request body set above 
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!')
            }
            return res.json()
            })
            .then(resData => {
                if(resData.data.login.token) {//if theres a token set 
                    this.context.login( //
                        resData.data.login.token, //call login from context with token, user id 
                        resData.data.login.userId, 
                        resData.data.tokenExpiration
                        )
                }
                console.log(resData)
            })
            .catch(err => {
           
        })
    }

    render() {
        return (
         <form className="auth" onSubmit={this.submitHandler}>
            <div className="form">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" ref={this.emailEl}/>
            </div>
            <div className="form">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" ref={this.passwordEl}/>
            </div>
            <div className="form-actions">
                <button type="submit">Submit</button>
                <button type="button" onClick={this.switchMode}>Switch to {this.state.isLogin ? 'Signup' : 'Login'}</button>
            </div>
        </form>
        )
    }
}

export default AuthPage