import React, { useEffect } from 'react'
import { Link, Navigate, useNavigate, useRoutes, useLocation } from 'react-router-dom'
import { getUser, removeUser } from '../../utils/UserStorage'
import { message } from 'antd'
import logo from '../../assets/笑脸.png'
import { InboxOutlined, TableOutlined, HomeOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons'
import { Breadcrumb, Layout, Menu, theme } from 'antd'
import * as dayjs from 'dayjs'
import routes from '../../routes'
import { reqWeather } from '../../api'
const { Header, Content, Footer, Sider } = Layout
// 左侧 menu 配置项
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label
  }
}
const items = [
  getItem('首页', '/home', <HomeOutlined />),
  getItem('商品', '/goods', <InboxOutlined />, [getItem('品类管理', '/goods/category'), getItem('商品管理', '/goods/product')]),
  getItem('用户管理', '/user', <UserOutlined />),
  getItem('角色管理', '/role', <TeamOutlined />),
  getItem('图形图表', '/table', <TableOutlined />, [getItem('柱状图', '/table/bar'), getItem('饼图', '/table/pie'), getItem('折线图', '/table/line')])
]

export default function Admin() {
  // hooks
  const navigate = useNavigate()
  const main = useRoutes(routes)
  const { pathname } = useLocation()
  const [weather, setWeather] = React.useState()
  const [nowTime] = React.useState(dayjs().format('YYYY-MM-DD'))

  useEffect(() => {
    getWeather()
    async function getWeather() {
      let data = await reqWeather()
      setWeather(data.result.now.text)
    }
  })

  // 面包屑状态
  const brands = pathname.split('/').slice(1)
  // 背景颜色
  const {
    token: { colorBgContainer }
  } = theme.useToken()
  // 自定义事件
  // 退出
  function logout() {
    removeUser()
    message.success('已退出')
    navigate('/login')
  }
  // 点击左侧 menu 回调
  function toChildren({ key }) {
    navigate(key)
  }
  // 获取用户信息
  const user = getUser()
  if (!user) return <Navigate to="/login" />
  return (
    <div>
      <div
        style={{
          position: 'absolute',
          left: '200px',
          top: '20px',
          width: 200,
          display: 'flex',
          justifyContent: 'space-around'
        }}
      >
        <div>{nowTime}</div>
        <div>日照市</div>
        <div>{weather}</div>
      </div>
      <div
        style={{
          position: 'absolute',
          right: '60px',
          top: '10px'
        }}
      >
        Hello,{user}
      </div>
      <div
        style={{
          position: 'absolute',
          right: 10,
          top: 10,
          color: 'blue',
          cursor: 'pointer'
        }}
        onClick={logout}
      >
        退出
      </div>
      <Layout
        style={{
          minHeight: '100vh'
        }}
      >
        <Sider>
          <Link
            to="/"
            style={{
              display: 'flex',
              height: '50px',
              margin: 16,
              background: 'rgba(255, 255, 255, 0.2)'
            }}
          >
            <img style={{ flex: '2' }} src={logo} />
            <div style={{ flex: '5', fontSize: 24, color: 'white', lineHeight: '50px' }}>东东后台</div>
          </Link>
          <Menu theme="dark" onClick={toChildren} defaultSelectedKeys={['/home']} defaultOpenKeys={['/goods', '/table']} mode="inline" items={items} />
        </Sider>
        <Layout className="site-layout">
          <Header
            style={{
              padding: 0,
              height: 50,
              background: colorBgContainer,
              borderBottom: '1px solid blue'
            }}
          ></Header>
          <Content
            style={{
              margin: '0 16px'
            }}
          >
            <Breadcrumb
              style={{
                margin: '16px 0'
              }}
            >
              {brands.map((item, index) => {
                return <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>
              })}
            </Breadcrumb>
            <div
              style={{
                minHeight: 360,
                background: colorBgContainer
              }}
            >
              {main}
            </div>
          </Content>
          <Footer
            style={{
              textAlign: 'center'
            }}
          >
            Zhendongzzz ©2022 Created
          </Footer>
        </Layout>
      </Layout>
    </div>
  )
}
