const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');

const { connectDB } = require('./db/dbconnection.js');
const AppError = require('./src/utils/AppError');
const globalErrorHandler = require('./src/middleware/errorMiddleware');
const logger = require('./src/utils/logger');

// Load environment variables
dotenv.config();

const app = express();

// 1. GLOBAL MIDDLEWARES

// Security HTTP headers
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 20000, // Further increased to eliminate 429 errors during load tests
  windowMs: 15 * 60 * 1000,
  message: 'Too many requests from this IP, please try again later'
});
app.use('/health', (req, res, next) => next()); // Skip limiting for health checks
app.use('/api', limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
  whitelist: [] // Add parameters to whitelist if needed
}));

// Compression
app.use(compression());

// CORS configuration
const allowedOrigins = [
  'rizeworldinstitute.vercel.app',
  'referralinstitue.vercel.app',
  'https://instituterizworld-git-main-rizeworld.vercel.app',
  'https://instituterizworld.vercel.app',
  'https://adminrizeworldinstitute.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));
// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Server is healthy' });
});

// 2. ROUTES

app.use("/", require("./src/routes/adminvalidation.js"));
app.use("/", require("./src/routes/addStudent.js"));
app.use("/", require("./src/routes/addtechers.js"));
app.use("/", require("./src/routes/admin_dashbord.js"));
app.use("/", require("./src/routes/studentValidation.js"));
app.use("/", require("./src/routes/studentdataGet.js"));
app.use("/", require("./src/routes/refferel/reffereValidation.js"));
app.use("/", require("./src/routes/refferel/refferelDashboard.js"));
app.use("/", require("./src/routes/inquiry.js"));
app.use("/", require("./src/routes/certificate.js"));

// Handle unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handling Middleware
app.use(globalErrorHandler);

// Setup view engine
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

// 3. START SERVER
connectDB();

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, '0.0.0.0', 2048, () => {
  logger.info(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Increase keep-alive timeout for high-concurrency
server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    logger.info('💥 Process terminated!');
  });
});
