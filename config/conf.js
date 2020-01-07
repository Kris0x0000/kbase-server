module.exports = {
  // defult administration user, created if no users found in db.
  username: "kris",
  password: "1234",

  // token expiry timeout
  token_timeout: 1800,

  // mongodb://username:password@address:port/database
  db_conn_string: 'mongodb://dba:password@localhost:27017/test'
}
