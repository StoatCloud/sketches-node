/**
 * Iframe previews of Radiant shaders (radiant/static/*.html) with the same tag
 * vocabulary as the main sketch gallery and optional CSS filter color schemes
 * (see radiant/src/lib/color-schemes.ts).
 */
const React = require('react');
const shaders = require('../../src/sketches/radiant-shaders.json');
const { TAG_LABELS, TECHNIQUE_LABELS } = require('../sketch-gallery-metadata');
const { colorSchemes } = require('../radiant-color-schemes');

function pathPrefix () {
  if (typeof window === 'undefined') return 'radiant/static/';
  const p = window.location.pathname || '';
  return /\/sketches\/?/.test(p) ? '../radiant/static/' : 'radiant/static/';
}

function schemeById (id) {
  return colorSchemes.find(function (s) {
    return s.id === id;
  }) || colorSchemes[0];
}

const SORT_ORDER = 'order';
const SORT_TITLE = 'title';

class RadiantShaderGallery extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      sortBy: SORT_ORDER,
      filterTechnique: 'all',
      filterTag: 'all',
      schemeId: 'amber',
      colorMode: 'global',
      pathBase: pathPrefix()
    };
    this.setSortBy = this.setSortBy.bind(this);
    this.setFilterTechnique = this.setFilterTechnique.bind(this);
    this.setFilterTag = this.setFilterTag.bind(this);
    this.setSchemeId = this.setSchemeId.bind(this);
    this.setColorMode = this.setColorMode.bind(this);
  }

  componentDidMount () {
    var next = pathPrefix();
    if (next !== this.state.pathBase) {
      this.setState({ pathBase: next });
    }
  }

  setSortBy (sortBy) {
    this.setState({ sortBy });
  }

  setFilterTechnique (filterTechnique) {
    this.setState({ filterTechnique });
  }

  setFilterTag (filterTag) {
    this.setState({ filterTag });
  }

  setSchemeId (schemeId) {
    this.setState({ schemeId });
  }

  setColorMode (colorMode) {
    this.setState({ colorMode });
  }

  allTags () {
    var seen = Object.create(null);
    shaders.forEach(function (s) {
      (s.tags || []).forEach(function (t) {
        seen[t] = true;
      });
    });
    return Object.keys(seen).sort();
  }

  filterShaders (list) {
    var technique = this.state.filterTechnique;
    var tag = this.state.filterTag;
    return list.filter(function (s) {
      if (technique !== 'all' && s.technique !== technique) return false;
      if (tag !== 'all' && !(s.tags || []).includes(tag)) return false;
      return true;
    });
  }

  sortShaders (list) {
    var copy = list.slice();
    if (this.state.sortBy === SORT_TITLE) {
      copy.sort(function (a, b) {
        return a.title.localeCompare(b.title);
      });
      return copy;
    }
    return copy;
  }

  filterForShader (shader) {
    if (this.state.colorMode === 'per-shader') {
      var sid = shader.defaultScheme || 'amber';
      return schemeById(sid).filter;
    }
    return schemeById(this.state.schemeId).filter;
  }

  renderCard (shader) {
    var src = this.state.pathBase + shader.file;
    var filter = this.filterForShader(shader);
    return (
      <article className="radiant-card" key={shader.id}>
        <a
          className="radiant-card__title-link"
          href={src}
          target="_blank"
          rel="noopener noreferrer"
        >
          {shader.title}
        </a>
        <p className="radiant-card__desc">{shader.desc}</p>
        <div className="radiant-card__meta">
          <span className={'radiant-card__badge radiant-card__badge--' + shader.technique}>
            {TECHNIQUE_LABELS[shader.technique] || shader.technique}
          </span>
          {(shader.tags || []).map(function (t) {
            return (
              <span key={t} className="radiant-card__tag">{TAG_LABELS[t] || t}</span>
            );
          })}
          {shader.defaultScheme ? (
            <span className="radiant-card__hint" title="Suggested palette in Radiant">
              Suggested: {schemeById(shader.defaultScheme).name}
            </span>
          ) : null}
        </div>
        <div
          className="radiant-card__frame"
          style={{ filter: filter }}
        >
          <iframe
            className="radiant-card__iframe"
            src={src}
            title={shader.title}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </article>
    );
  }

  render () {
    var filtered = this.filterShaders(shaders);
    var sorted = this.sortShaders(filtered);
    var vmList = sorted.filter(function (s) {
      return s.technique === 'canvas-2d';
    });
    var gpuList = sorted.filter(function (s) {
      return s.technique === 'webgl';
    });
    var tags = this.allTags();

    return (
      <div className="radiant-gallery">
        <div className="radiant-gallery__toolbar sketch-gallery__toolbar" role="toolbar" aria-label="Filter Radiant shaders">
          <div className="sketch-gallery__tool-group">
            <span className="sketch-gallery__label">Sort</span>
            <button
              type="button"
              className={'sketch-gallery__chip' + (this.state.sortBy === SORT_ORDER ? ' is-active' : '')}
              onClick={() => this.setSortBy(SORT_ORDER)}
            >
              Pack order
            </button>
            <button
              type="button"
              className={'sketch-gallery__chip' + (this.state.sortBy === SORT_TITLE ? ' is-active' : '')}
              onClick={() => this.setSortBy(SORT_TITLE)}
            >
              Title A–Z
            </button>
          </div>
          <div className="sketch-gallery__tool-group">
            <span className="sketch-gallery__label">Technique</span>
            {['all', 'canvas-2d', 'webgl'].map(key => (
              <button
                key={key}
                type="button"
                className={'sketch-gallery__chip' + (this.state.filterTechnique === key ? ' is-active' : '')}
                onClick={() => this.setFilterTechnique(key)}
              >
                {key === 'all' ? 'All' : TECHNIQUE_LABELS[key]}
              </button>
            ))}
          </div>
          <div className="sketch-gallery__tool-group sketch-gallery__tool-group--tags">
            <span className="sketch-gallery__label">Style</span>
            <button
              type="button"
              className={'sketch-gallery__chip' + (this.state.filterTag === 'all' ? ' is-active' : '')}
              onClick={() => this.setFilterTag('all')}
            >
              All
            </button>
            {tags.map(t => (
              <button
                key={t}
                type="button"
                className={'sketch-gallery__chip' + (this.state.filterTag === t ? ' is-active' : '')}
                onClick={() => this.setFilterTag(t)}
              >
                {TAG_LABELS[t] || t}
              </button>
            ))}
          </div>
          <div className="radiant-gallery__tool-group radiant-gallery__tool-group--schemes">
            <span className="sketch-gallery__label">Color</span>
            <button
              type="button"
              className={'sketch-gallery__chip' + (this.state.colorMode === 'global' ? ' is-active' : '')}
              onClick={() => this.setColorMode('global')}
            >
              One scheme
            </button>
            <button
              type="button"
              className={'sketch-gallery__chip' + (this.state.colorMode === 'per-shader' ? ' is-active' : '')}
              onClick={() => this.setColorMode('per-shader')}
            >
              Per-shader default
            </button>
            {this.state.colorMode === 'global' ? (
              <span className="radiant-gallery__swatches" role="group" aria-label="Color scheme">
                {colorSchemes.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    className={'radiant-gallery__swatch' + (this.state.schemeId === s.id ? ' is-active' : '')}
                    style={{ background: s.swatch }}
                    title={s.name}
                    onClick={() => this.setSchemeId(s.id)}
                  >
                    <span className="radiant-gallery__swatch-label">{s.name}</span>
                  </button>
                ))}
              </span>
            ) : null}
          </div>
        </div>

        <section className="sketch-gallery__section" aria-labelledby="radiant-vm-heading">
          <h3 id="radiant-vm-heading" className="sketch-gallery__section-title">
            Canvas 2D (lighter previews)
          </h3>
          <p className="sketch-gallery__section-desc">
            Radiant effects that use 2D canvas — friendlier for low-power GPUs when embedded full-screen.
          </p>
          {vmList.length ? (
            <div className="radiant-gallery__grid">{vmList.map(s => this.renderCard(s))}</div>
          ) : (
            <p className="sketch-gallery__empty">No shaders match the current filters in this section.</p>
          )}
        </section>

        <section className="sketch-gallery__section" aria-labelledby="radiant-gpu-heading">
          <h3 id="radiant-gpu-heading" className="sketch-gallery__section-title">
            WebGL (GPU-heavy previews)
          </h3>
          <p className="sketch-gallery__section-desc">
            Prefer hardware WebGL for these iframe previews; they mirror the live gallery at{' '}
            <a href="https://radiant-shaders.com">radiant-shaders.com</a>.
          </p>
          {gpuList.length ? (
            <div className="radiant-gallery__grid">{gpuList.map(s => this.renderCard(s))}</div>
          ) : (
            <p className="sketch-gallery__empty">No shaders match the current filters in this section.</p>
          )}
        </section>
      </div>
    );
  }
}

export default RadiantShaderGallery;
