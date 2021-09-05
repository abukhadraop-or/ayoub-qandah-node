const request = require('supertest');

jest.mock('../../services/tag', () => ({
  allTags: jest.fn().mockReturnValue({ user: 'Ayoub' }),
  tagsWithArticles: jest.fn(),
  includesTag: jest.fn(),
}));

jest.mock('../../services/user', () => ({
  createUser: jest.fn().mockReturnValue({ user: 'Ayoub' }),
  getUser: jest.fn(),
  userArticles: jest.fn(),
  updateUser: jest.fn(),
}));

jest.mock('../../middleware/bearer', () =>
  jest.fn().mockImplementation((req, res, next) => {
    req.user = { username: 'Ayoub', id: '1', email: 'ayoub@gmail.com' };
    next();
  })
);

jest.mock('../../services/article', () => ({
  addArticle: jest.fn().mockReturnValue({ user: 'Ayoub' }),
  allArticles: jest.fn(),
  singleArticle: jest.fn(),
  updateArticle: jest.fn(),
  removeArticle: jest.fn(),
}));

// jest.mock('../../services/article-comment', () => ({
//   removeArticleComment: jest.fn().mockReturnValue({ user: 'Ayoub' }),
//   addArticleComment: jest.fn(),
// }));

jest.mock('../../services/article-tag', () => ({
  articleTag: jest.fn().mockReturnValue({ user: 'Ayoub' }),
  removeArticleTag: jest.fn(),
}));

jest.mock('../../services/comment', () => ({
  addComment: jest.fn().mockReturnValue({ user: 'Ayoub' }),
  allComments: jest.fn(),
  updateComment: jest.fn().mockReturnValue({ user: 'Ayoub' }),
  singleComment: jest.fn(),
  removeComment: jest.fn(),
}));

const { app } = require('../../server');
const { allArticles, addArticle } = require('../../services/article');
const authMiddleware = require('../../middleware/bearer');
const { includesTag } = require('../../services/tag');

describe('Article controller test.', () => {
  test('Get articles.', async () => {
    allArticles.mockReturnValue({ Articles: true });
    const res = await request(app).get('/api/articles');
    expect(allArticles).toHaveBeenCalled();
    expect(res.body.data.Articles).toBeTruthy();
  });
  test('Post article ', async () => {
    const articleObj = {
      title: 'testing',
      description: 'testing',
      body: 'testing',
      tagList: ['tag1', 'tag2'],
    };
    addArticle.mockReturnValue({
      id: 1,
      title: 'title test',
      description: 'description test',
      body: 'body test',
    });

    allArticles.mockReturnValue({ Articles: true });
    includesTag.mockReturnValue([
      { id: 1, name: 'tag1' },
      { id: 2, name: 'tag2' },
    ]);

    const res = await request(app).post('/api/article').send(articleObj);
    expect(includesTag).toHaveBeenCalled();
    expect(res.body.data.title).toEqual('title test');
    expect(res.body.data.description).toEqual('description test');
    expect(res.body.data.body).toEqual('body test');
  });
});
