let cart = {
  items: [],
  total: 0,
};

function addToCart(productId) {
  fetch(`https://careeco.onrender.com/api/products/${productId}`)
    .then((response) => response.json())
    .then((product) => {
      const existingItem = cart.items.find((item) => item._id === productId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.items.push({
          ...product,
          quantity: 1,
        });
      }

      updateCart();
      showNotification("Product added to cart");
    });
}

function updateCart() {
  cart.total = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  document.getElementById("cart-count").textContent = cart.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = cart.items
    .map(
      (item) => `
        <div class="flex items-center justify-between py-2">
          <div>
            <h4 class="font-semibold">${item.name}</h4>
            <p class="text-sm text-gray-600">Qty: ${item.quantity}</p>
          </div>
          <div class="flex items-center">
            <span class="font-bold">$${(item.price * item.quantity).toFixed(
              2
            )}</span>
            <button onClick="removeFromCart('${
              item._id
            }')" class="ml-2 text-red-500 hover:text-red-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      `
    )
    .join("");

  document.getElementById("cart-total").textContent = `$${cart.total.toFixed(
    2
  )}`;
  localStorage.setItem("cart", JSON.stringify(cart));
}

function removeFromCart(productId) {
  cart.items = cart.items.filter((item) => item.id !== productId);
  updateCart();
  showNotification("Product removed from cart");
}

function showNotification(message) {
  const notification = document.createElement("div");
  notification.className =
    "fixed bottom-4 right-4 bg-primary text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 translate-y-0";
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.transform = "translateY(200%)";
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

function showCheckout() {
  document.getElementById("checkout-modal").classList.remove("hidden");
  initializeStripe();
}

function hideCheckout() {
  document.getElementById("checkout-modal").classList.add("hidden");
}

function initializeStripe() {
  const stripe = Stripe(
    "pk_test_51OsQx4SF7WhPrPmVkQOrl6QAECtZ5QMyjNj5kj9E751zQT4lftF41wI8JrYIGlOXzq07lVJwowSnDjwYFhft8x3J00AlYcAPMw"
  );
  const elements = stripe.elements();
  const card = elements.create("card");
  card.mount("#card-element");

  const form = document.getElementById("payment-form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const { token, error } = await stripe.createToken(card);

    if (error) {
      const errorElement = document.getElementById("card-errors");
      errorElement.textContent = error.message;
    } else {
      const response = await fetch(
        "https://careeco.onrender.com/api/create-payment-intent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: cart.total * 100,
            currency: "usd",
          }),
        }
      );

      const { clientSecret } = await response.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            name: "Customer Name",
          },
        },
      });

      if (result.error) {
        const errorElement = document.getElementById("card-errors");
        errorElement.textContent = result.error.message;
      } else {
        if (result.paymentIntent.status === "succeeded") {
          cart = { items: [], total: 0 };
          updateCart();
          hideCheckout();
          showNotification("Order completed successfully!");
        }
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCart();
  }
});

document
  .getElementById("contact-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const businessName = document.querySelector("header a").textContent;

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    fetch("https://careeco.onrender.com/api/email/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        businessName,
        name,
        email,
        message,
      }),
    })
      .then(response)
      .then((data) => {
        if (data) {
          alert("Your message has been sent successfully!");
        } else {
          alert("There was an issue sending your message.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("There was an error, please try again later.");
      });
  });
