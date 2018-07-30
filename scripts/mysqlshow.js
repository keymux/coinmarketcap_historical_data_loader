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

// eslint-disable-next-line no-console
console.error("\n\n====================================");
// eslint-disable-next-line no-console
console.error(opts);
// eslint-disable-next-line no-console
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

mysqlc.query("SHOW TABLES", (error, results) => {
  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);

    mysqlc.end();

    process.exit(-1);
  }

  // eslint-disable-next-line no-console
  console.error(results);

  mysqlc.end();
});
