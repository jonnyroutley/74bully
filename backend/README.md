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

    ```bash
    flask db init
    ```

2. Generate a migration file

    ```bash
    flask db migrate -m "Initial migration."
    ```

3. Apply the migration:

    ```bash
    flask db upgrade
    ```

### Deployment (DB)

SSH into the server, set the source and just run the upgrade command:

```bash
flask db upgrade
```

This works since the migration commands have already been generated during local development. It's important that the migration folderr is kept in sync.

## Linting

Install the Pylint extension
