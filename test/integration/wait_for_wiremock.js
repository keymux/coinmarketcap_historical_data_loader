const rp = require("request-promise");

before(function() {
  const start = Date.now();
  const timeout = 5000;

  // add 5% so the below function will finish first
  this.timeout(timeout * 1.05);

  return new Promise((resolve, reject) => {
    const retry = () => {
      return rp({
        uri: `http://localhost:${process.env.WIREMOCK_PORT}/__admin/mappings`,
      })
        .then(res => {
          console.error("success");

          resolve(res);
        })
        .catch(err => {
          if (start + timeout < Date.now()) {
            return reject(err);
          }

          setTimeout(retry);
        });
    };

    setTimeout(retry);
  });
});
