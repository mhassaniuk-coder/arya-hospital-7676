from sqlalchemy import Column, String, Boolean
from app.database import Base


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(String, primary_key=True)
    patient_name = Column(String, nullable=False, index=True)
    doctor_name = Column(String, nullable=False)
    time = Column(String, nullable=False)
    date = Column(String, nullable=False)
    type = Column(String, nullable=False)
    status = Column(String, nullable=False, default="Pending")
    is_online = Column(Boolean, default=False)
