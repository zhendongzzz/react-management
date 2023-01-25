import ajax from './ajax'

// 登录
export const reqLogin = (username, password) => ajax('/login', { username, password }, 'POST')

// 添加用户
export const reqAddUser = (user) => ajax('manage/user/add', user, 'POST')

// 获取天气接口
export const reqWeather = () => ajax('/weather/v1/?district_id=371100&ak=uMIhYEICVDAjtXDsnQCjeRtzTXXoynqh&data_type=all')

// 获取分类
export const reqCategory = (parentId) => ajax('/manage/category/list', { parentId })
// 添加分类
export const reqAddCategory = (categoryName, parentId) => ajax('/manage/category/add', { categoryName, parentId }, 'POST')
// 更新分类
export const reqUpdateCategory = ({ categoryId, categoryName }) => ajax('/manage/category/update', { categoryId, categoryName }, 'POST')

// 获取商品管理列表
export const reqProductList = (pageNum, pageSize) => ajax('/manage/product/list', { pageNum, pageSize })
// 搜索分页
export const reqSearchProduct = (type, name, pageNum, pageSize) => {
  return ajax('/manage/product/search', {
    [type]: name,
    pageNum,
    pageSize
  })
}
// 获取分类名称
export const reqListName = (categoryId) => ajax('/manage/category/info', { categoryId })
// 更新商品状态（上架/下架）
export const reqUpdateStatus = (productId, status) => {
  return ajax('/manage/product/updateStatus', { productId, status }, 'POST')
}
// 删除图片
export const reqDeleteImg = (name) => {
  return ajax('/manage/img/delete', { name }, 'POST')
}
// 添加/更新商品
export const reqAddOrUpdateProduct = (product) => ajax('/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')
