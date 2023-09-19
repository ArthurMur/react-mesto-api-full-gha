/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
import express from 'express';
import { connect } from 'mongoose';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { json, urlencoded } from 'body-parser';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import cors from 'cors';
import userRouter from './routes/users';
import cardRouter from './routes/cards';
import signinRouter from './routes/signin';
import signupRouter from './routes/signup';
import errorHandler from './middlewares/error-handler';
import NotFoundError from './errors/notFoundError';

import { requestLogger, errorLogger } from './middlewares/logger'; // логгеры

const { PORT = 3000, BASE_PATH = 'localhost' } = process.env;

const app = express();

app.use(cors());

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: 'draft-7', // draft-6: RateLimit-* headers; draft-7: combined RateLimit header
  legacyHeaders: false, // X-RateLimit-* headers
  // store: ... , // Use an external store for more precise rate limiting
});

app.use(limiter);

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

// подключаемся к серверу mongo
connect('mongodb://127.0.0.1:27017/mestodb')
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
