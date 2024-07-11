from flask import Blueprint, request
from flask_login import current_user
from middleware.token_required import token_required
from models.task import TaskModel
from db import db
from utils.handle_response import ResponseHandler
from cerberus import Validator
from validation.task_schema import task_create_schema, task_update_schema
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import cross_origin

tasks_blueprint = Blueprint('tasks', __name__)

@tasks_blueprint.route('/tasks', methods=['GET'])
@cross_origin(origin='localhost', headers=['Content-Type','Authorization'])
@jwt_required()
def get_tasks():
    tasks = TaskModel.query.filter_by(user_id= get_jwt_identity()).all()
    tasks_list = [task.to_dict() for task in tasks]
    return ResponseHandler.success(data=tasks_list)

@tasks_blueprint.route('/tasks/<int:task_id>', methods=['GET'])
@cross_origin(origin='localhost', headers=['Content-Type','Authorization'])
@jwt_required()
def get_task_detail(task_id):
    task = TaskModel.query.filter_by(id=task_id, user_id= get_jwt_identity()).first()
    if not task:
        return ResponseHandler.error(message='Task not found', status=404)
    return ResponseHandler.success(data=task.to_dict())

@tasks_blueprint.route('/tasks', methods=['POST'])
@cross_origin(origin='localhost', headers=['Content-Type','Authorization'])
@jwt_required()
def create_task():
    data = request.json

    validator = Validator(task_create_schema)
    if not validator.validate(data):
        return ResponseHandler.error(message='Invalid data', status=400, data=validator.errors)
    
    new_task = TaskModel(
        title=data.get('title'),
        description=data.get('description'),
        user_id= get_jwt_identity(),
        status_id=data.get('status_id')
    )
    db.session.add(new_task)
    db.session.commit()

    return ResponseHandler.success(data=new_task.to_dict(), status=201)

@tasks_blueprint.route('/tasks/<int:task_id>', methods=['PUT'])
@cross_origin(origin='localhost', headers=['Content-Type','Authorization'])
@jwt_required()
def update_task(task_id):
    data = request.json

    validator = Validator(task_update_schema)
    if not validator.validate(data):
        return ResponseHandler.error(message='Invalid data', status=400, data=validator.errors)
    
    task = TaskModel.query.filter_by(id=task_id, user_id= get_jwt_identity()).first()
    if not task:
        return ResponseHandler.error(message='Task not found', status=404)

    task.title = data.get('title', task.title)
    task.description = data.get('description', task.description)
    task.status_id = data.get('status_id', task.status_id)
    db.session.commit()
    
    return ResponseHandler.success(data=task.to_dict())

@tasks_blueprint.route('/tasks/<int:task_id>', methods=['DELETE'])
@cross_origin(origin='localhost', headers=['Content-Type','Authorization'])
@jwt_required()
def delete_task(task_id):
    task = TaskModel.query.filter_by(id=task_id, user_id= get_jwt_identity()).first()
    if not task:
        return ResponseHandler.error(message='Task not found', status=404)

    db.session.delete(task)
    db.session.commit()
    
    return ResponseHandler.success(message='Task deleted successfully')
