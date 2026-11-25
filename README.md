# Tresk Theater

> **Note:** This is an educational project: the final project of a programming course.
> It was built to practice Django REST Framework and vanilla JS SPA development
> and is not intended for production use.

Website for the Tresk theater: a playbill, spectacle pages with ticket purchase, partners, contacts and an "About us" page.

The project has two parts:

- **Backend**: Django 5.2 + Django REST Framework, PostgreSQL. Serves the REST API and the admin panel for managing content.
- **Frontend**: a vanilla JS SPA built with Vite, Handlebars templates, Tailwind CSS + Sass and i18next (RU/EN). It fetches data from the API via axios.

## Structure

```
theater_tresk/
├── manage.py
├── requirements.txt          # Python dependencies
├── theater_tresk/            # Django project (settings, urls, wsgi/asgi)
├── theater/                  # Main app
│   ├── models.py             # Spectacle, Ticket, Partner, User
│   ├── views.py              # API views (APIView)
│   ├── urls.py               # /api/... routes
│   ├── api/serializers.py    # DRF serializers
│   ├── admin.py              # Admin registration
│   └── migrations/
├── media/                    # Uploaded images (posters, partner logos)
├── assets/                   # Images for test data
└── frontend/                 # Client side
    ├── index.html
    ├── vite.config.js
    ├── public/               # Static files and translations (locales/en, locales/ru)
    ├── src/
    │   ├── main.js           # Template rendering, client-side routing
    │   ├── i18n.js           # i18next setup
    │   ├── templates/        # Handlebars page templates
    │   ├── sass/, tailwind.css
    │   └── utils/            # api, routes, data loading, form validation, language switcher
    └── tests/                # Vitest
```

## Data models

| Model       | Fields                                                                                                      |
| ----------- | ----------------------------------------------------------------------------------------------------------- |
| `Spectacle` | `title`, `description` (up to 50 chars), `full_description`, `date`, `time`, `tickets_available`, `image`, `location` |
| `Ticket`    | `spectacle` (FK), `name`, `surname`, `email`, `quantity`, `created_at`                                      |
| `Partner`   | `name`, `website`, `logo`, `description`                                                                    |
| `User`      | Custom user based on `AbstractUser` with a unique `email`                                                   |

When a `Ticket` is saved, the spectacle's available ticket count is decreased inside a transaction (`select_for_update`). If there are not enough tickets, a `ValueError` is raised.

## REST API

Base prefix: `/api/`

| Method | URL                                 | Description                                   |
| ------ | ----------------------------------- | --------------------------------------------- |
| GET    | `/api/spectacles/`                  | List of spectacles (sorted by date, newest first) |
| GET    | `/api/spectacles/<id>/`             | Spectacle details                             |
| POST   | `/api/spectacles/<id>/buy_ticket`   | Buy tickets                                   |
| GET    | `/api/partners/`                    | List of partners                              |

Admin panel: `/admin/`. In `DEBUG` mode, media files are served at `/media/`.

Example purchase request body:

```json
{
  "id": 1,
  "name": "John",
  "surname": "Smith",
  "email": "john@example.com",
  "quantity": 2
}
```

`201` response:

```json
{ "status": "success", "message": "Ticket successfully purchased", "remaining_tickets": 18 }
```

After a successful purchase, a confirmation email is sent to the buyer. The current settings use `console.EmailBackend`, so the email is printed to the server console.

## Frontend pages

| Path              | Content                                                    |
| ----------------- | ---------------------------------------------------------- |
| `/`               | Header slider, playbill with pagination (4 per page), map  |
| `/spectacle?id=N` | Spectacle page and ticket purchase form                    |
| `/programm`       | Full program                                               |
| `/tickets`        | Tickets                                                    |
| `/partners`       | Partners                                                   |
| `/about`          | About the theater                                          |
| `/contacts`       | Contacts                                                   |

Navigation works without page reloads: links with the `data-link` attribute are handled via the History API. Text with the `data-lang` attribute is translated with i18next. The language is switched in the navbar and saved to `localStorage`.

## Running locally

### Requirements

- Python 3.11+
- PostgreSQL
- Node.js 18+ and npm

### 1. Database

Create the database and user specified in `theater_tresk/settings.py`:

```sql
CREATE DATABASE theaterdb;
CREATE USER theater_user WITH PASSWORD 'tresk_db_user';
GRANT ALL PRIVILEGES ON DATABASE theaterdb TO theater_user;
ALTER DATABASE theaterdb OWNER TO theater_user;
```

### 2. Backend

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install django-cors-headers   # used in settings but missing from requirements.txt

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver        # http://localhost:8000
```

Add spectacles and partners through the admin panel at `http://localhost:8000/admin/`. Images from `assets/` can be used as test data.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev                       # http://localhost:9999
```

By default the frontend calls the API at `http://localhost:8000`. To use a different address, create `frontend/.env`:

```ini
VITE_API_URL=http://localhost:8000
```

CORS on the backend allows `localhost`/`127.0.0.1` on ports `9999` (dev) and `8888` (preview).

## Frontend scripts

| Command           | Action                                                    |
| ----------------- | --------------------------------------------------------- |
| `npm run dev`     | Dev server on port 9999                                   |
| `npm run build`   | Build to `frontend/dist` (runs prettier and eslint with auto-fix first) |
| `npm run preview` | Preview the build on port 8888                            |
| `npm run lint`    | ESLint check                                              |
| `npm run format`  | Prettier check                                            |
| `npm run test`    | Vitest tests                                              |

## Known issues and TODO

- `SECRET_KEY`, the database password and `DEBUG = True` are hardcoded in `settings.py`. Move them to environment variables before deploying.
- `django-cors-headers` is not listed in `requirements.txt`, although it is in `INSTALLED_APPS`.
- `django-vite` is in `requirements.txt` but is not enabled in Django.
- `Spectacle.is_sold_out` returns `True` when tickets **are** available. The logic is inverted.
- `BuyTicketView` takes the spectacle id from the request body (`id`) instead of the `<pk>` in the URL.
- Tests are placeholders only (`frontend/tests/example.test.js`, `theater/tests.py`).
- SMTP email sending is commented out in `settings.py`. To send real emails, configure `EMAIL_HOST_USER` and `EMAIL_HOST_PASSWORD`.
