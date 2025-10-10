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
import logo from '../public/Logo_Tresk!.png';
// import axios from 'axios';

const { VITE_API_URL } = import.meta.env;
console.log('API URL:', VITE_API_URL);

// const api = axios.create({
//   baseURL: VITE_API_URL || 'http://localhost:3000/api',
//   timeout: 5000,
// })

// const absolutize = (maybePath) =>
//   /^https?:\/\//.test(maybePath) ? maybePath : new URL(maybePath, VITE_API_URL).href;

const ROUTE_VIEWS = {
  '/': ['nav', 'header', 'main', 'footer'],
  '/about': ['nav', 'about', 'footer'],
  '/contact': ['nav', 'contact', 'footer'],
  '/programm': ['nav', 'programm', 'footer'],
  '/tickets': ['nav', 'tickets', 'footer'],
  '/contacts': ['nav', 'contacts', 'footer'],
  '/partners': ['nav', 'partners', 'footer'],
};

Handlebars.registerHelper('eq', (a, b) => a === b);

const getProps = (name) => {
  const shared = {
    lang: i18next.language,
    timestamp: Date.now(),
  };

  const perTemplate = {
    nav: {
      logo: logo,
    },
    header: {
      header: 'Header Section',
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
    notFound: {
      title: '404 Not Found',
      text: 'Page not found.',
      path: window.location.pathname,
    },
  };

  return { ...shared, ...(perTemplate[name] || {}) };
};

const mount = document.getElementById('app');

function renderTemplates(viewNames) {
  return viewNames
    .map((name) => {
      const source = templates[name];
      if (!source) {
        console.warn(`Template "${name}" is missing in templates object`);
        return '';
      }
      try {
        return Handlebars.compile(source)(getProps(name));
      } catch (err) {
        console.error(`Failed to render template "${name}"`, err);
        return '';
      }
    })
    .join('');
}

const updateTranslations = () => {
  document.querySelectorAll('[data-lang]').forEach((el) => {
    const key = el.dataset.lang;
    if (key) el.textContent = i18next.t(key);
  });
};

export function renderRoute() {
  if (!mount) {
    console.error('Mount point "#app" not found');
    return;
  }

  const path = window.location.pathname;
  const view = ROUTE_VIEWS[path];

  mount.innerHTML = '<div class="p-4">Loading…</div>';

  if (view) {
    mount.innerHTML = renderTemplates(view);
  } else {
    if (templates['notFound']) {
      mount.innerHTML = Handlebars.compile(templates['notFound'])(getProps('notFound'));
    } else {
      mount.innerHTML = '<h1>404 Not Found</h1><p>Page not found.</p>';
    }
  }

  updateTranslations();

  window.scrollTo({ top: 0, behavior: 'instant' });
}

export function navigateTo(url) {
  const a = document.createElement('a');
  a.href = url;
  const pathname = a.pathname;

  history.pushState(null, '', pathname);
  renderRoute();
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
      return;

    const link = e.target.closest('a[data-link]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // внешние/спец-ссылки не перехватываем
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
