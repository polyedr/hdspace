# Adevi REST API project

Adevi REST API project. This REST API application was built with Django REST Framework based on Adevi Django website. The core REST functionality was added. You can find the REST API at /api/v1/schema/. This REST API provide the functionality of the HTML redactor. Projects consist of screens. Screens consist of scenarios containing HTML elements and other things.
File names were changed a little in comparison with typical Django structure:

1. models.py, the models for the REST API were added
2. serializers.py, the serializers for the models which were added for the REST API
3. apiviews, views for the REST API
4. apiurls, urls for the REST API

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.
After you will install and run the front end part in parallel, you can use this application to redact parts of the HTML code.

### Prerequisites

What things you need to install the software and how to install them

*PostgreSQL*

#####  *Python 3.6 Strict*

### Installing

You can create a virtual environment with python 3.6 first then execute 

> *pip install -r requirement.txt.*

in the project root folder to load all dependencies required for this project from the root folder as well as all *.txt* file from the requirements folder. 

Then you can use the **SSH** details provided to retrieve trained model from our server, trained models are located in

> */opt/adeviio/develop/apps/virtualize_simple/mask_rcnn/trained_models*

Then create the <i>PostgreSQL</i> database by using the database name and database username from <i>.env-template</i>. 

<i>Note: you can create the database using your own database name and database username & password, just update them into .env in the root</i> folder

After that, you can run these migrations commands and run the server locally.

> *python manage.py migrate*

> *python manage.py createsuperuser*

> *python manage.py runserver*

You can find the REST API local schema here: http://127.0.0.1:8000/api/v1/schema/

### Element recorded in .json file restoration

Two sample .json file is provided in the folder apps/projects/element_restore/element_examples

To restore them, type the following to the venv command line

> *python manage.py --path ./element_examples*

To restore .json from other directories, just replace what's after --path


## Deployment

1. Copy project files to the server. Set up the parameters required at the application settings.
4. Deploy with NGINX and Gunicorn or UWSGI
5. Check that you have Debug = False at the application settings.

## Built With

* [Python](https://www.python.org/) - Programming language
* [Django](https://www.djangoproject.com/) - The Web framework for perfectionists with deadlines
* [Django REST Framework](https://www.django-rest-framework.org/) - Django REST framework is a powerful and flexible toolkit for building Web APIs.
* [PostgreSQL](https://www.postgresql.org/) Database

## Authors

* **Ivan Ishchukov** - *REST API web development*

## Acknowledgements

* Thanks for Santiago Rativa, Victor Zamora for the adevi application built and Peter Yamamoto for user roles development and YuanHong Li for ReadMe Update.

 
