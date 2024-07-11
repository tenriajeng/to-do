import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = f"postgresql://{os.getenv('DB_USERNAME')}:{os.getenv('DB_PASSWORD')}@localhost:{os.getenv('DB_PORT')}/{os.getenv('DB_DATABASE')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv('SECRET_KEY', 'supersecretkey')

    # CORS configuration
    CORS_SUPPORTS_CREDENTIALS = True  # Allow credentials
    CORS_ALLOW_HEADERS = '*'  # Allow all headers (or specify specific headers)
    # CORS_EXPOSE_HEADERS = '*'  # Expose all headers (or specify specific headers) 