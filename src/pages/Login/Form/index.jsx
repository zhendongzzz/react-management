import React from 'react'
import { Button, Checkbox, Form, Input, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { reqLogin } from '../../../api'
import { setUser } from '../../../utils/UserStorage'
const App = () => {
  const navigate = useNavigate()
  const onFinish = async (values) => {
    const { username, password } = values
    const res = await reqLogin(username, password)
    if (res.status === 0) {
      const { username } = res.data
      message.success('登陆成功')
      // console.log('登陆成功', res.data.data)
      navigate('/', { replace: true })
      setUser(username)
    } else {
      message.error(res.msg)
    }
  }
  const onFinishFailed = (errorInfo) => {
    return
  }
  return (
    <Form
      name="basic"
      labelCol={{
        span: 8
      }}
      wrapperCol={{
        span: 16
      }}
      initialValues={{
        remember: true
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="用户名"
        name="username"
        rules={[
          {
            required: true,
            message: '请输入用户名!'
          }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="密码"
        name="password"
        rules={[
          {
            required: true,
            message: '请输入密码！'
          }
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="remember"
        valuePropName="checked"
        wrapperCol={{
          offset: 8,
          span: 16
        }}
      >
        <Checkbox>记住密码</Checkbox>
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16
        }}
      >
        <Button type="primary" htmlType="submit" ghost>
          登录
        </Button>
      </Form.Item>
    </Form>
  )
}
export default App
