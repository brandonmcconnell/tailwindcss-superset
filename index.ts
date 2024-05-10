import { defaultShades } from './src/plugins/default-shades.js';
import { directionalShadows } from './src/plugins/directional-shadows.js';
import { js } from './src/plugins/js.js';
import { lerpColors } from './src/plugins/lerp-colors.js';
import { members } from './src/plugins/members.js';
import { mixins } from './src/plugins/mixins.js';
import { multi } from './src/plugins/multi.js';
import { selectorPatterns } from './src/plugins/selector-patterns.js';
import { signals } from './src/plugins/signals.js';

import type { TurbinePlugin } from 'tailwind-turbine';
import * as Turbine from 'tailwind-turbine';

type DefaultShadesOptions = Parameters<typeof defaultShades>[1];
type JsOptions = Parameters<typeof js>[0];
type LerpColorsOptions = NonNullable<Parameters<typeof lerpColors>[1]>;

interface SupersetOptions {
  defaultShades?: boolean | DefaultShadesOptions;
  js?: boolean | JsOptions;
  lerpColors?: boolean | LerpColorsOptions;
  directionalShadows?: boolean;
  members?: boolean;
  mixins?: boolean;
  multi?: boolean;
  selectorPatterns?: boolean;
  signals?: boolean;
}

const defaultSupersetOptions: SupersetOptions = {
  defaultShades: true,
  js: true,
  lerpColors: true,
  directionalShadows: true,
  members: true,
  mixins: true,
  multi: true,
  selectorPatterns: true,
  signals: true,
};

const superset: TurbinePlugin = (supersetOptions: SupersetOptions = {}) => {
  const options = {
    ...defaultSupersetOptions,
    ...supersetOptions,
  };
  return {
    transform: (config) => {
      const { defaultShades: defaultShadesOptions, lerpColors: lerpColorsOptions } = options;
      if (lerpColorsOptions) {
        Turbine.extend(config.theme, (theme, isExtend) => {
          const baseOptions = typeof lerpColorsOptions === 'boolean' ? {} : lerpColorsOptions;
          const extendOptions = isExtend ? { includeBase: false, includeLegacy: false } : {};
          const options = { ...baseOptions, ...extendOptions };
          theme.colors = Turbine.resolve(theme.colors, (themeColors) =>
            lerpColors(themeColors, lerpColorsOptions === true ? undefined : options)
          );
        });
      }
      if (defaultShadesOptions) {
        Turbine.extend(config.theme, (theme) => {
          theme.colors = Turbine.resolve(theme.colors, (themeColors) =>
            defaultShades(themeColors, defaultShadesOptions === true ? undefined : defaultShadesOptions)
          );
        });
      }
      return config;
    },
    plugins: [
      ...(options.directionalShadows ? [directionalShadows] : []),
      ...(options.js ? [js(options.js === true ? {} : options.js)] : []),
      ...(options.members ? [members] : []),
      ...(options.mixins ? [mixins] : []),
      ...(options.multi ? [multi] : []),
      ...(options.selectorPatterns ? [selectorPatterns] : []),
      ...(options.signals ? [signals] : []),
    ],
  };
};

export {
  defaultShades,
  directionalShadows,
  js,
  lerpColors,
  members,
  mixins,
  multi,
  selectorPatterns,
  signals,
  superset,
};
