"use strict";

/**
 *  game controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::game.game", ({ strapi }) => ({
  async populate(ctx) {
    try {
      console.log("Starting to populate...");

      await strapi.service("api::game.game").populate();

      ctx.send("Finished populating!");
    } catch (err) {
      ctx.body = err;
    }
  },
}));
