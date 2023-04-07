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

1. Create the `migrations` folder (only done once!).

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

## Development

If you have install more dependencies, you must add them to the `requirements.txt` file

```bash
python -m pip freeze > requirements.txt
```

To install requirements into your venv:

```bash
pip install -r requirements.txt
```

To create a venv (here we create a virtual environment called `env`)

```bash
python -m venv env
```

To activate the env:

```bash
env/Scripts/activate
```

You must install the vscode extension PyLint to use the `.pylintrc` file for linting.
