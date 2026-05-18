$(function () {
    const productsPerPage = 10;
    const $products = $(".onsale-product-card");
    const totalProducts = $products.length;
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    let currentPage = 1;

    function updateProducts() {
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;

        $products.hide();
        $products.slice(startIndex, endIndex).show();

        $("#pageIndicator").text(`Page ${currentPage} of ${totalPages}`);
        $("#prevPage").prop("disabled", currentPage === 1);
        $("#nextPage").prop("disabled", currentPage === totalPages);
    }

    if (totalProducts === 0) {
        $(".onsale-pagination").hide();
        return;
    }

    if (totalPages <= 1) {
        $(".onsale-pagination").hide();
    }

    $("#nextPage").on("click", function () {
        if (currentPage < totalPages) {
            currentPage += 1;
            updateProducts();
        }
    });

    $("#prevPage").on("click", function () {
        if (currentPage > 1) {
            currentPage -= 1;
            updateProducts();
        }
    });

    updateProducts();
});
