import plugin from 'tailwindcss/plugin.js';

export const multi = plugin(({ matchUtilities }) => {
  matchUtilities({
    multi: (value) => {
      if (!value[0]) return {};
      const validQuotes = [`'`, `"`, `\``];
      const ends = [value[0], value.slice(-1)[0]];
      const valueIsQuoted = validQuotes.includes(value[0]);
      if (valueIsQuoted && (value.length < 3 || ends[0] !== ends[1])) {
        throw new Error(
          `Invalid multi value: \`${value}\`. Quoted values must use matching quotes (e.g. ['...'], ["..."], or [\`...\`]).`
        );
      }
      const escape = (str: string) => str.replace(/_/g, '\\_').replace(/ /g, '_');
      const delimiter = /;(?![^[]*\])/;
      const utilities = value
        .slice(...(valueIsQuoted ? [1, -1] : []))
        .split(delimiter)
        .filter((str) => str.trim().length)
        .map(escape)
        .join(' ');
      return !utilities.trim()
        ? {}
        : {
            [`@apply ${utilities}`]: {},
          };
    },
  });
});
