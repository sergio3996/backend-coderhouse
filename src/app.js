import express from "express";
import handlebars from "express-handlebars";
import apiUsersRouter from "./routes/api/user.router.js";
import apiAuthRouter from "./routes/api/auth.router.js";
import apiCartRouter from "./routes/api/cart.router.js";
import apiProductRouter from "./routes/api/product.router.js";
import apiEmailRouter from "./routes/api/email.router.js";
import viewsRouter from "./routes/views/views.router.js";
import loggerTest from "./routes/loggerTest.router.js";
import { __dirname } from "./utils/utils.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import cookieParser from "cookie-parser";
import errorHandlerMiddleware from "./middlewares/error-handler.middleware.js";
import { addLogger } from "./config/logger.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();

app.use(addLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/.." + "/public"));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/.." + "/views");
app.set("view engine", "handlebars");

app.use(cookieParser());

const swaggerOpts = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Coder House",
      description: "BackEnd Curso CoderHouse, Ecommerce",
    },
  },
  apis: [__dirname + "/.." + "/docs/**/*.yaml"],
};
const specs = swaggerJSDoc(swaggerOpts);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

initializePassport();
app.use(passport.initialize());

app.use("/api/users", apiUsersRouter);
app.use("/api/auth", apiAuthRouter);
app.use("/api/carts", apiCartRouter);
app.use("/api/products", apiProductRouter);
app.use("/api/email", apiEmailRouter);
app.use("/", viewsRouter);
app.use("/loggerTest", loggerTest);

app.use(errorHandlerMiddleware);

export default app;
