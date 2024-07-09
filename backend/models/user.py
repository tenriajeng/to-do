from db import db
from sqlalchemy.orm import mapped_column,relationship
from sqlalchemy import String, Integer, DateTime
from flask_login import UserMixin
from datetime import datetime
import bcrypt
 
class UserModel(db.Model, UserMixin):
    __tablename__ = "users"

    id = mapped_column(Integer, primary_key=True)
    email = mapped_column(String(255), unique=True)
    password = mapped_column(String(255))
    created_at = mapped_column(DateTime, default=datetime.now())
    updated_at = mapped_column(DateTime, default=datetime.now(), onupdate=datetime.now())

    tasks = relationship('TaskModel', back_populates='user')
    statuses = relationship('StatusModel', back_populates='user')

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
        }
    
    def set_password(self, password):
        self.password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password.encode('utf-8'))