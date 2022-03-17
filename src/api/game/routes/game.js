"use strict";

/**
 * game router.
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

// module.exports = createCoreRouter("api::game.game");
module.exports = {
  routes: [
    {
      method: "GET",
      path: "/games",
      handler: "game.find",
    },
    {
      method: "POST",
      path: "/games/populate",
      handler: "game.populate",
    },
  ],
};
