const mysql = require("mysql");

let mysqlc;

const mapEnv = ({
  MYSQL_HOSTNAME,
  MARIADB_PORT,
  MYSQL_PORT,
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
}) => ({
  host: MYSQL_HOSTNAME,
  port: MARIADB_PORT ? MARIADB_PORT : MYSQL_PORT,
  database: MYSQL_DATABASE,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
});

/**
 * Promises a mysql connection
 */
const mysqlcPromise = env =>
  /* Resolve with the connection if it already exists, otherwise promise a connection */
  mysqlc ? Promise.resolve(mysqlc) : connectPromise(env);

const connectPromise = env =>
  new Promise((resolve, reject) =>
    /* assign the created connection after mapping environment variables */
    (mysqlc = mysql.createConnection(mapEnv(env)))
      /* connect with that newly created connection */
      .connect(
        /* if there's an error, reject with it, otherwise resolve with the connection */
        err => (err ? reject(err) : resolve(mysqlc))
      )
  );

/* After everything, end the mysql connection */
after(() =>
  mysqlc.end(err => {
    if (err) console.error(err); //eslint-disable-line no-console
    console.error("MySQL connection closed"); // eslint-disable-line no-console
  })
);

module.exports = {
  mysqlcPromise,
};
