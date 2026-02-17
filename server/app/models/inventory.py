from sqlalchemy import Column, String, Integer
from app.database import Base


class InventoryItem(Base):
    __tablename__ = "inventory"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False, index=True)
    category = Column(String, nullable=False)
    stock = Column(Integer, nullable=False, default=0)
    unit = Column(String, nullable=False)
    last_updated = Column(String, nullable=True)
    status = Column(String, nullable=False, default="In Stock")
