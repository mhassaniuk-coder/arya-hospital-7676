from sqlalchemy import Column, String, Integer, Float
from app.database import Base


class BloodUnit(Base):
    __tablename__ = "blood_units"

    id = Column(String, primary_key=True)
    group = Column(String, nullable=False)
    bags = Column(Integer, nullable=False, default=0)
    status = Column(String, nullable=False, default="Adequate")


class BloodBag(Base):
    __tablename__ = "blood_bags"

    id = Column(String, primary_key=True)
    blood_group = Column(String, nullable=False, index=True)
    donor_id = Column(String, nullable=True)
    donor_name = Column(String, nullable=True)
    collection_date = Column(String, nullable=False)
    expiry_date = Column(String, nullable=False)
    volume = Column(Float, nullable=False, default=450)
    status = Column(String, nullable=False, default="Available")
    location = Column(String, nullable=True)


class BloodDonor(Base):
    __tablename__ = "blood_donors"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False, index=True)
    age = Column(Integer, nullable=False)
    gender = Column(String, nullable=False)
    blood_group = Column(String, nullable=False)
    contact = Column(String, nullable=True)
    email = Column(String, nullable=True)
    address = Column(String, nullable=True)
    last_donation_date = Column(String, nullable=True)
    total_donations = Column(Integer, default=0)
    status = Column(String, nullable=False, default="Active")
    medical_conditions = Column(String, nullable=True)  # JSON string
    created_at = Column(String, nullable=True)


class BloodRequest(Base):
    __tablename__ = "blood_requests"

    id = Column(String, primary_key=True)
    patient_id = Column(String, nullable=True)
    patient_name = Column(String, nullable=False, index=True)
    blood_group = Column(String, nullable=False)
    units_required = Column(Integer, nullable=False)
    urgency = Column(String, nullable=False, default="Routine")
    department = Column(String, nullable=True)
    doctor = Column(String, nullable=True)
    status = Column(String, nullable=False, default="Pending")
    request_date = Column(String, nullable=False)
    required_date = Column(String, nullable=True)
    cross_match_status = Column(String, nullable=True)
    notes = Column(String, nullable=True)
    fulfilled_date = Column(String, nullable=True)
    fulfilled_units = Column(Integer, nullable=True)
