const cors = require('cors');
const morgan = require('morgan');
const app = require('express')();
const tagRoute = require('./routes/tag');
const userRoute = require('./routes/user');
const articleRoute = require('./routes/article');
const commentRoute = require('./routes/comment');
const { NotFound, errorHandler } = require('./middleware/error-handler');
const response = require('./utils/response');

app.use(cors());

app.use(morgan('dev'));
app.use(require('express').json());

/**
 * All app routes.
 * Run authentication to specific routes.
 */
app.use('/api/user', userRoute);
app.use('/api/tags', tagRoute);
app.use('/api/articles', articleRoute);
app.use('/api/comments', commentRoute);

/**
 * Not Found Error & Internal Error.
 */
app.use('*', (req, res, next) => {
  throw new NotFound();
});

app.use(errorHandler);

module.exports = {
  start: (port) => {
    if (port) {
      app.listen(port, () => {
        console.log('Heard From', port);
      });
    } else {
      console.log('Missing port.');
    }
  },
  app,
};
