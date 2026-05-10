#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const browserify = require('browserify');
const brfs = require('brfs');
const {
  TAGS_BY_ID,
  VM_FRIENDLY_WEBGL_IDS,
  validateTags
} = require('../lib/sketch-gallery-metadata');

const projectsRoot = path.join(__dirname, '..', 'src');
const ignorePattern = /(\.DS_Store|sketches|projects|about|books)/;
const projectDirListing = fs.readdirSync(projectsRoot).filter(path => !ignorePattern.test(path));

const projectsSrcPath = path.join(projectsRoot, 'sketches');
const thumbnailsPath = path.join(projectsSrcPath, 'static');

function inferTechnique (projectRoot) {
  const indexPath = path.join(projectRoot, 'index.js');
  if (!fs.existsSync(indexPath)) return 'canvas-2d';
  const src = fs.readFileSync(indexPath, 'utf8');
  if (/require\(\s*['"]regl|from\s+['"]regl['"]/.test(src)) return 'webgl';
  if (/getContext\s*\(\s*['"]webgl/.test(src)) return 'webgl';
  return 'canvas-2d';
}

function computeRuntimeTier (id, technique, meta) {
  if (meta.runtimeTier === 'vm-friendly' || meta.runtimeTier === 'gpu-recommended') {
    return meta.runtimeTier;
  }
  if (id === 'webcam-kmeans') return 'gpu-recommended';
  if (technique === 'canvas-2d') return 'vm-friendly';
  if (technique === 'webgl' && VM_FRIENDLY_WEBGL_IDS.has(id)) return 'vm-friendly';
  if (technique === 'webgl') return 'gpu-recommended';
  return 'vm-friendly';
}

var projects = [];

projectDirListing.map(function (projectPath) {
  const projectRoot = path.join(projectsRoot, projectPath);
  var metaPath = path.join(projectRoot, 'metadata.json');

  if (!fs.existsSync(metaPath)) {
    return;
  } else {
    process.stderr.write('Processing project in "' + projectPath + '"\n');
  }

  var thumbnailFilename = fs.readdirSync(projectRoot).filter(filename => {
    return /^thumbnail\.(png|gif|jpe?g$)/i.test(filename);
  })[0];

  var meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  var technique = meta.technique || inferTechnique(projectRoot);
  var tags = Array.isArray(meta.tags) && meta.tags.length
    ? meta.tags
    : (TAGS_BY_ID[projectPath] || []);
  validateTags(projectPath, tags);

  var projectMetadata = {
    id: projectPath,
    path: projectPath + '/',
    title: meta.title,
    order: meta.order,
    description: meta.description || meta.title,
    technique: technique,
    runtimeTier: computeRuntimeTier(projectPath, technique, meta),
    tags: tags
  };

  if (thumbnailFilename) {
    const thumbnailPath = path.join(projectRoot, thumbnailFilename);
    const thumbnailOutputFilename = projectPath + '-' + thumbnailFilename;
    const thumbnailOutputPath = path.join(thumbnailsPath, thumbnailOutputFilename);
    fs.createReadStream(thumbnailPath).pipe(fs.createWriteStream(thumbnailOutputPath));
    projectMetadata.thumbnailPath = path.join('sketches', 'static', thumbnailOutputFilename);
  }

  projects.push(projectMetadata);
});

projects = projects.sort(function (a, b) {
  return b.order - a.order;
});

process.stdout.write(JSON.stringify(projects));

function buildNav () {
  browserify('lib/nav.js')
    .transform(brfs)
    .bundle()
    .pipe(fs.createWriteStream(path.join(__dirname, '../../nav.bundle.js')));
}

buildNav();
