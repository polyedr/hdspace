# Adevi REST API project

Adevi REST API project. This REST API application waas built with Django REST Framework based on adevi Django website. The core REST functionality was added. You can find the REST API at /api/v1/schema/. This REST API provide the functionality of the HTML redactor. Projects consist of screens. Screens consist of scenarios containing HTML elements and other things.


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.
After you will install and run the frontend part inparallel, you can use this application to redact parts of the HTML code.

### Prerequisites

What things you need to install the software and how to install them

PostgreSQL
Python 3.6+

### Installing

You can create virtual environment first from the requirements/requirements-api.txt file. 
Create the MongoDB database for the local installation purposes, put the database and other parameters required to the .env files.
After that, you can run migrations commands and run the server locally.

1. python manage.py makemigrations
2. python manage.py migrate
3. python manage.py createsuperuser
4. python manage.py runserver

You can find the REST API local schema here: http://127.0.0.1:8000/api/v1/schema/

## Deployment

1. Create the MongoDB database
2. Restore PostgreSQL database from dump, https://www.postgresql.org/docs/current/backup-dump.html
3. Copy project files to the server. Set up the parameters required at the application settings.
4. Deploy with NGINX and Gunicorn or UWSGI
5. Check that you have Debug = False at the application settings.

## Built With

* [Python](https://www.python.org/) - Programming language
* [Django](https://www.djangoproject.com/) - The Web framework for perfectionists with deadlines
* [Django REST Framework](https://www.django-rest-framework.org/) - Django REST framework is a powerful and flexible toolkit for building Web APIs.

## Authors

* **Ivan Ishchukov** - *REST API web development* - http://allmax.team/

## Acknowledgments

* Thanks for the Allmax team for the support and discussions and Santiago Rativa, Victor Zamora for the adevi application built
 
 
