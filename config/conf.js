module.exports = {
  // defult administration user, created if no users found in db.
  username: "admin",
  password: "12345",

  // token expiry timeout (seconds)
  token_timeout: 1800,

  // whatever, but need to change before use for security reasons
  jwt_key: 'arturborubar',

  // mongodb://username:password@address:port/database
  db_conn_string_dev: 'mongodb://localhost:27017/baza_wiedzy',
  db_conn_string_prod: 'mongodb://mongo:27017/baza_wiedzy'
}
