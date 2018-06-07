import React, { Component } from 'react';
import 'whatwg-fetch';

import { setInStorage, getFromStorage} from '../../utils/storage'

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      token:'',
      signUpError:'',
      signInError:'',
      masterError:'',
      signInEmail:'',
      signInPassword:'',
      signUpFirstName: '',
      signUpLastName: '',
      signUpEmail: '',
      signUpPassword: '',
    };

    this.onInputChangeSignUpPassword = this.onInputChangeSignUpPassword.bind(this); 
    this.onInputChangeSignUpFirstName = this.onInputChangeSignUpFirstName.bind(this); 
    this.onInputChangeSignUpEmail = this.onInputChangeSignUpEmail.bind(this); 
    this.onInputChangeSignUpLastName = this.onInputChangeSignUpLastName.bind(this); 
    this.onInputChangeSignInEmail = this.onInputChangeSignInEmail.bind(this); 
    this.onInputChangeSignInPassword = this.onInputChangeSignInPassword.bind(this);    
    this.signIn = this.signIn.bind(this);
    this.signUp = this.signUp.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    const obj = getFromStorage('the_main_app');
    
   if (obj && obj.token) {
      const { token } = obj;
      fetch('/api/account/verify?token=' + token , {headers:{'Content-type':'application/json'}})
            .then(res => res.json())
            .then(json => {
              if (json.success) {
                this.setState({
                  token: token,
                  isLoading:false
                })
              } else {
                this.setState({
                  isLoading:false
                })
              }
            });
   }
   else {
    this.setState({
      isLoading:false,

    })
   }
  }

  onInputChangeSignUpFirstName(event) {
    this.setState({signUpFirstName:event.target.value});
  }

  onInputChangeSignUpLastName(event) {
    this.setState({signUpLastName:event.target.value});
  }

  onInputChangeSignUpEmail(event) {
    this.setState({signUpEmail:event.target.value});
  }

  onInputChangeSignUpPassword(event) {
    this.setState({signUpPassword:event.target.value});
  }

  onInputChangeSignInEmail(event) {
    this.setState({signInEmail:event.target.value});
  }

  onInputChangeSignInPassword(event) {
    this.setState({signInPassword:event.target.value});
  }

  signIn() {
    const {
      signInEmail,
      signInPassword,
    } = this.state;

    this.setState({isLoading:true})

    fetch('/api/account/signin', 
      {
        method: 'POST',
        headers:{'Content-type':'application/json'},
        body: JSON.stringify({
          email: signInEmail,
          password: signInPassword
        }),
      }).then(res => res.json())
        .then(json => {
          if (json.success) {
            setInStorage('the_main_app', { token: json.token });
            this.setState({
              signInError:json.message,
              isLoading:false,
              signInEmail:'',
              signInPassword:'',
              token:json.token
            });
            } else {
              this.setState({
                signInError:json.message,
                isLoading:false
              });
            } 
        });
  }

  signUp() {
    const {
      signUpFirstName,
      signUpLastName, 
      signUpEmail,
      signUpPassword
    } = this.state;

    this.setState({isLoading:true})

    fetch('/api/account/signup', 
      {
        method: 'POST',
        headers:{'Content-type':'application/json'},
        body: JSON.stringify({
          firstName: signUpFirstName,
          lastName: signUpLastName,
          email: signUpEmail,
          password: signUpPassword
        }),
      }).then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              signUpError:json.message,
              isLoading:false,
              signUpEmail:'',
              signUpPassword:'',
              signUpFirstName:'',
              signUpLastName:''
            });
            } else {
              this.setState({
                signUpError:json.message,
                isLoading:false
              });
            } 
        });
  }

  logout() {
    this.setState({
      isLoading: true,
    });
    const obj = getFromStorage('the_main_app');
    if (obj && obj.token) {
      const { token } = obj;
      // Verify token
      fetch('/api/account/logout?token=' + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token: '',
              isLoading: false
            });
          } else {
            this.setState({
              isLoading: false,
            });
          }
        });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }
  

  render() {
    const { 
      isLoading, 
      token, 
      signInEmail, 
      signInPassword, 
      signInError, 
      signUpFirstName, 
      signUpLastName, 
      signUpEmail,
      signUpPassword
    } = this.state;
    if (isLoading) {
      return (<div><p>Loading...</p></div>)
    }


    if (!token) {
      return (
        <div>
          <div>
            {
              (signInError) ? (<p>{signInError}</p>) : (null)
            }
            <p>Sign In</p>
            <input type="email" placeholder="Email" value={signInEmail} onChange={this.onInputChangeSignInEmail} /> <br/>
            <input type="password" placeholder="Password" value={signInPassword} onChange={this.onInputChangeSignInPassword} /> <br/>
            <button onClick={this.signIn}>Sign In</button>
          </div>
          <div>
            <p>Sign Up</p>
            <input 
              type="text" 
              placeholder="First name"
              value={signUpFirstName}
              onChange={this.onInputChangeSignUpFirstName} /> 
            <br/>
            <input 
              type="text" 
              placeholder="Last name" 
              value={signUpLastName}
              onChange={this.onInputChangeSignUpLastName} /> 
            <br/>
            <input 
              type="email"
               placeholder="Email" 
               value={signUpEmail}
               onChange={this.onInputChangeSignUpEmail} /> 
            <br/>
            <input 
              type="password" 
              placeholder="Password"
              value={signUpPassword}
              onChange={this.onInputChangeSignUpPassword} /> 
            <br/>
            <button onClick={this.signUp}>Sign Up</button>
          </div>
        </div>
      );
    }
    return (
      <div>
       Account
       <button onClick={this.logout}>Logout</button>
      </div>
    );
  }
}

export default Home;
