from db import db
from sqlalchemy import Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import mapped_column, relationship
from datetime import datetime

class TaskModel(db.Model):
    __tablename__ = "tasks"

    id = mapped_column(Integer, primary_key=True)
    title = mapped_column(String(255), nullable=False)
    user_id = mapped_column(Integer, ForeignKey('users.id'), nullable=False)
    status_id = mapped_column(Integer, ForeignKey('statuses.id'), nullable=False, default=1)
    description = mapped_column(String(1000))
    created_at = mapped_column(DateTime, default=datetime.now)
    updated_at = mapped_column(DateTime, default=datetime.now, onupdate=datetime.now)
    
    user = relationship('UserModel', back_populates='tasks')
    status = relationship('StatusModel', back_populates='tasks') 
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'status': self.status.name,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'updated_at': self.updated_at.strftime('%Y-%m-%d %H:%M:%S'),
            'user_id': self.user_id,
        }