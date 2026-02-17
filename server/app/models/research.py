from sqlalchemy import Column, String, Integer
from app.database import Base


class ResearchTrial(Base):
    __tablename__ = "research_trials"

    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    phase = Column(String, nullable=False)
    participants = Column(Integer, default=0)
    status = Column(String, nullable=False, default="Recruiting")
    lead_researcher = Column(String, nullable=False)


class MaternityPatient(Base):
    __tablename__ = "maternity_patients"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False, index=True)
    weeks_pregnant = Column(Integer, nullable=False)
    doctor = Column(String, nullable=False)
    status = Column(String, nullable=False, default="Ante-natal")
    room = Column(String, nullable=True)


class QueueItem(Base):
    __tablename__ = "opd_queue"

    id = Column(String, primary_key=True)
    token_number = Column(Integer, nullable=False)
    patient_name = Column(String, nullable=False, index=True)
    doctor_name = Column(String, nullable=False)
    department = Column(String, nullable=False)
    status = Column(String, nullable=False, default="Waiting")
    wait_time = Column(String, nullable=True)
