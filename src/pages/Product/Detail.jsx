import { Card, List } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { reqListName } from '../../api'
export default function Detail() {
  ///hooks
  const [record, setRecord] = useState({})
  const [imgs, setImgs] = useState([])
  const [cName1, setCname1] = useState('')
  const [cName2, setCname2] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  useEffect(() => {
    if (location) {
      setRecord(location.state.record)
      setImgs(location.state.record.imgs)
      getListName()
    }
  }, [])
  const getListName = async () => {
    setLoading(true)
    const { pCategoryId, categoryId } = location.state.record
    if (pCategoryId === '0') {
      const res = await reqListName(categoryId)
      const { name } = res.data
      setCname1(name)
    } else {
      const res1 = await reqListName(pCategoryId)
      const res2 = await reqListName(categoryId)
      setCname1(res1.data.name)
      setCname2(res2.data.name)
    }
    setLoading(false)
  }
  // 自定义属性
  const __html = { __html: record.detail }
  const title = (
    <span>
      <ArrowLeftOutlined onClick={() => navigate(-1)} style={{ color: 'blue', fontSize: 22, marginRight: 20 }} />
      <span style={{ fontSize: 18 }}>商品详情</span>
    </span>
  )
  return (
    <Card title={title}>
      <List loading={loading} style={{ width: '90%' }}>
        <List.Item style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <span style={{ fontSize: 16 }}>商品名称：</span>
          <span>{record.name}</span>
        </List.Item>
        <List.Item style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <span style={{ fontSize: 16 }}>商品描述：</span>
          <span>{record.desc}</span>
        </List.Item>
        <List.Item style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <span style={{ fontSize: 16 }}>商品价格：</span>
          <span>{record.price}元</span>
        </List.Item>
        <List.Item style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <span style={{ fontSize: 16 }}>商品分类：</span>
          <span>{cName2 ? cName1 + '-->' + cName2 : cName1}</span>
        </List.Item>
        <List.Item style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <span style={{ fontSize: 16 }}>商品图片：</span>
          <span>
            {imgs.map((item, index) => {
              return <img key={index} style={{ width: 170, height: 160, border: '1px solid #eeee', marginRight: 10 }} src={' http://localhost:5000/upload/' + item} alt="" />
            })}
          </span>
        </List.Item>
        <List.Item style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <span style={{ fontSize: 16 }}>商品详情：</span>
          <span dangerouslySetInnerHTML={__html}></span>
        </List.Item>
      </List>
    </Card>
  )
}
