from sqlalchemy import Column, String
from app.database import Base


class Ambulance(Base):
    __tablename__ = "ambulances"

    id = Column(String, primary_key=True)
    vehicle_number = Column(String, nullable=False, unique=True)
    driver_name = Column(String, nullable=False)
    status = Column(String, nullable=False, default="Available")
    location = Column(String, nullable=True)
    type = Column(String, nullable=False, default="BLS")
