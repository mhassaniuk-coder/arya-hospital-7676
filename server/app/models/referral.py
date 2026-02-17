from sqlalchemy import Column, String
from app.database import Base


class Referral(Base):
    __tablename__ = "referrals"

    id = Column(String, primary_key=True)
    patient_name = Column(String, nullable=False, index=True)
    direction = Column(String, nullable=False)  # Inbound / Outbound
    hospital = Column(String, nullable=False)
    reason = Column(String, nullable=False)
    status = Column(String, nullable=False, default="Pending")
    date = Column(String, nullable=False)


class MedicalCertificate(Base):
    __tablename__ = "medical_certificates"

    id = Column(String, primary_key=True)
    patient_name = Column(String, nullable=False, index=True)
    type = Column(String, nullable=False)  # Sick Leave / Fitness
    issue_date = Column(String, nullable=False)
    doctor = Column(String, nullable=False)
    status = Column(String, nullable=False, default="Draft")
