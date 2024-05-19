let logRepo = require("../repos/logRepo");

let errorHelpers = {
  logErrorsToConsole: (err, req, res, next) => {
    console.error(
      `Log Entry: ${JSON.stringify(errorHelpers.errorBuilder(err))}`
    );
    console.error("*".repeat(80));
    next(err);
  },
  logErrorsToFile: (err, req, res, next) => {
    let errorObject = errorHelpers.errorBuilder(err);
    errorObject.requestInfo = {
      hostname: req.hostname,
      path: req.path,
      app: req.app,
    };
    logRepo.write(
      errorObject,
      (data) => {
        console.log(data);
      },
      (err) => {
        console.error(err);
      }
    );
    next(err);
  },
  clientErrorHandler: (err, req, res, next) => {
    if (req.xhr) {
      res.status(500).json({
        status: 500,
        statusText: "Internal Server Error",
        message: `XMLHTTPREQUEST ERROR`,
        error: {
          errno: 0,
          call: "XMLHTTPREQUEST Call",
          code: "Internal_Server_Error",
          message: `XMLHTTPREQUEST ERROR`,
        },
      });
    } else {
      next(err);
    }
  },
  errorHandler: (err, req, res, next) => {
    res.status(500).json(errorHelpers.errorBuilder(err));
  },
  errorBuilder: (err) => {
    return {
      status: 500,
      statusText: "Internal Server Error",
      message: `${err.message}`,
      error: {
        errno: err.errno,
        call: err.syscall,
        code: "Internal_Server_Error",
        message: `${err.message}`,
      },
    };
  },
};

module.exports = errorHelpers;
