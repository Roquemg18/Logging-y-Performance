const cartsController = require("../carts/controller.carts");
const productsController = require("../products/controller.products");
const messagesController = require("../messages/controller.messages");
const authController = require("../auth/controller.auth");
const usersController = require("../users/controller.users");
const viewsTemplateController = require("../viewsTemplate/controller.viewsTemplate");
const sessionsController = require("../sessions/controller.sessions");
const mockingController = require("../mocking/mocking.controller");
const loggerTestController = require("../logger/logger.controller");

const router = (app) => {
  app.use("/carts", cartsController);
  app.use("/products", productsController);
  app.use("/messages", messagesController);
  app.use("/", viewsTemplateController);
  app.use("/users", usersController);
  app.use("/auth", authController);
  app.use("/sessions", sessionsController);
  app.use("/mockingproducts", mockingController);
  app.use("/loggertest", loggerTestController);
};

module.exports = router;
