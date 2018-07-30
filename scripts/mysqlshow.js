const mysql = require("mysql");

console.error(process.env);

const {
  MARIADB_PORT,
  MYSQL_HOSTNAME,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
  MYSQL_PORT,
} = process.env;

const opts = {
  host: MYSQL_HOSTNAME,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  port: MARIADB_PORT || MYSQL_PORT,
};

const mysqlc = mysql.createConnection(opts);

mysqlc.connect();

mysqlc.query("SHOW TABLES", (error, results, fields) => {
  if (error) {
    console.error(error);

    mysqlc.end();

    process.exit(-1);
  }

  console.error(results);

  mysqlc.end();
});
