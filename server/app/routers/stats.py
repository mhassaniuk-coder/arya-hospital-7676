from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database import get_db
from app.models.patient import Patient
from app.models.appointment import Appointment
from app.models.invoice import Invoice
from app.models.staff import Doctor
from app.models.task import Bed
from app.models.lab import LabTestRequest
from app.models.ambulance import Ambulance
from app.schemas.schemas import DashboardStats

router = APIRouter(prefix="/api/stats", tags=["Dashboard Stats"])


@router.get("/", response_model=DashboardStats)
async def get_stats(db: AsyncSession = Depends(get_db)):
    total_patients = (await db.execute(select(func.count(Patient.id)))).scalar() or 0
    total_appointments = (await db.execute(
        select(func.count(Appointment.id)).where(Appointment.status != "Cancelled")
    )).scalar() or 0

    invoices = (await db.execute(select(Invoice))).scalars().all()
    total_revenue = sum(i.amount for i in invoices if i.status == "Paid")
    pending_revenue = sum(i.amount for i in invoices if i.status == "Pending")

    total_staff = (await db.execute(select(func.count(Doctor.id)))).scalar() or 0

    beds = (await db.execute(select(Bed))).scalars().all()
    available_beds = sum(1 for b in beds if b.status == "Available")
    occupied_beds = sum(1 for b in beds if b.status == "Occupied")

    pending_labs = (await db.execute(
        select(func.count(LabTestRequest.id)).where(LabTestRequest.status.in_(["Pending", "Processing", "Sample Collected"]))
    )).scalar() or 0

    active_ambulances = (await db.execute(
        select(func.count(Ambulance.id)).where(Ambulance.status == "On Route")
    )).scalar() or 0

    return DashboardStats(
        total_patients=total_patients,
        total_appointments=total_appointments,
        total_revenue=total_revenue,
        pending_revenue=pending_revenue,
        total_staff=total_staff,
        available_beds=available_beds,
        occupied_beds=occupied_beds,
        pending_labs=pending_labs,
        active_ambulances=active_ambulances,
    )
