import api from './api';
import { fmtDate, fmtTime } from './format';
import { absolutize } from './urls';
import { getCurrentPage, getCurrentPageId } from './urls';

const PER_PAGE = 4;

export const generateExtraContext = async (path) => {
    let extra = {};

    // here is the main page
    if (path === '/') {
      const response = await api.get('spectacles/');
      const list = Array.isArray(response.data) ? response.data : [];

      const all = list.map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        imageUrl: absolutize(s.image),
        dateFmt: fmtDate(s.date),
        timeFmt: fmtTime(s.time),
        tickets_available: s.tickets_available,
        location: s.location,
      }));

      const totalPages = Math.max(1, Math.ceil(all.length / PER_PAGE));
      const pageRaw = getCurrentPage();
      const page = Math.min(pageRaw, totalPages);
      const start = (page - 1) * PER_PAGE;
      const pageItems = all.slice(start, start + PER_PAGE);

      const hasPrev = page > 1;
      const hasNext = page < totalPages;

      extra = {
        main: {
          spectacles: pageItems,
          pagination: {
            page,
            totalPages,
            hasPrev,
            hasNext,
            prevPage: hasPrev ? page - 1 : null,
            nextPage: hasNext ? page + 1 : null,
          },
        },
      };
    }

    // here is the spectacle details page
    if (path === '/spectacle' && getCurrentPageId()) {
      const id = getCurrentPageId();
      const response = await api.get(`spectacles/${id}/`);
      const spectacle = response.data;

      extra = { spectacle };
    }

    // here is the programm page
    if (path === '/programm') {

      const response = await api.get('spectacles/');
      const list = Array.isArray(response.data) ? response.data : [];
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
    return extra;
}