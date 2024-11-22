# How to run the app

This is a guide on how to run the music benchmarking app.

## Building the front-end files

1. Enter the `frontend` directory.
2. Run `npm install`.
3. Run `npm run build`.

## Running the local Flask server

1. Enter the `backend` directory.
2. Run `pip install -r requirements.txt`.
3. Run `python server.py`.
4. The app will be running on `http://127.0.0.1:5000`.

## Serverless GPU inference server

1. Register a [Modal](https://modal.com/) account
2. Run `modal deploy infer.py`