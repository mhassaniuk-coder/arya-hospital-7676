from sqlalchemy import Column, String, Integer
from app.database import Base


class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False, index=True)
    specialty = Column(String, nullable=False)
    status = Column(String, nullable=False, default="Online")
    patients = Column(Integer, default=0)
    image = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
