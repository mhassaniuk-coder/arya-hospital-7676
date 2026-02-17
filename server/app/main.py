from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.database import init_db

# Import routers
from app.routers.auth import router as auth_router
from app.routers.patients import router as patients_router
from app.routers.stats import router as stats_router
from app.routers.ai import router as ai_router
from app.routers.advanced_ai import router as advanced_ai_router

# Import CRUD factory + models + schemas for all entities
from app.routers.crud_factory import create_crud_router
from app.models.appointment import Appointment
from app.models.invoice import Invoice
from app.models.inventory import InventoryItem
from app.models.ambulance import Ambulance
from app.models.staff import Doctor
from app.models.task import Task, Bed, Notice
from app.models.lab import LabTestRequest, RadiologyRequest
from app.models.referral import Referral, MedicalCertificate
from app.models.research import ResearchTrial, MaternityPatient, QueueItem
from app.models.blood_bank import BloodUnit, BloodBag, BloodDonor, BloodRequest
from app.schemas.schemas import (
    AppointmentCreate, AppointmentOut,
    InvoiceCreate, InvoiceOut,
    InventoryCreate, InventoryOut,
    AmbulanceCreate, AmbulanceOut,
    DoctorCreate, DoctorOut,
    TaskCreate, TaskOut,
    BedCreate, BedOut,
    NoticeCreate, NoticeOut,
    LabRequestCreate, LabRequestOut,
    RadiologyCreate, RadiologyOut,
    ReferralCreate, ReferralOut,
    CertificateCreate, CertificateOut,
    TrialCreate, TrialOut,
    MaternityCreate, MaternityOut,
    QueueCreate, QueueOut,
    BloodUnitCreate, BloodUnitOut,
    BloodBagCreate, BloodBagOut,
    BloodDonorCreate, BloodDonorOut,
    BloodRequestCreate, BloodRequestOut,
)

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables
    await init_db()
    yield
    # Shutdown: cleanup if needed


app = FastAPI(
    title="Arya Hospital HMS API",
    description="Full backend API for Arya Hospital Management System",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Core Routers ──
app.include_router(auth_router)
app.include_router(patients_router)
app.include_router(stats_router)
app.include_router(ai_router)
app.include_router(advanced_ai_router)

# ── Generated CRUD Routers ──
crud_configs = [
    ("appointments", "Appointments", Appointment, AppointmentCreate, AppointmentOut, "APT-"),
    ("invoices", "Invoices", Invoice, InvoiceCreate, InvoiceOut, "INV-"),
    ("inventory", "Inventory", InventoryItem, InventoryCreate, InventoryOut, "ITM-"),
    ("ambulances", "Ambulances", Ambulance, AmbulanceCreate, AmbulanceOut, "AMB-"),
    ("staff", "Staff", Doctor, DoctorCreate, DoctorOut, ""),
    ("tasks", "Tasks", Task, TaskCreate, TaskOut, ""),
    ("beds", "Beds", Bed, BedCreate, BedOut, "B-"),
    ("notices", "Notices", Notice, NoticeCreate, NoticeOut, ""),
    ("lab-requests", "Lab Requests", LabTestRequest, LabRequestCreate, LabRequestOut, "LAB-"),
    ("radiology", "Radiology", RadiologyRequest, RadiologyCreate, RadiologyOut, "RAD-"),
    ("referrals", "Referrals", Referral, ReferralCreate, ReferralOut, "REF-"),
    ("certificates", "Medical Certificates", MedicalCertificate, CertificateCreate, CertificateOut, "MC-"),
    ("research-trials", "Research Trials", ResearchTrial, TrialCreate, TrialOut, ""),
    ("maternity", "Maternity", MaternityPatient, MaternityCreate, MaternityOut, ""),
    ("opd-queue", "OPD Queue", QueueItem, QueueCreate, QueueOut, "Q-"),
    ("blood-units", "Blood Units", BloodUnit, BloodUnitCreate, BloodUnitOut, "BU-"),
    ("blood-bags", "Blood Bags", BloodBag, BloodBagCreate, BloodBagOut, "BB-"),
    ("blood-donors", "Blood Donors", BloodDonor, BloodDonorCreate, BloodDonorOut, "D-"),
    ("blood-requests", "Blood Requests", BloodRequest, BloodRequestCreate, BloodRequestOut, "BR-"),
]

for prefix, tag, model, create_schema, out_schema, id_prefix in crud_configs:
    r = create_crud_router(prefix, tag, model, create_schema, out_schema, id_prefix)
    app.include_router(r)


# ── Health Check ──
@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "Arya Hospital HMS API"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
