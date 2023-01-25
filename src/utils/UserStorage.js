// 存储用户登录信息

export const setUser = (user) => {
  localStorage.setItem('user_key', user)
}

export const getUser = () => {
  return localStorage.getItem('user_key')
}

export const removeUser = () => {
  localStorage.removeItem('user_key')
}
