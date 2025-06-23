from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    text = data.get('text', '')

    # Dummy response (da sostituire con NLP vera)
    result = {
        "entities": ["Company", "Date"],
        "classification": "Contract"
    }

    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)