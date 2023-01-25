import { Button, Card, Input, message, Select, Table } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import React, { useState, useEffect } from 'react'
import { reqProductList, reqSearchProduct, reqUpdateStatus } from '../../api'
import { useNavigate } from 'react-router-dom'
export default function Home() {
  const [product, setProduct] = useState([]) //商品数组
  const [total, setTotal] = useState(0) // 分页总条数
  const [loading, setLoading] = useState(false) // table组件的loading
  const [searchName, setSearchName] = useState('') //搜索关键字
  const [searchType, setSearchType] = useState('productName') // 搜索关键字类型
  const [pageNum, setPageNum] = useState(1)
  const navigate = useNavigate()
  useEffect(() => {
    initProduct()
  }, [])

  const search = async (pageNum, pageSize) => {
    const result = await reqSearchProduct(searchType, searchName, pageNum, pageSize)
    if (result.status === 0) {
      setTotal(result.data.total)
      setProduct(result.data.list)
    }
  }
  const options = [
    { value: 'productName', label: '按名称搜索' },
    { value: 'productDesc', label: '按描述搜索' }
  ]
  const title = (
    <div style={{ width: '360px', display: 'flex', justifyContent: 'space-around' }}>
      <Select value={searchType} onChange={(value) => setSearchType(value)} defaultValue={'productName'} style={{ width: '120px' }} options={options} />
      <Input value={searchName} onChange={(e) => setSearchName(e.target.value)} placeholder="请输入关键字" style={{ width: '150px' }} />
      <Button onClick={() => search(1, 3)} type="primary">
        搜索
      </Button>
    </div>
  )
  const extra = (
    <Button onClick={() => navigate('/goods/product/addAndUpdate')} type="primary">
      <PlusOutlined />
      添加商品
    </Button>
  )
  const updateStatus = (status, item) => {
    return async () => {
      const { _id } = item
      if (status === 1) {
        const res = await reqUpdateStatus(_id, 2)
        if (res.status === 0) {
          message.success('更新成功')
          onChange(pageNum, 3)
        }
      } else {
        const res = await reqUpdateStatus(_id, 1)
        if (res.status === 0) {
          message.success('更新成功')
          onChange(pageNum, 3)
        }
      }
    }
  }
  // 初始化表格数据（属性）
  const columns = [
    {
      width: 200,
      title: '商品名称',
      dataIndex: 'name'
    },
    {
      title: '商品描述',
      dataIndex: 'desc'
    },
    {
      width: 100,
      title: '价格',
      dataIndex: 'price',
      render: (price) => '￥' + price
    },
    {
      width: 150,
      title: '状态',
      dataIndex: 'status',
      render: (status, item) => {
        return (
          <div>
            <Button onClick={updateStatus(status, item)} type="primary">
              {status === 1 ? '下架' : '上架'}
            </Button>
            <p>{status === 1 ? '在售' : '已下架'}</p>
          </div>
        )
      }
    },
    {
      width: 100,
      title: '操作',
      dataIndex: 'handle',
      render: (text, record, index) => {
        return (
          <>
            <a onClick={() => navigate('/goods/product/detail', { replace: false, state: { record } })}>详情</a>
            <br />
            <a onClick={() => navigate('/goods/product/addAndUpdate', { replace: false, state: { record } })}>修改</a>
          </>
        )
      }
    }
  ]
  const initProduct = async () => {
    setLoading(true)
    const res = await reqProductList(1, 3)
    if (res.status === 0) {
      const { total, list } = res.data
      setTotal(total)
      setProduct(list)
    }
    setLoading(false)
  }
  const onChange = async (page, pageSize) => {
    setPageNum(page)
    setLoading(true)
    if (searchName) {
      search(page, pageSize)
    } else {
      const res = await reqProductList(page, pageSize)
      if (res.status === 0) {
        const { total, list } = res.data
        setTotal(total)
        setProduct(list)
      }
    }
    setLoading(false)
  }
  return (
    <>
      <Card
        title={title}
        extra={extra}
        style={{
          width: '100%'
        }}
      >
        <Table
          loading={loading}
          pagination={{
            total,
            onChange,
            defaultPageSize: 3
          }}
          rowKey="_id"
          dataSource={product}
          columns={columns}
        />
      </Card>
    </>
  )
}
