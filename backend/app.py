from flask import Flask, jsonify
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from db import db
from controllers.auth_controller import auth_blueprint 
from controllers.status_controller import statuses_blueprint 
from controllers.task_controller import tasks_blueprint 
from models.user import UserModel
from config.config import Config 

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'
    jwt = JWTManager(app)
    # CORS(app,
    #      origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    #      supports_credentials=True,
    #      methods=["*"],
    #      resources={r"/*": {"origins": "*"}},
    #      allow_headers=['Content-Type', 'Authorization', 'XCSRF-Token']
    # )

    CORS(app, resources={r"/": {"origins": "http://localhost:3000"}})
    
    db.init_app(app)
    Migrate(app, db)
    # init_login_manager(app)
    register_blueprints(app)

    with app.app_context():
        db.create_all()

    # Custom 404 error handler
    @app.errorhandler(404)
    def page_not_found(e):
        return jsonify(error="Page not found"), 404
    return app

def register_blueprints(app):
    app.register_blueprint(auth_blueprint) 
    app.register_blueprint(statuses_blueprint) 
    app.register_blueprint(tasks_blueprint) 

def init_login_manager(app):
    login_manager = LoginManager()
    login_manager.init_app(app)
    
    @login_manager.user_loader
    def load_user(user_id):
        return db.session.get(UserModel, int(user_id))

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)