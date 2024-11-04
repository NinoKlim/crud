// Підключаємо технологію express для back-end сервера
const express = require('express')
const { emit } = require('nodemon')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class User {
  static #list = []

  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }

  static add = (user) => {
    this.#list.push(user)
  }

  static getList = () => {
    return this.#list
  }

  static deleteById = (id) => {
    const userExists = this.#list.some(user => user.id === id);
    if(userExists){
      this.#list = this.#list.filter(user => user.id !== id)
    }
    return userExists
  }

  static updateById = (id, email, password) => {
   const user = this.#list.find(user => user.id === id)

   if(user){
    if(user.password !== password){
   return {success: false, message: 'Incorrect password'};
    }

    if(email){
     user.email = email;
    }
    return {success: true}
   }
   return {success: false, message:"User not found"}
  }
}

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку
  const list = User.getList()
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',

    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================
router.post('/success-info', function (req, res) {
  const { email, login, password } = req.body

  const user = new User(email, login, password)
  User.add(user)

  res.render('success-info', {
    style: 'success-info',
    info: 'User created',
  })
  // ↑↑ сюди вводимо JSON дані
})

router.get('/success-info', function (req, res) {
  const { id } = req.query

 const userDelted = User.deleteById(Number(id))

  res.render('success-info', {
    style: 'success-info',
    info: userDelted ? 'User deleted' : 'User not found',
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/user-update', function (req, res) {
  const { id, email, password} = req.body

  const result = User.updateById(Number(id), email, password)

  res.render('success-info', {
    style: 'success-info',
    info: result.success ? 'User updated': result.message,
  });
  // ↑↑ сюди вводимо JSON дані
})
// Підключаємо роутер до бек-енду
module.exports = router
