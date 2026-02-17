from sqlalchemy import Column, String, Float, JSON
from app.database import Base


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(String, primary_key=True)
    patient_name = Column(String, nullable=False, index=True)
    date = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(String, nullable=False, default="Pending")
    items = Column(JSON, nullable=True)  # list of strings
