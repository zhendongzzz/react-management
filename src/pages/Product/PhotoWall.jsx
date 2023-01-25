import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { message, Modal, Upload } from 'antd'
import { reqDeleteImg } from '../../api'

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
const PhotoWall = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => {
    return {
      getImageList: () => fileList.map((file) => file.name)
    }
  })
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [fileList, setFileList] = useState([])
  //props
  const { imgs } = props
  useEffect(() => {
    if (imgs && imgs.length > 0) {
      setFileList(
        imgs.map((img, index) => ({
          uid: -index,
          name: img,
          statue: 'done',
          url: 'http://localhost:5000/upload/' + img
        }))
      )
    }
  }, [])

  const handleCancel = () => setPreviewOpen(false)
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setPreviewImage(file.url || file.preview)
    setPreviewOpen(true)
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
  }
  const handleChange = async ({ file, fileList: newFileList }) => {
    //图片上传成功
    if (file.status === 'done') {
      const res = file.response
      if (res.status === 0) {
        message.success('上传图片成功')
        file.name = res.data.name
        file.url = res.data.url
        newFileList[newFileList.length - 1] = file
        console.log(newFileList)
      } else {
        message.error('上传失败')
      }
    }
    if (file.status === 'removed') {
      const res = await reqDeleteImg(file.name)
      if (res.status === 0) message.success('删除成功')
      else message.error('删除失败')
    }
    // 图片上传失败
    setFileList(newFileList)
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8
        }}
      >
        Upload
      </div>
    </div>
  )
  return (
    <>
      <Upload accept="image/*" action="/manage/img/upload" listType="picture-card" name="image" fileList={fileList} onPreview={handlePreview} onChange={handleChange}>
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img
          alt="example"
          style={{
            width: '100%'
          }}
          src={previewImage}
        />
      </Modal>
    </>
  )
})
export default PhotoWall
