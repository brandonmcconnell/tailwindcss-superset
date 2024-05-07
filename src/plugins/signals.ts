import plugin from 'tailwindcss/plugin.js';
import { EMPTY_VALUES } from '../common.js';

const getStyleVarName = (modifier: string | null) => `--tw-signal${modifier ? `_${modifier}` : ''}`;

export const signals = plugin(({ matchUtilities, matchVariant }) => {
  matchUtilities(
    {
      signal: (_, { modifier }) => {
        return {
          [getStyleVarName(modifier)]: 'true',
        };
      },
    },
    {
      ...EMPTY_VALUES,
      modifiers: 'any',
    }
  );

  matchVariant(
    'signal',
    (_, { modifier }) => {
      return `@container style(${getStyleVarName(modifier)}: true)`;
    },
    EMPTY_VALUES
  );
});
