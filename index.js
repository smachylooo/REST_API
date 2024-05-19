// Bringin the express server and create application
let express = require("express");
let app = express();
let pieRepo = require("./repos/pieRepo");
let errorHelper = require("./helpers/errorHelpers");
let cors = require("cors");

// Use the express Router object -- маршрутизатор
let router = express.Router();

// Configure middleware to support JSON data parsing to request object
app.use(express.json());

// Configure cors
app.use(cors());

// Create GET to return a list of all pies
router.get("/", (req, res, next) => {
  pieRepo.get(
    (data) => {
      res.status(200).json({
        status: 200,
        statusText: "OK",
        message: "All pies retrieved.",
        data: data,
      });
    },
    (err) => {
      next(err);
    }
  );
});

router.get("/search", (req, res, next) => {
  let searchObject = {
    id: 1,
    name: "A",
  };

  pieRepo.search(
    searchObject,
    (data) => {
      res.status(200).json({
        status: 200,
        statusText: "OK",
        message: "All pies retrieved.",
        data: data,
      });
    },
    (err) => {
      next(err);
    }
  );
});

router.get("/:id", (req, res, next) => {
  pieRepo.getByID(
    req.params.id,
    (data) => {
      if (data) {
        res.status(200).json({
          status: 200,
          statusText: "OK",
          message: "Single pie retrieved.",
          data: data,
        });
      } else {
        res.status(404).json({
          status: 404,
          statusText: "Not Found",
          message: `The pie '${req.params.id}' could not be found.`,
          error: {
            code: " NOT_FOUND",
            message: `The pie '${req.params.id}' could not be found.`,
          },
        });
      }
    },
    (err) => {
      next(err);
    }
  );
});

router.post("/", (req, res, next) => {
  pieRepo.insert(
    req.body,
    (data) => {
      res.status(201).json({
        status: 201,
        statusText: "Created",
        message: "New Pie Adeded.",
        data: data,
      });
    },
    (err) => {
      next(err);
    }
  );
});

router.put("/:id", (req, res, next) => {
  pieRepo.getByID(
    req.params.id,
    (data) => {
      if (data) {
        pieRepo.update(req.body, req.params.id, (data) => {
          res.status(200).json({
            status: 200,
            statusText: "OK",
            message: `Pie '${req.params.id}' updated.`,
            data: data,
          });
        });
      } else {
        res.status(404).json({
          status: 404,
          statusText: "Not Found",
          message: `The pie '${req.params.id}' could not be found.`,
          error: {
            code: " NOT_FOUND",
            message: `The pie '${req.params.id}' could not be found.`,
          },
        });
      }
    },
    (err) => {
      next(err);
    }
  );
});

router.delete("/:id", (req, res, next) => {
  pieRepo.getByID(
    req.params.id,
    (data) => {
      if (data) {
        pieRepo.delete(
          req.params.id,
          () => {
            res.status(200).json({
              status: 200,
              statusText: "OK",
              message: `Pie '${req.params.id}' deleted.`,
              data: data,
            });
          },
          (err) => {
            next(err);
          }
        );
      } else {
        res.status(404).json({
          status: 404,
          statusText: "Not Found",
          message: `The pie '${req.params.id}' could not be found.`,
          error: {
            code: "NOT_FOUND",
            message: `The pie '${req.params.id}' could not be found.`,
          },
        });
      }
    },
    (err) => {
      next(err);
    }
  );
});

router.patch("/:id", (req, res, next) => {
  pieRepo.getByID(
    req.params.id,
    (data) => {
      if (data) {
        // Attempt to update the data
        pieRepo.update(
          req.body,
          req.params.id,
          (data) => {
            res.status(200).json({
              status: 200,
              statusText: "OK",
              message: `Pie '${req.params.id}' patched`,
              data: data,
            });
          },
          (err) => {
            next(err);
          }
        );
      } else {
        res.status(404).json({
          status: 404,
          statusText: "Not Found",
          message: `The pie '${req.params.id}' could not be found.`,
          error: {
            code: "NOT_FOUND",
            message: `The pie '${req.params.id}' could not be found.`,
          },
        });
      }
    },
    (err) => {
      next(err);
    }
  );
});

// Configure router so all routes are prefixed with /api/v1
app.use("/api/", router);

// Configure exception logger to console
app.use(errorHelper.logErrorsToConsole);

// Configure exception logger to file
app.use(errorHelper.logErrorsToFile);

// Configure client error handler
app.use(errorHelper.clientErrorHandler);

// Configure catch-all exceprion middleware last
app.use(errorHelper.errorHandler);

// Crete server to listenn on port 3000
const server = app.listen(3000, () => {
  console.log("Node server are run on http://localhost:5000..");
});
