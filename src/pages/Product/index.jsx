import React from 'react'
import { Navigate } from 'react-router-dom'
//引入子路由组件
import Home from './Home'
import Detail from './Detail'
import AddAndUpdate from './AddAndUpdate'
import { Route, Routes } from 'react-router-dom'
import './index.less'
export default function Product() {
  return (
    <>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/detail" element={<Detail />} />
        <Route path="/addAndUpdate" element={<AddAndUpdate />} />
        <Route path="/" element={<Navigate to="/goods/product/home" />} />
      </Routes>
    </>
  )
}
