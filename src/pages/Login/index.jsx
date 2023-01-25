import React, { Component } from 'react'
import App from './Form'
import './index.css'
import { getUser } from '../../utils/UserStorage'
import { Navigate } from 'react-router-dom'

export default class Login extends Component {
  render() {
    const user = getUser()
    if (user) return <Navigate to="/" />
    return (
      <div className="main">
        <div className="head">
          <h1 className="wz">后台管理系统</h1>
        </div>
        <div className="content">
          <App />
        </div>
      </div>
    )
  }
}
