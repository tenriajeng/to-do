from functools import wraps
from flask import current_app, jsonify, request
import jwt 
from models.user import UserModel

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]

        if not token:
            return jsonify({"message": "Unauthenticated, Please Login first!"}), 401

        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = UserModel.query.get(data['id'])
            if current_user:
                return f(*args, **kwargs)
            else:
                return jsonify({"message": "Token is invalid"}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token expired. Please log in again."}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token. Please log in again."}), 401

    return decorated
