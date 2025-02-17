package app.musimate.service.dtos

import org.springframework.data.domain.Page
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
    val totalSize: Long
)

fun <T> PaginatedResponse(page: Page<T>): PaginatedResponse<T> {
    return PaginatedResponse(
        content = page.content,
        page = page.number,
        pageSize = page.content.size,
        pageCount = page.totalPages,
        totalSize = page.totalElements
    )
}

private object Constants {
    const val DEFAULT_PAGE_SIZE = 10
}