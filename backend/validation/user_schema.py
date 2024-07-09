register_schema = {
    'email': {'type': 'string', 'required': True, 'maxlength': 255},
    'password': {'type': 'string', 'required': True, 'minlength': 6}
}

login_schema = {
    'email': {'type': 'string', 'required': True},
    'password': {'type': 'string', 'required': True}
}