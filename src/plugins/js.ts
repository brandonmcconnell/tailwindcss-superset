import plugin from 'tailwindcss/plugin.js';

type Options = Record<string, any>;

export const js = plugin.withOptions<Options>(function (options: Options = {}) {
  return function ({ matchUtilities, theme, config }) {
    const context = {
      theme,
      config,
      ...(options ?? {}),
    };
    matchUtilities({
      js: (value) => {
        const escape = (str: string) => {
          return str.replace(/_/g, '\\_').replace(/ /g, '_');
        };

        const unescape = (str: string) => {
          return str.replace(/(?<!\\)_/g, ' ').replace(/\\_/g, '_');
        };

        const parseString = (str: string) => {
          return str.split(/(#{.*?})/g).map((el, i) => (i % 2 === 1 ? el.slice(2, -1) : el));
        };

        const parts = parseString(escape(value.slice(1, -1)));

        const utility = parts
          .map((part, i) => {
            if (i % 2 === 0) {
              return part;
            } else {
              const args = Object.keys(context);
              const values = Object.values(context);
              const func = new Function(...args, `return ${unescape(part)};`);
              return escape(`${func(...values)}`);
            }
          })
          .join('');

        return {
          [`@apply ${utility}`]: {},
        };
      },
    });
  };
});
