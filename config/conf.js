const dev_settings = {
  // defult administration user, created if no users found in db.
  username: "admin",
  password: "12345",

  // token expiry timeout (seconds)
  token_timeout: 900000,

  // whatever, but need to change before use for security reasons
  //jwt_key: 'arturborubar',

  // mongodb://username:password@address:port/database
  db_conn_string: 'mongodb://localhost:27017/baza_wiedzy',
  cors_origin_url: 'http://localhost:3000',

  // in kilobytes
  upload_file_size_limit: 512,

  server_url_base: 'http://localhost:1234/'
};

let prod_settings = {
  // defult administration user, created if no users found in db.
  username: "admin",
  password: "12345",

  // token expiry timeout (seconds)
  token_timeout: 1800,

  // whatever, but need to change before use for security reasons
  //jwt_key: 'arturborubar',

  // mongodb://username:password@address:port/database
  db_conn_string: 'mongodb://mongo:27017/baza_wiedzy',
  cors_origin_url: 'https://wiedza.zikom.com.pl',

  // in kilobytes
  upload_file_size_limit: 512,

  server_url_base: 'https://wiedza.zikom.com.pl/'
};

module.exports = function() {
  if((process.env.NODE_ENV === 'production') && process.env.DBUSER && process.env.DBPASSWORD) {
    prod_settings = {...prod_settings, db_conn_string: `mongodb://${process.env.DBUSER}:${process.env.DBPASSWORD}@mongo:27017/baza_wiedzy`};
      return(prod_settings);
  }

  else if(process.env.NODE_ENV === 'production') {
      return(prod_settings);
  } else {
    //development
      return(dev_settings);
  }
};
