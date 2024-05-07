import plugin from 'tailwindcss/plugin.js';
import { EMPTY_VALUES } from '../common.js';

export const mixins = plugin(({ matchVariant }) => {
  matchVariant('mixin', (_, { modifier }) => `& .mixin${modifier ? `\\/${modifier}` : ''} { & }`, EMPTY_VALUES);
});
