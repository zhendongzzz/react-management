import React from 'react'
import { Card, Table, Select, Modal, Input, Button, message, Form } from 'antd'
import { useEffect, useState } from 'react'
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { reqCategory, reqAddCategory, reqUpdateCategory } from '../../api/index'
import { useForm } from 'antd/es/form/Form'
export default function Category() {
  // hooks
  //表单数据
  const [dataSource, setDataSource] = useState([])
  // 表单属性
  const [columns, setColumns] = useState()
  // 弹出框标记
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalOpen2, setIsModalOpen2] = useState(false)
  const [loading, setLoading] = useState(false)
  const [parentId, setParentId] = useState('0')
  const [parentName, setParentName] = useState('')
  const [subCategory, setSubcategory] = useState()
  const [categoryId, setCategoryId] = useState()
  // form 对象
  const [form1] = useForm()
  const [form2] = useForm()
  useEffect(() => {
    //初始化表格数据
    initTable()
    getCategory()
  }, [parentId])
  // 自定义函数
  // 获取分类信息函数
  const getCategory = async () => {
    setLoading(true)
    const res = await reqCategory(parentId)
    if (res.status === 0) {
      if (parentId === '0') {
        setDataSource(res.data)
      } else {
        setSubcategory(res.data)
      }
    } else message.error('获取数据失败！')
    setLoading(false)
  }
  // 初始化表格属性
  const initTable = () => {
    setColumns([
      {
        title: '分类名称',
        dataIndex: 'name'
      },
      {
        title: '操作',
        width: 300,
        render: (category) => (
          <span>
            <a onClick={() => handler(category)}>修改分类</a>&nbsp;&nbsp;&nbsp;&nbsp;
            {parentId === '0' ? (
              <a
                onClick={() => {
                  showSubCategory(category)
                }}
              >
                查看子分类
              </a>
            ) : null}
          </span>
        )
      }
    ])
  }
  // model 对话框
  //添加
  const showModal = () => {
    setIsModalOpen(true)
  }
  const handleOk = () => {
    form1
      .validateFields()
      .then((values) => {
        console.log(values)
        const id = form1.getFieldValue('id')
        const name = form1.getFieldValue('name')
        form1.resetFields()
        reqAddCategory(name, id)
        getCategory()
        setIsModalOpen(false)
      })
      .catch((errorInfo) => {
        console.log(errorInfo)
      })
  }
  const handleCancel = () => {
    form1.resetFields()
    setIsModalOpen(false)
  }
  //修改
  const showModal2 = (category) => {
    setCategoryId(category._id)
    setParentName(category.name)
    setIsModalOpen2(true)
  }
  const handleOk2 = (value) => {
    form2
      .validateFields()
      .then((values) => {
        const categoryName = form2.getFieldValue('categoryName')
        reqUpdateCategory({ categoryId, categoryName })
        setIsModalOpen2(false)
        form2.resetFields()
        getCategory()
      })
      .catch((errorInfo) => {
        console.log(errorInfo)
      })
  }
  const handleCancel2 = () => {
    setIsModalOpen2(false)
    form2.resetFields()
  }
  const showSubCategory = (category) => {
    setParentId(category._id)
    setParentName(category.name)
    getCategory()
  }
  const handler = (category) => {
    setParentId('0')
    showModal2(category)
  }
  // 页面结构
  const title =
    parentId === '0' ? (
      '一级分类列表'
    ) : (
      <span>
        <a
          onClick={() => {
            setParentId('0')
          }}
        >
          一级分类列表
        </a>
        <ArrowRightOutlined />
        {parentName}
      </span>
    )
  const extra = (
    <Button onClick={showModal} type="primary">
      <PlusOutlined />
      添加
    </Button>
  )
  return (
    <>
      <Card
        title={title}
        extra={extra}
        style={{
          width: '100%'
        }}
      >
        <Modal title="添加分类" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <Form form={form1}>
            <Form.Item initialValue={parentId} name={'id'}>
              <Select style={{ margin: 15, width: '90%' }}>
                <Select.Option value="0">一级分类列表</Select.Option>
                {dataSource.map((c) => (
                  <Select.Option key={c._id} value={c._id}>
                    {c.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name={'name'} rules={[{ required: 'true', message: '内容不能为空' }]}>
              <Input style={{ margin: 15, width: '90%' }} placeholder="请输入分类名称" />
            </Form.Item>
          </Form>
        </Modal>
        <Modal title="更新分类" open={isModalOpen2} onOk={handleOk2} onCancel={handleCancel2}>
          <Form form={form2}>
            <Form.Item name={'categoryName'} rules={[{ required: 'true', message: '内容不能为空' }]}>
              <Input style={{ margin: 15, width: '90%' }} placeholder={parentName ? parentName : '请输入分类名称'} />
            </Form.Item>
          </Form>
        </Modal>
        <Table dataSource={parentId === '0' ? dataSource : subCategory} pagination={{ defaultPageSize: 5, showQuickJumper: true }} loading={loading} rowKey={'_id'} bordered columns={columns} />
      </Card>
    </>
  )
}
