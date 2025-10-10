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
import axios from 'axios';

const API_ORIGIN = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_BASE   = `${API_ORIGIN}/api/`;

const api = axios.create({
  baseURL: `${API_ORIGIN}/api/`,
  timeout: 5000,
})

const absolutize = (maybePath) =>
  /^https?:\/\//.test(maybePath) ? maybePath : new URL(maybePath, API_BASE).href;

const fmtDate = (iso) =>
  new Intl.DateTimeFormat(i18next.language || 'en', { year: 'numeric', month: 'long', day: 'numeric' })
    .format(new Date(iso));

const fmtTime = (hhmmss) => {
  const [h, m] = String(hhmmss || '').split(':');
  return `${h ?? '00'}:${m ?? '00'}`;
};



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

const getProps = (name, extra = {}) => {
  const shared = {
    lang: i18next.language,
    timestamp: Date.now(),
  };

  const perTemplate = {
    nav: { logo: logo },
    header: { header: 'Header Section' },
    main: { main: 'Main Content' },
    about: { title: 'About', text: 'Learn more about us on this page.' },
    contact: { title: 'Contact', text: 'Contact us through this page.' },
    footer: {},
    notFound: { title: '404 Not Found', text: 'Page not found.', path: window.location.pathname },
  };

  return { ...shared, ...(perTemplate[name] || {}), ...(extra[name] || {}) };
};


const mount = document.getElementById('app');


function renderTemplates(viewNames, extraProps = {}) {
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
}


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
    let extra = {};

    if (path === '/') {
      const res = await api.get('spectacles/');
      const list = Array.isArray(res.data) ? res.data : [];

      const spectacles = list.map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        imageUrl: absolutize(s.image), // "/media/..." -> "http://localhost:8000/media/..."
        dateFmt: fmtDate(s.date),
        timeFmt: fmtTime(s.time),
        tickets_available: s.tickets_available,
        location: s.location,
      }));

      extra = { main: { spectacles } };
    }

    if (path === '/programm') {
      const res = await api.get('spectacles/');
      const list = Array.isArray(res.data) ? res.data : [];
      const spectacles = list.map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        imageUrl: absolutize(s.image),
        dateFmt: fmtDate(s.date),
        timeFmt: fmtTime(s.time),
        tickets_available: s.tickets_available,
        location: s.location,
      }));
      extra = { programm: { spectacles } };
    }

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
