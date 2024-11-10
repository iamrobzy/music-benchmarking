from flask import Flask, jsonify, send_from_directory

app = Flask(__name__, static_folder='../frontend/dist', static_url_path='')

@app.route('/')
def serve_page():
    return send_from_directory(app.static_folder, 'index.html') 

@app.route('/<path:path>')
def serve_frontend(path):
    return send_from_directory(app.static_folder, path)

if __name__ == '__main__':
    app.run(debug=True)