from sqlalchemy import Column, String, Integer
from app.database import Base


class Patient(Base):
    __tablename__ = "patients"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False, index=True)
    age = Column(Integer, nullable=False)
    gender = Column(String, nullable=False)
    admission_date = Column(String, nullable=False)
    condition = Column(String, nullable=False)
    room_number = Column(String, nullable=True)
    urgency = Column(String, nullable=False, default="MEDIUM")
    history = Column(String, nullable=True)
    status = Column(String, nullable=True, default="OPD")
    ward = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
