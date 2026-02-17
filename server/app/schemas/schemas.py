from pydantic import BaseModel, EmailStr
from typing import Optional


# ── Auth ──
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "Staff"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: str
    name: str
    email: str
    role: str
    avatar: Optional[str] = None
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ── Patient ──
class PatientCreate(BaseModel):
    name: str
    age: int
    gender: str
    admission_date: str
    condition: str
    room_number: Optional[str] = None
    urgency: str = "MEDIUM"
    history: Optional[str] = None
    status: Optional[str] = "OPD"
    ward: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None

class PatientUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    condition: Optional[str] = None
    room_number: Optional[str] = None
    urgency: Optional[str] = None
    history: Optional[str] = None
    status: Optional[str] = None
    ward: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None

class PatientOut(BaseModel):
    id: str
    name: str
    age: int
    gender: str
    admission_date: str
    condition: str
    room_number: Optional[str] = None
    urgency: str
    history: Optional[str] = None
    status: Optional[str] = None
    ward: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    class Config:
        from_attributes = True


# ── Appointment ──
class AppointmentCreate(BaseModel):
    patient_name: str
    doctor_name: str
    time: str
    date: str
    type: str
    status: str = "Pending"
    is_online: bool = False

class AppointmentOut(BaseModel):
    id: str
    patient_name: str
    doctor_name: str
    time: str
    date: str
    type: str
    status: str
    is_online: bool
    class Config:
        from_attributes = True


# ── Invoice ──
class InvoiceCreate(BaseModel):
    patient_name: str
    date: str
    amount: float
    status: str = "Pending"
    items: Optional[list[str]] = None

class InvoiceOut(BaseModel):
    id: str
    patient_name: str
    date: str
    amount: float
    status: str
    items: Optional[list[str]] = None
    class Config:
        from_attributes = True


# ── Inventory ──
class InventoryCreate(BaseModel):
    name: str
    category: str
    stock: int
    unit: str
    last_updated: Optional[str] = None
    status: str = "In Stock"

class InventoryOut(BaseModel):
    id: str
    name: str
    category: str
    stock: int
    unit: str
    last_updated: Optional[str] = None
    status: str
    class Config:
        from_attributes = True


# ── Ambulance ──
class AmbulanceCreate(BaseModel):
    vehicle_number: str
    driver_name: str
    status: str = "Available"
    location: Optional[str] = None
    type: str = "BLS"

class AmbulanceOut(BaseModel):
    id: str
    vehicle_number: str
    driver_name: str
    status: str
    location: Optional[str] = None
    type: str
    class Config:
        from_attributes = True


# ── Staff / Doctor ──
class DoctorCreate(BaseModel):
    name: str
    specialty: str
    status: str = "Online"
    patients: int = 0
    image: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None

class DoctorOut(BaseModel):
    id: str
    name: str
    specialty: str
    status: str
    patients: int
    image: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    class Config:
        from_attributes = True


# ── Task ──
class TaskCreate(BaseModel):
    title: str
    assignee: str
    priority: str = "Medium"
    status: str = "Todo"

class TaskOut(BaseModel):
    id: str
    title: str
    assignee: str
    priority: str
    status: str
    class Config:
        from_attributes = True


# ── Bed ──
class BedCreate(BaseModel):
    ward: str
    number: str
    status: str = "Available"
    patient_name: Optional[str] = None
    type: str = "General"

class BedOut(BaseModel):
    id: str
    ward: str
    number: str
    status: str
    patient_name: Optional[str] = None
    type: str
    class Config:
        from_attributes = True


# ── Notice ──
class NoticeCreate(BaseModel):
    title: str
    content: str
    date: str
    priority: str = "Normal"

class NoticeOut(BaseModel):
    id: str
    title: str
    content: str
    date: str
    priority: str
    class Config:
        from_attributes = True


# ── Lab Request ──
class LabRequestCreate(BaseModel):
    patient_name: str
    test_name: str
    priority: str = "Routine"
    status: str = "Pending"
    date: str

class LabRequestOut(BaseModel):
    id: str
    patient_name: str
    test_name: str
    priority: str
    status: str
    date: str
    class Config:
        from_attributes = True


# ── Radiology ──
class RadiologyCreate(BaseModel):
    patient_name: str
    modality: str
    body_part: str
    status: str = "Scheduled"
    date: str

class RadiologyOut(BaseModel):
    id: str
    patient_name: str
    modality: str
    body_part: str
    status: str
    date: str
    class Config:
        from_attributes = True


