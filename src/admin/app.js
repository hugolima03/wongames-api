import White from "./extensions/Logo.svg";
import Joystick from "./extensions/Joystick.svg";

export default {
  config: {
    locales: [
      // 'ar',
      // 'fr',
      // 'cs',
      // 'de',
      // 'dk',
      // 'es',
      // 'he',
      // 'id',
      // 'it',
      // 'ja',
      // 'ko',
      // 'ms',
      // 'nl',
      // 'no',
      // 'pl',
      // 'pt-BR',
      // 'pt',
      // 'ru',
      // 'sk',
      // 'sv',
      // 'th',
      // 'tr',
      // 'uk',
      // 'vi',
      // 'zh-Hans',
      // 'zh',
    ],
    auth: {
      logo: White,
    },
    head: {
      favicon: Joystick,
    },
    menu: {
      logo: Joystick,
    },
    tutorials: false,
  },
  bootstrap(app) {
    console.log(app);
  },
};
