var config;
if (process.env.NODE_ENV === "production") {
  // eslint-disable-next-line import/no-absolute-path
  config = require("/home/ec2-user/config");
} else {
  config = require("./local_config");
}

module.exports = config;
