from sqlalchemy import Column, String
from app.database import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    assignee = Column(String, nullable=False)
    priority = Column(String, nullable=False, default="Medium")
    status = Column(String, nullable=False, default="Todo")


class Bed(Base):
    __tablename__ = "beds"

    id = Column(String, primary_key=True)
    ward = Column(String, nullable=False)
    number = Column(String, nullable=False)
    status = Column(String, nullable=False, default="Available")
    patient_name = Column(String, nullable=True)
    type = Column(String, nullable=False, default="General")


class Notice(Base):
    __tablename__ = "notices"

    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    date = Column(String, nullable=False)
    priority = Column(String, nullable=False, default="Normal")
