import { renderRoute } from '@/main';
import { API_BASE } from './api';

export const ROUTE_VIEWS = {
  '/': ['nav', 'header', 'main', 'footer'],
  '/about': ['nav', 'about', 'footer'],
  '/contact': ['nav', 'contact', 'footer'],
  '/programm': ['nav', 'programm', 'footer'],
  '/tickets': ['nav', 'tickets', 'footer'],
  '/contacts': ['nav', 'contacts', 'footer'],
  '/partners': ['nav', 'partners', 'footer'],
  '/spectacle': ['nav', 'spectacle', 'footer'],
};

export const absolutize = (maybePath) =>
  /^https?:\/\//.test(maybePath) ? maybePath : new URL(maybePath, API_BASE).href;

export const getCurrentPage = () => {
  const sp = new URLSearchParams(window.location.search);
  const p = parseInt(sp.get('page') || '1', 10);
  return Number.isNaN(p) || p < 1 ? 1 : p;
};

export const getCurrentPageId = () => {
  const sp = new URLSearchParams(window.location.search);
  const id = parseInt(sp.get('id') || '0', 10);
  return Number.isNaN(id) || id < 1 ? 0 : id;
};

export const navigateTo = (url) => {
  const a = document.createElement('a');
  a.href = url;
  const full = a.pathname + a.search + a.hash;

  history.pushState(null, '', full);
  renderRoute();
};
