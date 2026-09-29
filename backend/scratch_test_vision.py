import google.generativeai as genai
import os
from PIL import Image
from dotenv import load_dotenv

load_dotenv('d:/ml/plantiq/backend/.env')
key = os.getenv('GEMINI_API_KEY')
genai.configure(api_key=key)

model = genai.GenerativeModel('gemini-3.1-flash-lite')
guava_img_path = 'uploads/scan-5dc52f_e23bc44c-74e0-452b-aef1-f6e80d3f8415.png'
print('Testing Guava Image:', guava_img_path)
img = Image.open(guava_img_path)

prompt = """You are an expert botanical computer vision system.
Identify the exact plant species and condition in this image.
Return pure JSON:
{
  "plant": "Common plant name",
  "scientific_name": "Botanical name",
  "disease": "Specific disease or Healthy Foliage",
  "confidence": 0.95,
  "symptoms": ["key visual symptom observed"]
}"""

response = model.generate_content([prompt, img])
print("RESPONSE:\n", response.text)
