from flask import Blueprint, request
from flask_jwt_extended import create_access_token
from models.user import UserModel 
from flask_login import logout_user, login_required 
from db import db
from cerberus import Validator
from validation.user_schema import register_schema, login_schema
from utils.handle_response import ResponseHandler

auth_blueprint = Blueprint('auth', __name__)

@auth_blueprint.post("/register")
def register():
    data = request.get_json()

    validator = Validator(register_schema)
    if not validator.validate(data):
        return ResponseHandler.error(message="Validation failed",data=validator.errors, status=400)

    email = data.get('email')
    password = data.get('password')

    existing_user = UserModel.query.filter_by(email=email).first()
    if existing_user:
        return ResponseHandler.error(message="User already exists", status=409)

    new_user = UserModel(email=email)
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    return ResponseHandler.success(data=new_user.to_dict(), status=201)

@auth_blueprint.post("/login")
def login():
    data = request.get_json()

    validator = Validator(login_schema)
    if not validator.validate(data):
        return ResponseHandler.error(message="Validation failed", data=validator.errors, status=400)

    email = data.get('email')
    password = data.get('password')

    user = UserModel.query.filter_by(email=email).first()
    if user and user.check_password(password):
        token = create_access_token(identity=user.id)

        return ResponseHandler.success(data={"message": "Successfully logged in", "access_token": token}, status=200)
    else:
        return ResponseHandler.error(message="Invalid email or password", status=401)

@auth_blueprint.get('/logout')
@login_required
def user_logout():
    logout_user()
    return ResponseHandler.success(message="Successfully logged out", status=200)
