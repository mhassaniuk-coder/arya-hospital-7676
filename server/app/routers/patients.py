from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.patient import Patient
from app.schemas.schemas import PatientCreate, PatientUpdate, PatientOut
import uuid

router = APIRouter(prefix="/api/patients", tags=["Patients"])


@router.get("/", response_model=list[PatientOut])
async def list_patients(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Patient).order_by(Patient.admission_date.desc()))
    return result.scalars().all()


@router.get("/{patient_id}", response_model=PatientOut)
async def get_patient(patient_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Patient).where(Patient.id == patient_id))
    patient = result.scalar_one_or_none()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient


@router.post("/", response_model=PatientOut)
async def create_patient(data: PatientCreate, db: AsyncSession = Depends(get_db)):
    patient = Patient(id=f"P-{uuid.uuid4().hex[:6].upper()}", **data.model_dump())
    db.add(patient)
    await db.flush()
    return patient


@router.put("/{patient_id}", response_model=PatientOut)
async def update_patient(patient_id: str, data: PatientUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Patient).where(Patient.id == patient_id))
    patient = result.scalar_one_or_none()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    for key, val in data.model_dump(exclude_unset=True).items():
        setattr(patient, key, val)
    await db.flush()
    return patient


@router.delete("/{patient_id}")
async def delete_patient(patient_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Patient).where(Patient.id == patient_id))
    patient = result.scalar_one_or_none()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    await db.delete(patient)
    return {"detail": "Deleted"}


@router.patch("/{patient_id}/archive", response_model=PatientOut)
async def archive_patient(patient_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Patient).where(Patient.id == patient_id))
    patient = result.scalar_one_or_none()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    patient.urgency = "LOW"
    patient.condition = f"Archived: {patient.condition}"
    await db.flush()
    return patient


@router.patch("/{patient_id}/restore", response_model=PatientOut)
async def restore_patient(patient_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Patient).where(Patient.id == patient_id))
    patient = result.scalar_one_or_none()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    patient.condition = patient.condition.replace("Archived: ", "")
    await db.flush()
    return patient
