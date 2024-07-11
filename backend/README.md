# Flask Task Management Application

## Description

This is a Flask application for managing tasks with JWT authentication, CORS handling, SQLAlchemy ORM for database management, and modularized using Blueprints.

## Prerequisites

Before running this application, ensure you have Python and pipenv installed on your system.

## Installation

Clone the repository:

```bash
git clone <repository-url>
```

Install pipenv: If you haven't installed `pipenv` yet, you can install it using pip:

```bash
pip install pipenv
```

Activate the pipenv shell:

```bash
 pipenv shell
```

Install dependencies using pipenv:

```bash
pipenv install
```

Initialize the migration environment if it's not initialized yet:

```bash
pipenv run flask db init
```

Whenever you make changes to your SQLAlchemy models, generate a migration script:

```bash
pipenv run flask db migrate -m "Brief description of your changes"
```

Apply pending migrations to your database:

```bash
pipenv run flask db upgrade
```

to start the Flask app

```bash
python app.py
```
