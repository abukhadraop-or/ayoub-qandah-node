// eslint-disable-next-line camelcase
const { user, article, tag, article_tag, comment } = require("../../models");

async function addArticle(req, res) {
  try {
    const {
      slug,
      title,
      description,
      body,
      // eslint-disable-next-line camelcase
      tag_list,
      favorited,
      // eslint-disable-next-line camelcase
      favorites_count,
      userId,
    } = req.body;
    const userData = await user.findOne({ where: { uuid: userId } });
    const createArticle = await article.create({
      slug,
      title,
      description,
      body,
      tag_list,
      favorited,
      favorites_count,
      userId: userData.id,
    });
    // eslint-disable-next-line no-plusplus
    for (let x = 0; x < tag_list.length; x++) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await tag.create({ tags: tag_list[x] });
        // eslint-disable-next-line no-empty
      } catch (e) {}

      try {
        console.log("testtt ARticleee");
        // eslint-disable-next-line no-await-in-loop
        const Tag = await tag.findOne({ where: { tags: tag_list[x] } });
        // eslint-disable-next-line no-await-in-loop
        await article_tag.create({
          articleId: createArticle.id,
          tagId: Tag.id,
        });
      } catch (e) {
        res.json(e);
      }
    }
    res.status(200).json({ code: 200, data: createArticle });
  } catch (e) {
    res.json(e);
  }
}

async function allArticles(req, res) {
  try {
    const allPosts = await article.findAndCountAll({
      include: [
        { model: user, as: "user" },
        { model: comment, include: [{ model: user, as: "user" }] },
      ],
    });
    res.status(200).json({ code: 200, data: allPosts });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
}

async function singleArticle(req, res) {
  try {
    const { uuid } = req.params;
    const Article = await article.findOne({
      where: { uuid },
      include: [
        { model: user, as: "user" },
        { model: tag },
        { mode: comment, include: [{ model: user, as: "user" }] },
      ],
    });
    res.status(200).json({ code: 200, data: Article });
  } catch (e) {
    console.log(e);

    res.json(e);
  }
}

async function updateArticle(req, res) {
  try {
    // eslint-disable-next-line camelcase
    const { slug, title, description, body, tag_list, uuid } = req.body;
    await article.update(
      { slug, title, description, body, tag_list },
      { where: { uuid } }
    );
    const Article = await article.findOne({ where: { uuid } });
    await article_tag.destroy({ where: { articleId: Article.id } });
    for (let x = 0; x < tag_list.length; x += 1) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await tag.create({ tags: tag_list[x] });
      } catch (e) {
        return undefined;
      }
      try {
        // eslint-disable-next-line no-await-in-loop
        const Tag = await tag.findOne({ where: { tags: tag_list[x] } });
        // eslint-disable-next-line no-await-in-loop
        await article_tag.create({
          articleId: Article.id,
          tagId: Tag.id,
        });
      } catch (e) {
        res.json(e);
      }
    }
    res.status(200).json({ code: 200, data: Article });
  } catch (e) {
    console.log(e);
    res.json(e);
  }
  throw new Error();
}

async function deleteArticle(req, res) {
  const { uuid } = req.body;
  await article.destroy({ where: { uuid } });
  res.status(200).json({ code: 200, msg: "Article Deleted !" });
}
module.exports = {
  addArticle,
  allArticles,
  singleArticle,
  updateArticle,
  deleteArticle,
};
