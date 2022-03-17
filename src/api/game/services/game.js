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

module.exports = createCoreService("api::game.game", ({ strapi }) => ({
  async populate(...args) {
    const gogApiUrl = `https://www.gog.com/games/ajax/filtered?mediaType=game&page=1&sort=popularity`;
    const {
      data: { products },
    } = await axios.get(gogApiUrl);

    const publisher = {
      name: products[0].publisher,
      slug: slugify(products[0].publisher).toLowerCase(),
    };

    const developer = {
      name: products[0].developer,
      slug: slugify(products[0].developer).toLowerCase(),
    };

    await strapi.entityService.create("api::publisher.publisher", {
      data: publisher,
    });

    await strapi.entityService.create("api::developer.developer", {
      data: developer,
    });
  },
}));
