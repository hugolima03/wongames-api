"use strict";

/**
 * game service.
 */

const { createCoreService } = require("@strapi/strapi").factories;

const axios = require("axios");
const slugify = require("slugify");

async function getGameInfo(slug) {
  const jsdom = require("jsdom");
  const { JSDOM } = jsdom;
  const body = await axios.get(`https://www.gog.com/en/game/${slug}`);
  const dom = new JSDOM(body.data);

  const description = dom.window.document.querySelector(".description");

  return {
    rating: "BR0",
    short_description: description.textContent
      .replaceAll("\n", "")
      .replace(/ +(?= )/g, "")
      .trim()
      .slice(0, 160),
    description: description.innerHTML
      .replaceAll("\n", "")
      .replace(/ +(?= )/g, "")
      .trim(),
  };
}

async function getByName(name, entityName) {
  const item = await strapi.entityService.findMany(
    `api::${entityName}.${entityName}`,
    {
      filters: {
        $and: [{ name: name }],
      },
    }
  );

  return item[0] || null;
}

async function create(name, entityName) {
  const item = await getByName(name, entityName);
  if (!item) {
    return await strapi.entityService.create(
      `api::${entityName}.${entityName}`,
      {
        data: {
          name: name,
          slug: slugify(name, { lower: true }),
        },
      }
    );
  }
}

async function createManyToManyData(products) {
  const developers = {};
  const publishers = {};
  const categories = {};
  const platforms = {};

  products.forEach((product) => {
    const { developer, publisher, genres, supportedOperatingSystems } = product;

    genres &&
      genres.forEach((item) => {
        categories[item] = true;
      });
    supportedOperatingSystems &&
      supportedOperatingSystems.forEach((item) => {
        platforms[item] = true;
      });
    developers[developer] = true;
    publishers[publisher] = true;
  });

  return Promise.all([
    ...Object.keys(developers).map((name) => create(name, "developer")),
    ...Object.keys(publishers).map((name) => create(name, "publisher")),
    ...Object.keys(categories).map((name) => create(name, "category")),
    ...Object.keys(platforms).map((name) => create(name, "platform")),
  ]);
}

module.exports = createCoreService("api::game.game", ({ strapi }) => ({
  async populate(...args) {
    const gogApiUrl = `https://www.gog.com/games/ajax/filtered?mediaType=game&page=1&sort=popularity`;
    const {
      data: { products },
    } = await axios.get(gogApiUrl);

    await createManyToManyData(products);
  },
}));
