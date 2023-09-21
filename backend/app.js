/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const signinRouter = require('./routes/signin');
const signupRouter = require('./routes/signup');
const errorHandler = require('./middlewares/error-handler');
const NotFoundError = require('./errors/notFoundError');

const { requestLogger, errorLogger } = require('./middlewares/logger'); // логгеры

const { PORT = 3000, BASE_PATH = 'localhost' } = process.env;

const app = express();

const whitelist = [ // список разрешенных доменов
  'http://api.domainname.students.nomoredomainsrocks.ru',
  'https://api.domainname.students.nomoredomainsrocks.ru',
  'http://mestechko.students.nomoredomainsicu.ru',
  'https://mestechko.students.nomoredomainsicu.ru',
  'https://localhost:3000',
  'http://localhost:3000',
  'https://praktikum.tk',
  'http://praktikum.tk',
];

const corsOptions = {
  origin: whitelist, // источник домена (откуда запрос)
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // методы
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization', // заголовок Authorization
  credentials: true, // обмен учетными данными (cookies)
};

app.use(cors(corsOptions)); // доступ для других доменов

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: 'draft-7', // draft-6: RateLimit-* headers; draft-7: combined RateLimit header
  legacyHeaders: false, // X-RateLimit-* headers
  // store: ... , // Use an external store for more precise rate limiting
});

app.use(limiter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => console.log('База данных подключена.'))
  .catch((err) => console.log('DB error', err));

// логгер запросов
app.use(requestLogger);

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('/signup', signupRouter);
app.use('/signin', signinRouter);

app.use((req, res, next) => {
  next(new NotFoundError('Путь не найден'));
});

// логгер ошибок
app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Сервер подключен — http://${BASE_PATH}:${PORT}`);
});
