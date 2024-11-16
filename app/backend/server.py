import io
from benchmarking import get_benchmarking_payload
from inference import get_inference_payload
from flask import Flask, jsonify, send_from_directory, request
import os

app = Flask(__name__, static_folder='../frontend/dist', static_url_path='')
app.config['MAX_CONTENT_LENGTH'] = 20 * 1000 * 1000
app.config['UPLOAD_FOLDER'] = './audio_uploads'
app.config['ALLOWED_EXTENSIONS'] = {'mp3','wav'}  # Allow specific file types

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.route('/')
def serve_page():
    return send_from_directory(app.static_folder, 'index.html') 

@app.route('/<path:path>')
def serve_frontend(path):
    return send_from_directory(app.static_folder, path)

@app.route('/api/benchmarking')
def get_benchmarking():
    response = jsonify(get_benchmarking_payload())
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/api/inference', methods=['POST'])
def get_inference():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filepath)
    
    
    response = jsonify(get_inference_payload(filepath))
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == '__main__':
    app.run(debug=True, port=8080)