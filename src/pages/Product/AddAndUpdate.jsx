import React, { useEffect, useRef, useState } from 'react'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Cascader, Card, Form, Input, Button, message } from 'antd'
import { reqAddOrUpdateProduct, reqCategory } from '../../api'
import { useLocation, useNavigate } from 'react-router-dom'
import PhotoWall from './PhotoWall'
import RichTextEditor from './RichTextEditor'
import { useForm } from 'antd/es/form/Form'
const { TextArea } = Input
// 组件代码
export default function AddAndUpdate() {
  // hooks
  const [form] = useForm()
  const pwRef = useRef(null)
  const textRef = useRef(null)
  const [options, setOptions] = useState([])
  const [loading2, setLoading2] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const record = location.state || {}
  const flag = !!location.state
  useEffect(() => {
    getCategory(0)
  }, [])
  // 初始化级联菜单数据
  const initOptions = async (category) => {
    setLoading2(true)
    let array = category.map((item) => ({
      value: item._id,
      label: item.name,
      isLeaf: false
    }))
    if (flag) {
      if (record.record.pCategoryId !== '0') {
        const child = await getCategory(record.record.pCategoryId)
        let arr2 = child.map((item) => ({
          value: item._id,
          label: item.name,
          isLeaf: true
        }))
        array = array.map((item) => {
          if (item.value === record.record.pCategoryId) {
            item.children = arr2
          }
          return item
        })
      }
    }
    setOptions(array)
    setLoading2(false)
  }
  // 获取分类列表
  const getCategory = async (parentId) => {
    const res = await reqCategory(parentId)
    if (res.status === 0) {
      const category = res.data
      if (parentId === 0) {
        initOptions(category)
      } else {
        return category
      }
    }
  }
  // 级联选择器配置项
  const onChange = (value, selectedOptions) => {
    // console.log(value, selectedOptions)
  }
  const loadData = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1]
    targetOption.loading = true
    const subCategory = await getCategory(targetOption.value)
    targetOption.loading = false
    if (subCategory && subCategory.length > 0) {
      const childOptions = subCategory.map((item) => ({ value: item._id, label: item.name, isLeaf: true }))
      targetOption.children = childOptions
    } else {
      targetOption.isLeaf = true
    }
    setOptions([...options])
  }
  // card 标题
  const title = (
    <span>
      <ArrowLeftOutlined onClick={() => navigate(-1)} style={{ color: 'blue', fontSize: 22, marginRight: 20 }} />
      <span style={{ fontSize: 18 }}>{flag ? '修改商品' : '添加商品'}</span>
    </span>
  )
  // 表单提交
  const submit = async () => {
    form
      .validateFields()
      .then((values) => {
        const { name, desc, price, category } = values
        let pCategoryId, categoryId
        if (category.length === 1) {
          pCategoryId = '0'
          categoryId = category[0]
        } else {
          pCategoryId = category[0]
          categoryId = category[1]
        }
        // 获取图片列表
        const imgs = pwRef.current.getImageList()
        const detail = textRef.current.getDetail()
        const product = { name, desc, price, imgs, detail, pCategoryId, categoryId }
        if (flag) {
          const { _id } = record.record
          product._id = _id
        }
        reqAddOrUpdateProduct(product)
        message.success('提交成功')
        navigate('/goods/product/home')
      })
      .catch((errorInfo) => {
        message.error('请正确输入信息')
      })
  }
  return (
    <Card title={title}>
      <Form form={form}>
        <Form.Item
          name={'name'}
          rules={[
            {
              required: true,
              message: '请输入商品名称'
            }
          ]}
          style={{ width: '30%' }}
          label="商品名称："
          initialValue={flag ? record.record.name : ''}
        >
          <Input placeholder="请输入商品名称"></Input>
        </Form.Item>
        <Form.Item
          name={'desc'}
          rules={[
            {
              required: true,
              message: '请输入商品描述'
            }
          ]}
          style={{ width: '30%' }}
          label="商品描述："
          initialValue={flag ? record.record.desc : null}
        >
          <TextArea placeholder="请输入商品描述"></TextArea>
        </Form.Item>
        <Form.Item
          name={'price'}
          rules={[
            {
              required: true,
              message: '请输入商品价格'
            }
          ]}
          style={{ width: '30%' }}
          label="商品价格"
          initialValue={flag ? record.record.price : ''}
        >
          <Input placeholder="请输入商品价格" addonAfter="元" />
        </Form.Item>
        <Form.Item
          name={'category'}
          rules={[
            {
              required: true,
              message: '请选择商品分类'
            }
          ]}
          style={{ width: '30%' }}
          label="商品分类"
          initialValue={flag ? (record.record.pCategoryId === '0' ? [record.record.categoryId] : [record.record.pCategoryId, record.record.categoryId]) : []}
        >
          <Cascader loading={loading2} placeholder="请选择商品分类" options={options} loadData={loadData} onChange={onChange} changeOnSelect />
        </Form.Item>
        <Form.Item label="商品图片">
          <PhotoWall ref={pwRef} imgs={flag ? record.record.imgs : null} />
        </Form.Item>
        <Form.Item label="商品详情">
          <div>
            <RichTextEditor ref={textRef} detail={flag ? record.record.detail : null} />
          </div>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={submit}>
            提交
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}
