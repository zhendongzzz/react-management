// 商品详情富文本编辑器
import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { convertToRaw, EditorState, ContentState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
// 通过 forwardRef 可以将函数组件变成一个 ref 容器 供父组件使用
const RichTextEditor = forwardRef((props, ref) => {
  // 给父组件提供的方法
  useImperativeHandle(ref, () => {
    return {
      getDetail: () => {
        return draftToHtml(convertToRaw(editorState.getCurrentContent()))
      }
    }
  })
  useEffect(() => {
    const detail = props.detail
    if (detail) {
      // 如果有值, 根据html格式字符串创建一个对应的编辑对象
      const contentBlock = htmlToDraft(detail)
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
      const editorState = EditorState.createWithContent(contentState)
      setEditorState(editorState)
    }
  }, [])
  // 使用 EditorState.createEmpty() 来创建一个容器
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const onEditorStateChange = (data) => {
    setEditorState(data)
  }

  return (
    <div>
      <Editor editorState={editorState} editorStyle={{ border: '1px solid #eee', minHeight: 200, paddingLeft: 20 }} onEditorStateChange={onEditorStateChange} />
    </div>
  )
})

export default RichTextEditor
