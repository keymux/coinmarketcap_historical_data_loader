const mysql = require("mysql");

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
  database: MYSQL_DATABASE,
  port: MARIADB_PORT || MYSQL_PORT,
};

console.error("\n\n====================================");
console.error(opts);
console.error("====================================\n\n");

const mysqlc = mysql.createConnection(
  Object.assign(
    {
      password: MYSQL_PASSWORD,
    },
    opts
  )
);

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
