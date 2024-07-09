task_create_schema = {
    'title': {'type': 'string', 'required': True, 'minlength': 3, 'maxlength': 255},
    'description': {'type': 'string', 'required': True},
    'status_id': {'type': 'integer', 'required': True},
}

task_update_schema = {
    'title': {'type': 'string', 'minlength': 3, 'maxlength': 255},
    'description': {'type': 'string'},
    'status_id': {'type': 'integer'},
}