from db import db
from sqlalchemy import Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import mapped_column, relationship
from datetime import datetime

class StatusModel(db.Model):
    __tablename__ = "statuses"

    id = mapped_column(Integer, primary_key=True)
    user_id = mapped_column(Integer, ForeignKey('users.id'), nullable=False)
    name = mapped_column(String(50), unique=True, nullable=False)
    order = mapped_column(Integer, nullable=False, default=0)
    created_at = mapped_column(DateTime, default=datetime.now)
    updated_at = mapped_column(DateTime, default=datetime.now, onupdate=datetime.now)

    tasks = relationship('TaskModel', back_populates='status')
    user = relationship('UserModel', back_populates='statuses')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'order': self.order,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'updated_at': self.updated_at.strftime('%Y-%m-%d %H:%M:%S'),
            'user_id': self.user_id,
            'tasks': [task.to_dict() for task in self.tasks], # Uncomment this line if you want to include tasks in the dictionary
        }