const btn = document.querySelector("button[type='button']");

btn?.addEventListener("click", (e) => {
  const csrf = e.target.nextElementSibling.value;
  const productId = e.target.nextElementSibling.nextElementSibling.value;
  const card = e.target.nextElementSibling.closest(".card");

  fetch(`/admin/product/${productId}`, {
    method: "GET",
    headers: {
      "psifi.x-csrf-token": csrf,
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((result) => {
      card.remove();
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
});
