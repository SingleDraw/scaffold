import requests
import os

"""
    Test client for FastAPI application with auth
"""

PORT = os.getenv("PORT", 8003)
API_KEY = os.getenv("API_KEY", "your-secret-key")

url = f"http://localhost:{PORT}/process"

files = {"file": open("test.txt", "rb")}

data = {
    "param1": "test_params", 
    "param2": 123
}

headers = {
    "x-api-key": API_KEY
}

response = requests.post(url, files=files, data=data, headers=headers)
print(response.json())
