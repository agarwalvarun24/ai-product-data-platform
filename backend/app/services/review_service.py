from sqlalchemy.orm import Session

from app.models.product import Product
from app.models.review import Review


def create_review(
    db: Session,
    product_id: str,
    action: str,
    comment: str | None = None,
):
    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        return None

    review = Review(
        product_id=product_id,
        action=action,
        comment=comment,
    )

    db.add(review)

    if action == "approve":
        product.review_status = "approved"

    elif action == "reject":
        product.review_status = "rejected"

    elif action == "edit":
        product.review_status = "edited"

    db.commit()
    db.refresh(review)

    return review