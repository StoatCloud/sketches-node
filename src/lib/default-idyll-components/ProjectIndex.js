/**
 * Sketch gallery: sectioned by runtime tier (VM-friendly vs GPU-heavy WebGL) with
 * Radiant-style filters (shared tag vocabulary with https://github.com/pbakaus/radiant ).
 */
const React = require('react');
const projectsIndex = require('../../src/sketches/index.json');
const {
  TAG_LABELS,
  TECHNIQUE_LABELS
} = require('../sketch-gallery-metadata');

const SORT_ORDER = 'order';
const SORT_TITLE = 'title';

class ProjectIndex extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      sortBy: SORT_ORDER,
      filterTechnique: 'all',
      filterTag: 'all'
    };
    this.setSortBy = this.setSortBy.bind(this);
    this.setFilterTechnique = this.setFilterTechnique.bind(this);
    this.setFilterTag = this.setFilterTag.bind(this);
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

  allTags () {
    var seen = Object.create(null);
    projectsIndex.forEach(function (p) {
      (p.tags || []).forEach(function (t) {
        seen[t] = true;
      });
    });
    return Object.keys(seen).sort();
  }

  filterProjects (list) {
    var technique = this.state.filterTechnique;
    var tag = this.state.filterTag;
    return list.filter(function (p) {
      if (technique !== 'all' && p.technique !== technique) return false;
      if (tag !== 'all' && !(p.tags || []).includes(tag)) return false;
      return true;
    });
  }

  sortProjects (list) {
    var copy = list.slice();
    if (this.state.sortBy === SORT_TITLE) {
      copy.sort(function (a, b) {
        return a.title.localeCompare(b.title);
      });
      return copy;
    }
    return copy.sort(function (a, b) {
      return b.order - a.order;
    });
  }

  renderProjectCard (project) {
    return (
      <a
        className="project"
        key={project.id}
        href={project.path}
        data-technique={project.technique}
        data-runtime-tier={project.runtimeTier}
      >
        <img src={project.thumbnailPath} alt="" />
        <span className="project__badges" aria-hidden="true">
          <span className={'project__badge project__badge--' + project.technique}>
            {TECHNIQUE_LABELS[project.technique] || project.technique}
          </span>
        </span>
        <span className="project__overlay">
          <span className="project__meta">
            <span className="project__title">{project.title}</span>
            {project.description && (
              <span className="project__description">{project.description}</span>
            )}
          </span>
        </span>
      </a>
    );
  }

  render () {
    var base = this.props.limit ? projectsIndex.slice(0, this.props.limit) : projectsIndex;
    var filtered = this.filterProjects(base);
    var sorted = this.sortProjects(filtered);
    var vmList = sorted.filter(function (p) { return p.runtimeTier === 'vm-friendly'; });
    var gpuList = sorted.filter(function (p) { return p.runtimeTier === 'gpu-recommended'; });
    var tags = this.allTags();

    if (this.props.limit) {
      return <div className="projects">{sorted.map(p => this.renderProjectCard(p))}</div>;
    }

    return (
      <div className="sketch-gallery">
        <p className="sketch-gallery__radiant-note">
          Gallery layout and tags follow the{' '}
          <a href="https://github.com/pbakaus/radiant">Radiant</a> shader gallery vocabulary
          (see <code className="sketch-gallery__code">radiant/</code> submodule).
        </p>
        <div className="sketch-gallery__toolbar" role="toolbar" aria-label="Filter sketches">
          <div className="sketch-gallery__tool-group">
            <span className="sketch-gallery__label">Sort</span>
            <button
              type="button"
              className={'sketch-gallery__chip' + (this.state.sortBy === SORT_ORDER ? ' is-active' : '')}
              onClick={() => this.setSortBy(SORT_ORDER)}
            >
              Featured
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
        </div>

        <section className="sketch-gallery__section" aria-labelledby="sketch-vm-heading">
          <h2 id="sketch-vm-heading" className="sketch-gallery__section-title">
            VM-friendly (canvas or lightweight WebGL)
          </h2>
          <p className="sketch-gallery__section-desc">
            Safe defaults for remote VMs, software WebGL, and low-power GPUs.
          </p>
          {vmList.length ? (
            <div className="projects">{vmList.map(p => this.renderProjectCard(p))}</div>
          ) : (
            <p className="sketch-gallery__empty">No sketches match the current filters in this section.</p>
          )}
        </section>

        <section className="sketch-gallery__section" aria-labelledby="sketch-gpu-heading">
          <h2 id="sketch-gpu-heading" className="sketch-gallery__section-title">
            WebGL &amp; GPU-heavy simulations
          </h2>
          <p className="sketch-gallery__section-desc">
            Full GPU shaders, large framebuffers, or live media — prefer a real machine with hardware WebGL.
          </p>
          {gpuList.length ? (
            <div className="projects">{gpuList.map(p => this.renderProjectCard(p))}</div>
          ) : (
            <p className="sketch-gallery__empty">No sketches match the current filters in this section.</p>
          )}
        </section>
      </div>
    );
  }
}

export default ProjectIndex;
