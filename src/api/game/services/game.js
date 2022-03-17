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

module.exports = createCoreService("api::game.game", ({ strapi }) => ({
  async populate(...args) {
    const gogApiUrl = `https://www.gog.com/games/ajax/filtered?mediaType=game&page=1&sort=popularity`;
    const {
      data: { products },
    } = await axios.get(gogApiUrl);

    console.log(products[1].publisher, products[1].developer);
    await create(products[1].publisher, "publisher");
    await create(products[1].developer, "developer");
  },
}));
