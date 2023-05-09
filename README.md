# PNT Building Accounting System

The application was created for Science and Technology Park in Opole ([PNT](https://pnt.opole.pl/index.php/en/)). The main goal of the project was to create a system for billing buildings with unusual data, e.g. percentage distribution of the bill for individual rooms.

The backend (API) was based on Laravel with JWT authorization. React [Dashboard](https://www.creative-tim.com/product/material-tailwind-dashboard-react#) was used as the frontend.

Currently only Polish is available.

```ad-info
title: Project in progress
```


## Technologies

- Laravel 10 (PHP 8.2.0)
- React 18 (Node.js 18.14.2)
- MariaDB


## Setup

```ad-warning
title: System
Tested on Windows 10. Setup on other systems may be different.
```

```ad-info
title: Database
You will need [XAMPP](https://www.apachefriends.org/pl/index.html) or something to host a MariaDB.
```

### To run the dashboard:

```bash
cd dashboard
pnpm install
pnpm dev
```

### To run the backend:
Before first run you will need to create .env file. To do this, copy .env.example file in backend folder and rename to ".env". It's important to fill your database credentials:

```php
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=
```

```ad-info
title: Default credentials
If you will use XAMPP to host database, you don't need to change anything.
```

Then just run this block:

```bash
cd backend
composer install
php artisan key:generate
php artisan jwt:secret
php artisan migrate:fresh --seed
php artisan serve --port=8000
```

App should run on localhost:5173

```ad-warning
title: Data seeding
Only 2023.01 - 2023.03 are filled with data.
```

```ad-warning
title: Dev version
The application will run on dev mode.
```

