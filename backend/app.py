import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

TOGETHER_AI_API_KEY = "tgp_v1_onQLidpEUHatHkJsBsQQL9ZvdcEnk-X-qqLY17WAseg"

def query_llm(user_input):
    url = "https://api.together.xyz/v1/chat/completions"
    headers = {"Authorization": f"Bearer {TOGETHER_AI_API_KEY}", "Content-Type": "application/json"}
    payload = {
        "model": "meta-llama/Meta-Llama-3-70B-Instruct-Turbo",
        "messages": [{"role": "user", "content": user_input}],
        "temperature": 0.7,
        "max_tokens": 200
    }


    try:
        response = requests.post(url, headers=headers, json=payload)
        print("API Response Status:", response.status_code)
        print("API Response:", response.text)  

        if response.status_code == 200:
            response_data = response.json()
            return response_data["choices"][0]["message"]["content"]
        else:
            return f"API Error: {response.status_code} - {response.text}"

    except Exception as e:
        print("Error calling LLM API:", e)
        return "Sorry, I couldn't process your request."


@app.route("/chatbot", methods=["POST"])
def chatbot():
    data = request.json
    user_message = data.get("message", "")

    if not user_message:
        return jsonify({"reply": "I didn't get any message."})

    bot_reply = query_llm(user_message)
    return jsonify({"reply": bot_reply})

if __name__ == "__main__":
    app.run(debug=True)
