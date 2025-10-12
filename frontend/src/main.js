/**
 * entry point for rendering Handlebars templates with internationalization + client-side routing.
 * - imports global styles (normalize, tailwind, icons, custom SCSS)
 * - registers common Handlebars helpers
 * - defines SPA routes and which templates compose each "page"
 * - compiles and mounts templates into #app based on current path
 * - binds i18next to update `[data-lang]` elements on load and language change
 * - intercepts <a data-link> clicks to navigate without full reload (History API)
 */

import Handlebars from 'handlebars';
import templates from './templates';
import i18next from './i18n';

import 'normalize.css';
import 'material-icons/iconfont/material-icons.css';
import 'flag-icons/css/flag-icons.min.css';
import '@/sass/styles.scss';
import '@/tailwind.css';
import logo from '/logo_tresk.png';
import { ROUTE_VIEWS, navigateTo } from './utils/urls';
import { generateExtraContext } from './utils/extra';
// import { api } from './utils/api';

Handlebars.registerHelper('eq', (a, b) => a === b);
Handlebars.registerHelper('multiply', (a, b) => a * b);

const getProps = (name, extra = {}) => {
  const shared = {
    lang: i18next.language,
    timestamp: Date.now(),
  };

  const perTemplate = {
    nav: { logo: logo },
    header: {
      header: 'Header Section',
      spectacleImages: ['/header1.jpg', '/header2.jpg', '/header3.jpg'],
    },
    main: {
      main: 'Main Content',
    },
    about: {
      title: 'About',
      text: 'Learn more about us on this page.',
    },
    contact: {
      title: 'Contact',
      text: 'Contact us through this page.',
    },
    footer: {},
    notFound: { title: '404 Not Found', text: 'Page not found.', path: window.location.pathname },
  };

  return { ...shared, ...(perTemplate[name] || {}), ...(extra[name] || {}) };
};

const mount = document.getElementById('app');

const renderTemplates = (viewNames, extraProps = {}) => {
  return viewNames
    .map((name) => {
      const source = templates[name];
      if (!source) {
        console.warn(`Template "${name}" is missing in templates object`);
        return '';
      }
      try {
        return Handlebars.compile(source)(getProps(name, extraProps));
      } catch (err) {
        console.error(`Failed to render template "${name}"`, err);
        return '';
      }
    })
    .join('');
};

const updateTranslations = () => {
  document.querySelectorAll('[data-lang]').forEach((el) => {
    const key = el.dataset.lang;
    if (key) el.textContent = i18next.t(key);
  });
};

export async function renderRoute() {
  if (!mount) {
    console.error('Mount point "#app" not found');
    return;
  }

  const path = window.location.pathname;
  const view = ROUTE_VIEWS[path];

  mount.innerHTML = '<div class="p-4">Loading…</div>';

  try {
    let extra = await generateExtraContext(path);

    let html = '';
    if (Array.isArray(view)) {
      html = renderTemplates(view, extra);
    } else if (view) {
      html = await view(extra);
    } else {
      html = templates['notFound']
        ? Handlebars.compile(templates['notFound'])(getProps('notFound'))
        : '<h1>404 Not Found</h1><p>Page not found.</p>';
    }

    mount.innerHTML = html;
    updateTranslations();
    window.scrollTo({ top: 0, behavior: 'instant' });
  } catch (e) {
    console.error(e);
    mount.innerHTML = `<div class="p-4 text-red-600">Ошибка загрузки: ${e.message}</div>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
      return;

    const link = e.target.closest('a[data-link]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    if (/^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:'))
      return;

    e.preventDefault();
    navigateTo(href);
  });

  window.addEventListener('popstate', renderRoute);

  renderRoute();
});

i18next.on('initialized languageChanged', () => {
  renderRoute();
});

updateTranslations();
