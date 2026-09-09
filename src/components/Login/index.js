import {Component} from 'react'
import Cookie from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', isError: false, errorMsg: ''}

  formSubmit = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      this.onSuccess(data.jwt_token)
    } else {
      this.onFailure(data.error_msg)
    }
  }

  onSuccess = jwtToken => {
    this.setState({isError: false})
    const {history} = this.props
    Cookie.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
  }

  onFailure = error => {
    this.setState({isError: true, errorMsg: error})
  }

  usernameCurrent = event => {
    this.setState({username: event.target.value})
  }

  usernamePassword = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const {password, username, isError, errorMsg} = this.state
    return (
      <div className="bg-container">
        <div className="login-card">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="logo"
          />
          <form className="form" onSubmit={this.formSubmit}>
            <label className="label" htmlFor="username">
              USERNAME
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={this.usernameCurrent}
              className="input-box"
            />
            <label className="label" htmlFor="password">
              PASSWORD
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={this.usernamePassword}
              className="input-box"
            />
            <button className="login-button" type="submit">
              Login
            </button>
          </form>
          {isError && <p className="error-message">{errorMsg}</p>}
        </div>
      </div>
    )
  }
}

export default Login
