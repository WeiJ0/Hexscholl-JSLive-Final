import Swal from 'sweetalert2'

export const successAlert = (text) => {
    Swal.fire({
        icon: 'success',
        text: text,
    })
}

export const errorAlert = (text) => {
    Swal.fire({
        icon: 'error',
        text: text,
    })
}

export const productAlert = (data) => {
    const { id, category, description, title, price, origin_price, images } = data;
    return Swal.fire({
        title,
        text: description,
        html: `
            <div class="product__item">
                <h3 class="product__item__name text-start">${description}</h3>
                <h5 class="product__item__price-origan text-start">NT$${origin_price}</h5>
                <h4 class="product__item__price-discount text-start">NT$${price}</h4>
            </div>
        `,
        imageUrl: images,
        imageAlt: title,
        showCloseButton: true,
        confirmButtonText: '加入購物車',
    })
}