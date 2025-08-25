import requests
import os

"""
    Test client for FastAPI application
"""

PORT = os.getenv("PORT", 8003)
url = f"http://localhost:{PORT}/process"
files = {"file": open("test.txt", "rb")}
data = {
    "param1": "test_params", 
    "param2": 123
}

response = requests.post(url, files=files, data=data)
print(response.json())
