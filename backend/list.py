import requests

TOGETHER_AI_API_KEY = "tgp_v1_onQLidpEUHatHkJsBsQQL9ZvdcEnk-X-qqLY17WAseg"

url = "https://api.together.xyz/v1/models"
headers = {"Authorization": f"Bearer {TOGETHER_AI_API_KEY}"}

response = requests.get(url, headers=headers)
if response.status_code == 200:
    models = response.json()
    print("Available Models:")
    for model in models:
        print(model["id"])
else:
    print("Error:", response.status_code, response.text)
