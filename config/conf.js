const dev_settings = {
  // defult administration user, created if no users found in db.
  username: "admin",
  password: "12345",

  // token expiry timeout (seconds)
  token_timeout: 1800,

  // whatever, but need to change before use for security reasons
  jwt_key: 'arturborubar',

  // mongodb://username:password@address:port/database
  db_conn_string: 'mongodb://localhost:27017/baza_wiedzy',
  cors_origin_url: 'http://localhost:3000'
};

const prod_settings = {
  // defult administration user, created if no users found in db.
  username: "admin",
  password: "12345",

  // token expiry timeout (seconds)
  token_timeout: 1800,

  // whatever, but need to change before use for security reasons
  jwt_key: 'arturborubar',

  // mongodb://username:password@address:port/database
  db_conn_string: 'mongodb://mongo:27017/baza_wiedzy',
  cors_origin_url: 'https://wiedza.zikom.com.pl:443'
};

module.exports = function() {

  if(process.env.NODE_ENV === 'production') {
      return(prod_settings);
  } else {
    //development
      return(dev_settings);
  }
};
