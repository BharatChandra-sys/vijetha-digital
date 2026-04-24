from app.core.exceptions import NotFoundException, OrderStateException


def test_order_state_exception_details():
    exc = OrderStateException("placed", "delivered")
    assert exc.status_code == 400
    assert exc.detail["current"] == "placed"
    assert exc.detail["attempted"] == "delivered"


def test_not_found_exception_message():
    exc = NotFoundException("Order", "VJ-1001")
    assert exc.status_code == 404
    assert "VJ-1001" in exc.message
