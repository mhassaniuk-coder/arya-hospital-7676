"""Generic CRUD router factory — generates list/get/create/update/delete for any model+schema pair."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
import uuid


def create_crud_router(
    prefix: str,
    tag: str,
    model_class,
    create_schema,
    out_schema,
    id_prefix: str = "",
    update_schema=None,
):
    router = APIRouter(prefix=f"/api/{prefix}", tags=[tag])

    @router.get("/", response_model=list[out_schema])
    async def list_all(db: AsyncSession = Depends(get_db)):
        result = await db.execute(select(model_class))
        return result.scalars().all()

    @router.get("/{item_id}", response_model=out_schema)
    async def get_one(item_id: str, db: AsyncSession = Depends(get_db)):
        result = await db.execute(select(model_class).where(model_class.id == item_id))
        item = result.scalar_one_or_none()
        if not item:
            raise HTTPException(status_code=404, detail=f"{tag} not found")
        return item

    @router.post("/", response_model=out_schema)
    async def create(data: create_schema, db: AsyncSession = Depends(get_db)):
        item_id = f"{id_prefix}{uuid.uuid4().hex[:6].upper()}" if id_prefix else str(uuid.uuid4())
        item = model_class(id=item_id, **data.model_dump())
        db.add(item)
        await db.flush()
        return item

    @router.put("/{item_id}", response_model=out_schema)
    async def update(item_id: str, data: create_schema if not update_schema else update_schema, db: AsyncSession = Depends(get_db)):
        result = await db.execute(select(model_class).where(model_class.id == item_id))
        item = result.scalar_one_or_none()
        if not item:
            raise HTTPException(status_code=404, detail=f"{tag} not found")
        for key, val in data.model_dump(exclude_unset=True).items():
            setattr(item, key, val)
        await db.flush()
        return item

    @router.delete("/{item_id}")
    async def delete(item_id: str, db: AsyncSession = Depends(get_db)):
        result = await db.execute(select(model_class).where(model_class.id == item_id))
        item = result.scalar_one_or_none()
        if not item:
            raise HTTPException(status_code=404, detail=f"{tag} not found")
        await db.delete(item)
        return {"detail": "Deleted"}

    return router
