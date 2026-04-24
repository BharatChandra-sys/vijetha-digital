from app.core.dependencies import get_pagination


def test_get_pagination_values():
    page = get_pagination(page=2, page_size=25)
    assert page["page"] == 2
    assert page["page_size"] == 25
    assert page["skip"] == 25
    assert page["limit"] == 25
