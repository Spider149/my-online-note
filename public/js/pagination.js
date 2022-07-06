function pagination(current, totalPages) {
    const max = totalPages,
        delta = 1,
        left = current - delta,
        right = current + delta,
        rangeWithDots = [],
        range = [];

    let last;

    for (let i = 1; i <= max; i++) {
        if (i == 1 || i == max || (i >= left && i <= right)) {
            range.push(i);
        }
    }

    for (let i of range) {
        if (last) {
            if (i - last >= 2) {
                rangeWithDots.push("...");
            }
        }
        rangeWithDots.push(i);
        last = i;
    }
    return rangeWithDots;
}

export default function Pagination({
    paginationSelector,
    totalItems,
    pageSize = 10,
    onPageChange,
}) {
    this.pagination = document.querySelector(paginationSelector);
    this.numPages = Math.ceil(totalItems / pageSize);
    this.pageSize = pageSize;

    this.changePage = (page) => {
        this.pagination.innerHTML = "";
        const paginationArray = pagination(page + 1, this.numPages);
        for (let item of paginationArray) {
            const paginationItem = document.createElement("li");
            paginationItem.className = "pagination__item";
            paginationItem.innerHTML = item;

            if (item !== "...") {
                if (item == page + 1) {
                    paginationItem.classList.add("active");
                }
                paginationItem.addEventListener("click", () => {
                    this.handlePageChange(item - 1);
                });
            } else {
                paginationItem.classList.add("disabled");
            }
            this.pagination.appendChild(paginationItem);
        }
    };

    this.handlePageChange = async (page) => {
        await onPageChange(page, pageSize);
        this.changePage(page);
    };

    this.changePage(0);
}
