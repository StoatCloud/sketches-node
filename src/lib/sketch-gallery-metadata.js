/**
 * Gallery taxonomy aligned with Radiant (https://github.com/pbakaus/radiant):
 * tags use the same vocabulary as Radiant's ShaderTag: fill | object | particles |
 * physics | noise | organic | geometric.
 *
 * runtimeTier groups sketches for VM / CI browsers vs. full GPU workstations.
 */

const RADIANT_TAGS = [
  'fill',
  'object',
  'particles',
  'physics',
  'noise',
  'organic',
  'geometric'
];

/** @type {Record<string, string[]>} */
const TAGS_BY_ID = {
  'kelvin-wake': ['geometric', 'physics', 'fill'],
  anthyphaeresis: ['geometric', 'object'],
  kuramoto: ['physics', 'organic', 'fill'],
  caustics: ['organic', 'geometric', 'fill'],
  'joukowsky-airfoil': ['geometric', 'physics', 'fill'],
  'quasiinfinite-zoom': ['noise', 'geometric', 'fill'],
  'cubic-roots': ['geometric', 'object'],
  'calabi-yau': ['geometric', 'organic', 'object'],
  'lawsons-klein-bottle': ['geometric', 'object'],
  'boys-surface': ['geometric', 'object'],
  'clifford-torus': ['geometric', 'object'],
  'webcam-kmeans': ['particles', 'organic', 'fill'],
  moire: ['noise', 'geometric', 'fill'],
  ikeda: ['geometric', 'physics', 'noise'],
  'hertzsprung-russell': ['object', 'fill'],
  mandelbrot: ['geometric', 'noise', 'fill'],
  pulsar: ['noise', 'fill'],
  'multiscale-turing-patterns': ['organic', 'noise', 'fill'],
  magnet: ['physics', 'geometric', 'fill'],
  'potential-flow': ['physics', 'noise', 'fill'],
  'ueda-attractor': ['physics', 'geometric'],
  'path-integral-diffraction': ['physics', 'geometric', 'fill'],
  'fibonacci-sphere': ['geometric', 'object'],
  'gray-scott-reaction-diffusion': ['organic', 'physics', 'fill'],
  'rule-30': ['geometric', 'fill'],
  'line-integral-convolution': ['geometric', 'physics', 'fill'],
  'iterative-closest-point': ['geometric', 'particles'],
  'spherical-harmonics': ['geometric', 'object'],
  'domain-coloring-with-scaling': ['geometric', 'noise', 'fill'],
  'flamms-paraboloid': ['geometric', 'physics', 'object'],
  'continuum-gravity': ['physics', 'particles', 'fill'],
  'kuramoto-sivashinsky': ['physics', 'organic', 'fill'],
  'karman-trefftz-airfoil': ['geometric', 'physics', 'fill'],
  'periodic-three-body-orbits': ['physics', 'geometric'],
  'three-body-stable-periodic-orbits': ['physics', 'geometric'],
  'hydrodynamic-instabilities': ['physics', 'organic', 'fill'],
  'strange-attractors': ['particles', 'physics', 'geometric'],
  'schwarzschild-spacetime': ['physics', 'geometric', 'fill'],
  'random-polynomial-roots': ['geometric', 'noise', 'fill'],
  'umbilic-torus': ['geometric', 'object'],
  'lamb-wave-dispersion': ['geometric', 'physics', 'fill'],
  'fluid-simulation': ['physics', 'organic', 'fill'],
  erosion: ['organic', 'physics', 'geometric'],
  'centripetal-b-splines': ['geometric', 'object'],
  'smooth-life': ['organic', 'physics', 'fill'],
  'logistic-map': ['geometric', 'physics', 'noise'],
  'nose-hoover-attractor': ['physics', 'geometric'],
  'vortex-sdf': ['geometric', 'organic', 'object'],
  'k-means': ['particles', 'geometric'],
  'double-pendulum': ['physics', 'geometric']
};

/**
 * WebGL sketches that are still reasonable in a low-power / software WebGL context.
 * Everything else with technique webgl is treated as gpu-recommended.
 */
const VM_FRIENDLY_WEBGL_IDS = new Set([
  'rule-30',
  'moire',
  'pulsar',
  'ikeda',
  'hertzsprung-russell',
  'magnet',
  'random-polynomial-roots',
  'kelvin-wake',
  'fibonacci-sphere',
  'centripetal-b-splines',
  'lamb-wave-dispersion',
  'ueda-attractor',
  'cubic-roots',
  'mandelbrot'
]);

const TAG_LABELS = {
  fill: 'Full canvas',
  object: 'Standalone',
  particles: 'Particles',
  physics: 'Physics',
  noise: 'Noise',
  organic: 'Organic',
  geometric: 'Geometric'
};

const TECHNIQUE_LABELS = {
  webgl: 'WebGL',
  'canvas-2d': 'Canvas 2D'
};

function validateTags (id, tags) {
  for (const t of tags) {
    if (!RADIANT_TAGS.includes(t)) {
      throw new Error(`Invalid Radiant tag "${t}" for project "${id}"`);
    }
  }
}

module.exports = {
  RADIANT_TAGS,
  TAGS_BY_ID,
  VM_FRIENDLY_WEBGL_IDS,
  TAG_LABELS,
  TECHNIQUE_LABELS,
  validateTags
};
