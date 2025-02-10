package app.musimate.service.dtos

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonValue
import org.springframework.data.domain.Page
import org.springframework.data.domain.Sort.Direction
import org.springframework.web.bind.annotation.RequestParam


@JsonFormat
enum class PaginationSortingOrder(@JsonValue val raw: String) {
    ASCENDING("asc"),
    DESCENDING("desc");

    fun toDirection() = when (this) {
        ASCENDING -> Direction.ASC
        DESCENDING -> Direction.DESC
    }
}

data class PaginationQuery(
    @RequestParam(required = false)
    val page: Int = 0,

    @RequestParam(required = false)
    val size: Int = Constants.DEFAULT_PAGE_SIZE,

    @RequestParam(required = false)
    val order: PaginationSortingOrder = Constants.DEFAULT_PAGE_ORDER,
)

data class PaginatedResponse<T>(
    val content: List<T>,
    val page: Int,
    val size: Int,
    val order: PaginationSortingOrder,
    val pageCount: Int,
)

fun <T> PaginatedResponse(page: Page<T>, order: PaginationSortingOrder): PaginatedResponse<T> {
    return PaginatedResponse(
        content = page.content,
        page = page.number,
        size = page.size,
        order = order,
        pageCount = page.totalPages
    )
}

private object Constants {
    const val DEFAULT_PAGE_SIZE = 10
    val DEFAULT_PAGE_ORDER = PaginationSortingOrder.ASCENDING
}