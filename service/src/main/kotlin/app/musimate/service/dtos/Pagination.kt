package app.musimate.service.dtos

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonValue
import org.springframework.data.domain.Page
import org.springframework.data.domain.Sort.Direction
import org.springframework.web.bind.annotation.RequestParam

data class PaginationQuery(
    @RequestParam(required = false)
    val page: Int = 0,

    @RequestParam(required = false)
    val size: Int = Constants.DEFAULT_PAGE_SIZE,
)

data class PaginatedResponse<T>(
    val content: List<T>,
    val page: Int,
    val pageSize: Int,
    val pageCount: Int,
)

fun <T> PaginatedResponse(page: Page<T>): PaginatedResponse<T> {
    return PaginatedResponse(
        content = page.content,
        page = page.number,
        pageSize = page.content.size,
        pageCount = page.totalPages
    )
}

private object Constants {
    const val DEFAULT_PAGE_SIZE = 10
}