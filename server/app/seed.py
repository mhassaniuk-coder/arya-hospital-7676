"""Seed the database with initial mock data matching the frontend DataContext."""
import asyncio
from app.database import engine, async_session, Base
from app.models.user import User
from app.models.patient import Patient
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
from app.middleware.auth import hash_password


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as db:
        # ── Default Admin User ──
        db.add(User(id="admin-001", name="Admin", email="admin@nexushealth.com",
                     hashed_password=hash_password("admin123"), role="Admin",
                     avatar="https://ui-avatars.com/api/?name=Admin&background=0D9488&color=fff"))
        db.add(User(id="doc-001", name="Dr. Sarah Chen", email="sarah.chen@nexushealth.com",
                     hashed_password=hash_password("doctor123"), role="Doctor",
                     avatar="https://ui-avatars.com/api/?name=Sarah+Chen&background=0D9488&color=fff"))

        # ── Patients ──
        patients = [
            Patient(id="P-101", name="Sarah Johnson", age=34, gender="Female", admission_date="2023-10-24", condition="Migraine", room_number="304-A", urgency="MEDIUM", history="Chronic migraines since 2018."),
            Patient(id="P-102", name="Michael Chen", age=58, gender="Male", admission_date="2023-10-22", condition="Cardiac Arrest", room_number="ICU-02", urgency="CRITICAL", history="Hypertension, High Cholesterol."),
            Patient(id="P-103", name="Emily Davis", age=24, gender="Female", admission_date="2023-10-25", condition="Fractured Tibia", room_number="201-B", urgency="LOW", history="No major history."),
            Patient(id="P-104", name="James Wilson", age=45, gender="Male", admission_date="2023-10-23", condition="Pneumonia", room_number="305-C", urgency="HIGH", history="Smoker for 20 years."),
            Patient(id="P-105", name="Anita Patel", age=62, gender="Female", admission_date="2023-10-21", condition="Diabetes T2", room_number="104-A", urgency="MEDIUM", history="Insulin dependent."),
        ]
        db.add_all(patients)

        # ── Appointments ──
        db.add_all([
            Appointment(id="1", patient_name="Sarah Johnson", doctor_name="Dr. Chen", time="09:00 AM", date="Today", type="General Checkup", status="Confirmed", is_online=False),
            Appointment(id="2", patient_name="Mike Ross", doctor_name="Dr. Smith", time="10:30 AM", date="Today", type="Tele-Consult", status="Pending", is_online=True),
            Appointment(id="3", patient_name="Emma Watson", doctor_name="Dr. Chen", time="02:00 PM", date="Today", type="Follow-up", status="Confirmed", is_online=False),
            Appointment(id="4", patient_name="John Doe", doctor_name="Dr. House", time="04:15 PM", date="Tomorrow", type="Neurology", status="Cancelled", is_online=False),
        ])

        # ── Invoices ──
        db.add_all([
            Invoice(id="INV-001", patient_name="Sarah Johnson", date="2023-10-25", amount=450.00, status="Paid", items=["Consultation", "Blood Test"]),
            Invoice(id="INV-002", patient_name="Michael Chen", date="2023-10-24", amount=1250.00, status="Pending", items=["MRI Scan", "Consultation"]),
            Invoice(id="INV-003", patient_name="Emily Davis", date="2023-10-20", amount=120.00, status="Overdue", items=["Follow-up"]),
        ])

        # ── Inventory ──
        db.add_all([
            InventoryItem(id="MED-001", name="Paracetamol", category="Medicine", stock=500, unit="Tablets", last_updated="2023-10-25", status="In Stock"),
            InventoryItem(id="MED-002", name="Insulin", category="Medicine", stock=20, unit="Vials", last_updated="2023-10-24", status="Low Stock"),
            InventoryItem(id="SUP-001", name="Surgical Masks", category="Supply", stock=1000, unit="Pieces", last_updated="2023-10-20", status="In Stock"),
            InventoryItem(id="SUP-002", name="Gloves (L)", category="Supply", stock=0, unit="Boxes", last_updated="2023-10-22", status="Out of Stock"),
        ])

        # ── Ambulances ──
        db.add_all([
            Ambulance(id="1", vehicle_number="AMB-101", driver_name="John Doe", status="Available", location="Hospital Base", type="ALS"),
            Ambulance(id="2", vehicle_number="AMB-102", driver_name="Mike Smith", status="On Route", location="Downtown", type="BLS"),
            Ambulance(id="3", vehicle_number="AMB-103", driver_name="Sarah Connor", status="Maintenance", location="Workshop", type="ALS"),
            Ambulance(id="4", vehicle_number="AMB-104", driver_name="David Lee", status="Available", location="Station 2", type="BLS"),
        ])

        # ── Staff ──
        db.add_all([
            Doctor(id="1", name="Dr. Sarah Chen", specialty="Cardiology", status="Online", patients=12, image="https://picsum.photos/seed/doc1/200"),
            Doctor(id="2", name="Dr. Michael Ross", specialty="Neurology", status="In Surgery", patients=8, image="https://picsum.photos/seed/doc2/200"),
            Doctor(id="3", name="Dr. James Wilson", specialty="Oncology", status="Offline", patients=0, image="https://picsum.photos/seed/doc3/200"),
            Doctor(id="4", name="Dr. Emily House", specialty="General Surgery", status="On Break", patients=5, image="https://picsum.photos/seed/doc4/200"),
            Doctor(id="5", name="Dr. Lisa Cuddy", specialty="Administration", status="Online", patients=2, image="https://picsum.photos/seed/doc5/200"),
            Doctor(id="6", name="Dr. Eric Foreman", specialty="Neurology", status="Online", patients=15, image="https://picsum.photos/seed/doc6/200"),
        ])

        # ── Tasks ──
        db.add_all([
            Task(id="1", title="Review MRI Results for Bed 3", assignee="Dr. Chen", priority="High", status="Todo"),
            Task(id="2", title="Restock Insulin", assignee="Pharmacy", priority="Medium", status="Todo"),
            Task(id="3", title="Prepare Discharge Summary P-101", assignee="Nurse Joy", priority="Low", status="In Progress"),
            Task(id="4", title="Sanitize OT-2", assignee="Staff A", priority="High", status="Done"),
        ])

        # ── Beds ──
        for i in range(12):
            ward = "ICU" if i < 4 else "General Ward A"
            number = f"{'ICU' if i < 4 else 'G'}-{i + 1}"
            status = "Occupied" if i in [1, 5, 8] else ("Cleaning" if i == 2 else "Available")
            pname = {1: "John Doe", 5: "Jane Smith", 8: "Bob Jones"}.get(i)
            btype = "ICU" if i < 4 else "General"
            db.add(Bed(id=f"B-{i+1}", ward=ward, number=number, status=status, patient_name=pname, type=btype))

        # ── Notices ──
        db.add_all([
            Notice(id="1", title="System Maintenance", content="The server will be down for maintenance on Sunday 2 AM to 4 AM.", date="Oct 26", priority="Urgent"),
            Notice(id="2", title="New COVID Protocols", content="Please review the updated safety guidelines for the ICU.", date="Oct 25", priority="Normal"),
            Notice(id="3", title="Staff Meeting", content="General staff meeting on Friday at 3 PM in the Conference Hall.", date="Oct 24", priority="Normal"),
        ])

        # ── Lab Requests ──
        db.add_all([
            LabTestRequest(id="LAB-001", patient_name="Sarah Johnson", test_name="Complete Blood Count (CBC)", priority="Routine", status="Completed", date="2023-10-26"),
            LabTestRequest(id="LAB-002", patient_name="Michael Chen", test_name="Liver Function Test", priority="Urgent", status="Processing", date="2023-10-26"),
            LabTestRequest(id="LAB-003", patient_name="John Doe", test_name="Lipid Profile", priority="Routine", status="Sample Collected", date="2023-10-25"),
        ])

        # ── Radiology ──
        db.add_all([
            RadiologyRequest(id="RAD-001", patient_name="Anita Patel", modality="MRI", body_part="Brain", status="Report Ready", date="2023-10-26"),
            RadiologyRequest(id="RAD-002", patient_name="Emily Davis", modality="X-Ray", body_part="Left Tibia", status="Imaging", date="2023-10-26"),
            RadiologyRequest(id="RAD-003", patient_name="James Wilson", modality="CT Scan", body_part="Chest", status="Scheduled", date="2023-10-27"),
        ])

        # ── Referrals ──
        db.add_all([
            Referral(id="REF-001", patient_name="Jane Doe", direction="Outbound", hospital="City General", reason="Advanced Neurology", status="Accepted", date="2023-10-26"),
            Referral(id="REF-002", patient_name="Mark Smith", direction="Inbound", hospital="Rural Clinic A", reason="ICU Requirement", status="Pending", date="2023-10-25"),
        ])

        # ── Medical Certificates ──
        db.add_all([
            MedicalCertificate(id="MC-101", patient_name="Sarah Johnson", type="Sick Leave", issue_date="2023-10-26", doctor="Dr. Chen", status="Issued"),
            MedicalCertificate(id="MC-102", patient_name="Michael Chen", type="Fitness", issue_date="2023-10-25", doctor="Dr. Ross", status="Draft"),
        ])

        # ── Research Trials ──
        db.add_all([
            ResearchTrial(id="1", title="Cardio-X Drug Trial", phase="Phase III", participants=120, status="Active", lead_researcher="Dr. S. Chen"),
            ResearchTrial(id="2", title="Diabetes Management Study", phase="Phase I", participants=15, status="Recruiting", lead_researcher="Dr. J. Doe"),
        ])

        # ── Maternity ──
        db.add_all([
            MaternityPatient(id="1", name="Maria Garcia", weeks_pregnant=39, doctor="Dr. Cuddy", status="Labor", room="LDR-01"),
            MaternityPatient(id="2", name="Sarah Lee", weeks_pregnant=34, doctor="Dr. Cuddy", status="Ante-natal", room="302"),
        ])

        # ── OPD Queue ──
        db.add_all([
            QueueItem(id="1", token_number=101, patient_name="John Doe", doctor_name="Dr. Sarah Chen", department="Cardiology", status="In Consultation", wait_time="0m"),
            QueueItem(id="2", token_number=102, patient_name="Alice Smith", doctor_name="Dr. Sarah Chen", department="Cardiology", status="Waiting", wait_time="15m"),
            QueueItem(id="3", token_number=103, patient_name="Bob Brown", doctor_name="Dr. Sarah Chen", department="Cardiology", status="Waiting", wait_time="30m"),
        ])

        # ── Blood Units ──
        blood_units = [
            ("BU-001", "A+", 12, "Adequate"), ("BU-002", "A-", 3, "Low"),
            ("BU-003", "B+", 15, "Adequate"), ("BU-004", "B-", 2, "Critical"),
            ("BU-005", "O+", 20, "Adequate"), ("BU-006", "O-", 4, "Low"),
            ("BU-007", "AB+", 8, "Adequate"), ("BU-008", "AB-", 1, "Critical"),
        ]
        db.add_all([BloodUnit(id=bu[0], group=bu[1], bags=bu[2], status=bu[3]) for bu in blood_units])

        # ── Blood Bags ──
        db.add_all([
            BloodBag(id="BB-001", blood_group="A+", donor_id="D-001", donor_name="John Smith", collection_date="2024-01-15", expiry_date="2024-02-15", volume=450, status="Available", location="Freezer A-1"),
            BloodBag(id="BB-002", blood_group="A+", donor_id="D-002", donor_name="Mary Johnson", collection_date="2024-01-16", expiry_date="2024-02-16", volume=450, status="Available", location="Freezer A-1"),
            BloodBag(id="BB-003", blood_group="B+", donor_id="D-003", donor_name="Robert Brown", collection_date="2024-01-14", expiry_date="2024-02-14", volume=450, status="Reserved", location="Freezer B-1"),
            BloodBag(id="BB-004", blood_group="O-", donor_id="D-004", donor_name="Sarah Wilson", collection_date="2024-01-17", expiry_date="2024-02-17", volume=450, status="Available", location="Freezer O-1"),
            BloodBag(id="BB-005", blood_group="O+", donor_id="D-005", donor_name="Michael Davis", collection_date="2024-01-10", expiry_date="2024-02-10", volume=450, status="Available", location="Freezer O-1"),
            BloodBag(id="BB-006", blood_group="AB+", donor_id="D-006", donor_name="Emily Chen", collection_date="2024-01-18", expiry_date="2024-02-18", volume=450, status="Available", location="Freezer AB-1"),
        ])

        # ── Blood Donors ──
        db.add_all([
            BloodDonor(id="D-001", name="John Smith", age=32, gender="Male", blood_group="A+", contact="555-0101", email="john.smith@email.com", address="123 Main St, City", last_donation_date="2024-01-15", total_donations=5, status="Active", created_at="2023-06-15"),
            BloodDonor(id="D-002", name="Mary Johnson", age=28, gender="Female", blood_group="A+", contact="555-0102", email="mary.j@email.com", address="456 Oak Ave, Town", last_donation_date="2024-01-16", total_donations=3, status="Active", created_at="2023-08-20"),
            BloodDonor(id="D-003", name="Robert Brown", age=45, gender="Male", blood_group="B+", contact="555-0103", email="rbrown@email.com", address="789 Pine Rd, Village", last_donation_date="2024-01-14", total_donations=8, status="Active", created_at="2022-01-10"),
            BloodDonor(id="D-004", name="Sarah Wilson", age=35, gender="Female", blood_group="O-", contact="555-0104", email="swilson@email.com", address="321 Elm St, City", last_donation_date="2024-01-17", total_donations=12, status="Active", created_at="2021-03-22"),
            BloodDonor(id="D-005", name="Michael Davis", age=40, gender="Male", blood_group="O+", contact="555-0105", email="mdavis@email.com", address="654 Cedar Ln, Town", last_donation_date="2024-01-10", total_donations=6, status="Active", created_at="2022-11-05"),
            BloodDonor(id="D-006", name="Emily Chen", age=26, gender="Female", blood_group="AB+", contact="555-0106", email="echen@email.com", address="987 Birch Dr, City", last_donation_date="2024-01-18", total_donations=2, status="Active", created_at="2023-09-12"),
            BloodDonor(id="D-007", name="David Lee", age=50, gender="Male", blood_group="B-", contact="555-0107", email="dlee@email.com", address="147 Maple Way, Village", last_donation_date="2023-12-01", total_donations=15, status="Deferred", medical_conditions="High blood pressure", created_at="2020-05-18"),
        ])

        # ── Blood Requests ──
        db.add_all([
            BloodRequest(id="BR-001", patient_id="P-102", patient_name="Michael Chen", blood_group="B-", units_required=2, urgency="Emergency", department="ICU", doctor="Dr. Sarah Chen", status="Pending", request_date="2024-01-20", required_date="2024-01-20", cross_match_status="Pending", notes="Cardiac surgery scheduled"),
            BloodRequest(id="BR-002", patient_id="P-108", patient_name="Lisa Anderson", blood_group="A+", units_required=1, urgency="Routine", department="Surgery", doctor="Dr. Michael Ross", status="Approved", request_date="2024-01-19", required_date="2024-01-22", cross_match_status="Compatible"),
            BloodRequest(id="BR-003", patient_id="P-109", patient_name="James Taylor", blood_group="O-", units_required=3, urgency="Urgent", department="Emergency", doctor="Dr. Emily House", status="Fulfilled", request_date="2024-01-18", required_date="2024-01-18", cross_match_status="Compatible", fulfilled_date="2024-01-18", fulfilled_units=3),
        ])

        await db.commit()
        print("✅ Database seeded successfully with all mock data!")


if __name__ == "__main__":
    asyncio.run(seed())
