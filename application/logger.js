const { createLogger, format, transports } = require("winston");

const logger = createLogger({
  format: format.combine(
    format.simple(),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf((info) => `${info.timestamp} - ${info.filename} - [${info.level.toUpperCase()}]: ${info.message}`),
  ),
  transports: [
    new transports.File({
      maxsize: 31457280, // 30MB
      maxfiles: 75,
      filename: "logs.log",
      level: "debug",
    }),
  ],
});

module.exports = function loggerChild(name) {
  return logger.child({ filename: name });
};
