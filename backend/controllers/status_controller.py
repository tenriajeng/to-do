from flask import Blueprint, request 
from models.status import StatusModel
from db import db
from utils.handle_response import ResponseHandler 
from cerberus import Validator
from validation.status_schema import status_create_schema
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import cross_origin

statuses_blueprint = Blueprint('statuses', __name__)

@statuses_blueprint.route('/statuses', methods=['GET'])
@cross_origin(origin='localhost', headers=['Content-Type','Authorization'])
@jwt_required()
def get_statuses(): 
    user_id = get_jwt_identity()
    statuses = StatusModel.query.filter_by(user_id=user_id).all()
    statuses_list = [status.to_dict() for status in statuses]
    
    return ResponseHandler.success(data=statuses_list)

@statuses_blueprint.route('/statuses/<int:status_id>', methods=['GET'])
@jwt_required()
def get_status_detail(status_id):
    user_id = get_jwt_identity()
    status = StatusModel.query.filter_by(id=status_id, user_id=user_id).first()
    if not status:
        return ResponseHandler.error(message='Status not found', status=404)
    
    return ResponseHandler.success(data=status.to_dict())

@statuses_blueprint.route('/statuses', methods=['POST'])
@cross_origin(origin='localhost', headers=['Content-Type','Authorization'])
@jwt_required()
def create_status():
    user_id = get_jwt_identity()
    data = request.json
    
    validator = Validator(status_create_schema)
    if not validator.validate(data):
        return ResponseHandler.error(message='Invalid data', status=400, data=validator.errors)

    next_order = StatusModel.query.filter_by(user_id=1).count()
    new_status = StatusModel(
        name=data.get('name'),
        user_id=user_id,
        order=next_order
    )

    db.session.add(new_status)
    db.session.commit()

    return ResponseHandler.success(data=new_status.to_dict(), status=201)

@statuses_blueprint.route('/statuses/<int:status_id>', methods=['PUT'])
@cross_origin(origin='localhost', headers=['Content-Type','Authorization'])
@jwt_required()
def update_status(status_id):
    data = request.json
    user_id = get_jwt_identity()
    validator = Validator(status_create_schema)
    if not validator.validate(data):
        return ResponseHandler.error(message='Invalid data', status=400, data=validator.errors)
    
    status = StatusModel.query.filter_by(id=status_id, user_id=user_id).first()
    if not status:
        return ResponseHandler.error(message='Status not found', status=404)

    status.name = data.get('name', status.name)
    db.session.commit()

    return ResponseHandler.success(data=status.to_dict())

@statuses_blueprint.route('/statuses/<int:status_id>', methods=['DELETE'])
@cross_origin(origin='localhost', headers=['Content-Type','Authorization'])
@jwt_required()
def delete_status(status_id):
    user_id = get_jwt_identity()
    status = StatusModel.query.filter_by(id=status_id, user_id=user_id).first()
    if not status:
        return ResponseHandler.error(message='Status not found', status=404)

    db.session.delete(status)
    db.session.commit()

    return ResponseHandler.success(message='Status deleted successfully')