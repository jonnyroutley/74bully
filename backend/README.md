# Backend API for 74 Bully

## Setup

Initialise the database with:

```bash
python init.py
```

Run with:

```bash
python app.py
```

## DB Migration

1. Create the `migrations` folder.
```
flask db init
```
2. Generate a migration file:
```
flask db migrate -m "Initial migration."
```
3. Apply the migration:
```
flask db upgrade
```

## Linting

Install the Pylint extension
