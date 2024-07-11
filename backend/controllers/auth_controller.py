from flask import Blueprint, request
from flask_jwt_extended import create_access_token
from models.user import UserModel 
from flask_login import logout_user, login_required 
from db import db
from cerberus import Validator
from validation.user_schema import register_schema, login_schema
from utils.handle_response import ResponseHandler
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import cross_origin

auth_blueprint = Blueprint('auth', __name__)

@auth_blueprint.post("/register")
@cross_origin(origin='localhost')
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
@cross_origin(origin='localhost')
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

@auth_blueprint.get('/verify-token')
@cross_origin(origin='localhost', headers=['Content-Type','Authorization'])
@jwt_required()
def verify_token():
    current_user_id = get_jwt_identity()
    user = UserModel.query.get(current_user_id)
    if user:
        return ResponseHandler.success(data={"user_id": user.id, "email": user.email}, status=200)
    else:
        return ResponseHandler.error(message="User not found", status=404)