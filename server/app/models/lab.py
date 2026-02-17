from sqlalchemy import Column, String
from app.database import Base


class LabTestRequest(Base):
    __tablename__ = "lab_requests"

    id = Column(String, primary_key=True)
    patient_name = Column(String, nullable=False, index=True)
    test_name = Column(String, nullable=False)
    priority = Column(String, nullable=False, default="Routine")
    status = Column(String, nullable=False, default="Pending")
    date = Column(String, nullable=False)


class RadiologyRequest(Base):
    __tablename__ = "radiology_requests"

    id = Column(String, primary_key=True)
    patient_name = Column(String, nullable=False, index=True)
    modality = Column(String, nullable=False)
    body_part = Column(String, nullable=False)
    status = Column(String, nullable=False, default="Scheduled")
    date = Column(String, nullable=False)