# ── Referral ──
class ReferralCreate(BaseModel):
    patient_name: str
    direction: str
    hospital: str
    reason: str
    status: str = "Pending"
    date: str

class ReferralOut(BaseModel):
    id: str
    patient_name: str
    direction: str
    hospital: str
    reason: str
    status: str
    date: str
    class Config:
        from_attributes = True


# ── Medical Certificate ──
class CertificateCreate(BaseModel):
    patient_name: str
    type: str
    issue_date: str
    doctor: str
    status: str = "Draft"

class CertificateOut(BaseModel):
    id: str
    patient_name: str
    type: str
    issue_date: str
    doctor: str
    status: str
    class Config:
        from_attributes = True


# ── Research Trial ──
class TrialCreate(BaseModel):
    title: str
    phase: str
    participants: int = 0
    status: str = "Recruiting"
    lead_researcher: str

class TrialOut(BaseModel):
    id: str
    title: str
    phase: str
    participants: int
    status: str
    lead_researcher: str
    class Config:
        from_attributes = True


# ── Maternity ──
class MaternityCreate(BaseModel):
    name: str
    weeks_pregnant: int
    doctor: str
    status: str = "Ante-natal"
    room: Optional[str] = None

class MaternityOut(BaseModel):
    id: str
    name: str
    weeks_pregnant: int
    doctor: str
    status: str
    room: Optional[str] = None
    class Config:
        from_attributes = True


# ── OPD Queue ──
class QueueCreate(BaseModel):
    token_number: int
    patient_name: str
    doctor_name: str
    department: str
    status: str = "Waiting"
    wait_time: Optional[str] = None

class QueueUpdate(BaseModel):
    status: Optional[str] = None
    wait_time: Optional[str] = None

class QueueOut(BaseModel):
    id: str
    token_number: int
    patient_name: str
    doctor_name: str
    department: str
    status: str
    wait_time: Optional[str] = None
    class Config:
        from_attributes = True


# ── Blood Unit ──
class BloodUnitCreate(BaseModel):
    group: str
    bags: int
    status: str = "Adequate"

class BloodUnitOut(BaseModel):
    id: str
    group: str
    bags: int
    status: str
    class Config:
        from_attributes = True


# ── Blood Bag ──
class BloodBagCreate(BaseModel):
    blood_group: str
    donor_id: Optional[str] = None
    donor_name: Optional[str] = None
    collection_date: str
    expiry_date: str
    volume: float = 450
    status: str = "Available"
    location: Optional[str] = None

class BloodBagOut(BaseModel):
    id: str
    blood_group: str
    donor_id: Optional[str] = None
    donor_name: Optional[str] = None
    collection_date: str
    expiry_date: str
    volume: float
    status: str
    location: Optional[str] = None
    class Config:
        from_attributes = True


# ── Blood Donor ──
class BloodDonorCreate(BaseModel):
    name: str
    age: int
    gender: str
    blood_group: str
    contact: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    last_donation_date: Optional[str] = None
    total_donations: int = 0
    status: str = "Active"
    medical_conditions: Optional[str] = None
    created_at: Optional[str] = None

class BloodDonorOut(BaseModel):
    id: str
    name: str
    age: int
    gender: str
    blood_group: str
    contact: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    last_donation_date: Optional[str] = None
    total_donations: int
    status: str
    medical_conditions: Optional[str] = None
    created_at: Optional[str] = None
    class Config:
        from_attributes = True


# ── Blood Request ──
class BloodRequestCreate(BaseModel):
    patient_id: Optional[str] = None
    patient_name: str
    blood_group: str
    units_required: int
    urgency: str = "Routine"
    department: Optional[str] = None
    doctor: Optional[str] = None
    status: str = "Pending"
    request_date: str
    required_date: Optional[str] = None
    cross_match_status: Optional[str] = None
    notes: Optional[str] = None

class BloodRequestOut(BaseModel):
    id: str
    patient_id: Optional[str] = None
    patient_name: str
    blood_group: str
    units_required: int
    urgency: str
    department: Optional[str] = None
    doctor: Optional[str] = None
    status: str
    request_date: str
    required_date: Optional[str] = None
    cross_match_status: Optional[str] = None
    notes: Optional[str] = None
    fulfilled_date: Optional[str] = None
    fulfilled_units: Optional[int] = None
    class Config:
        from_attributes = True


# ── Dashboard Stats ──
class DashboardStats(BaseModel):
    total_patients: int
    total_appointments: int
    total_revenue: float
    pending_revenue: float
    total_staff: int
    available_beds: int
    occupied_beds: int
    pending_labs: int
    active_ambulances: int
