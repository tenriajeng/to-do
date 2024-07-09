from flask import Blueprint, request
from flask_login import current_user
from middleware.token_required import token_required
from models.status import StatusModel
from db import db
from utils.handle_response import ResponseHandler 
from cerberus import Validator
from validation.status_schema import status_create_schema

statuses_blueprint = Blueprint('statuses', __name__, url_prefix='/statuses')

@statuses_blueprint.route('/', methods=['GET'])
@token_required
def get_statuses():
    statuses = StatusModel.query.filter_by(user_id=current_user.id).all()
    statuses_list = [status.to_dict() for status in statuses]
    
    return ResponseHandler.success(data=statuses_list)

@statuses_blueprint.route('/<int:status_id>', methods=['GET'])
@token_required
def get_status_detail(status_id):
    status = StatusModel.query.filter_by(id=status_id, user_id=current_user.id).first()
    if not status:
        return ResponseHandler.error(message='Status not found', status=404)
    
    return ResponseHandler.success(data=status.to_dict())

@statuses_blueprint.route('/', methods=['POST'])
@token_required
def create_status():
    data = request.json
    
    validator = Validator(status_create_schema)
    if not validator.validate(data):
        return ResponseHandler.error(message='Invalid data', status=400, data=validator.errors)

    next_order = StatusModel.query.filter_by(user_id=current_user.id).count()
    new_status = StatusModel(
        name=data.get('name'),
        user_id=current_user.id,
        order=next_order
    )

    db.session.add(new_status)
    db.session.commit()

    return ResponseHandler.success(data=new_status.to_dict(), status=201)

@statuses_blueprint.route('/<int:status_id>', methods=['PUT'])
@token_required
def update_status(status_id):
    data = request.json
    
    validator = Validator(status_create_schema)
    if not validator.validate(data):
        return ResponseHandler.error(message='Invalid data', status=400, data=validator.errors)
    
    status = StatusModel.query.filter_by(id=status_id, user_id=current_user.id).first()
    if not status:
        return ResponseHandler.error(message='Status not found', status=404)

    status.name = data.get('name', status.name)
    db.session.commit()

    return ResponseHandler.success(data=status.to_dict())

@statuses_blueprint.route('/<int:status_id>', methods=['DELETE'])
@token_required
def delete_status(status_id):
    status = StatusModel.query.filter_by(id=status_id, user_id=current_user.id).first()
    if not status:
        return ResponseHandler.error(message='Status not found', status=404)

    db.session.delete(status)
    db.session.commit()

    return ResponseHandler.success(message='Status deleted successfully')