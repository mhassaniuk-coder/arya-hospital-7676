from sqlalchemy import Column, String, Enum
from app.database import Base
import enum


class UserRole(str, enum.Enum):
    ADMIN = "Admin"
    DOCTOR = "Doctor"
    NURSE = "Nurse"
    STAFF = "Staff"
    RECEPTIONIST = "Receptionist"
    PHARMACIST = "Pharmacist"
    LAB_TECH = "Lab Technician"


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False, default=UserRole.STAFF)
    avatar = Column(String, nullable=True)
