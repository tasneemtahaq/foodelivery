// One place for your business details.
// Change them here and the chatbot updates automatically.
export const BUSINESS = {
  name:           "Mama Soups",
  phone:          "0333-2287497",
  address:        "Hussaini Manzil, D'Cruze Lane, Mansfield Street, Saddar, Karachi",

  hoursText:      "Every day (Monday to Sunday), 5:00 PM to 11:30 PM",

  deliveryRadius: "12 km",
  deliveryTime:   "30 to 45 minutes",
  payments:       "Cash on Delivery, Bank Transfer, JazzCash and EasyPaisa (for the last three, the customer uploads a payment screenshot at checkout)",

  // Your top sellers: keep this list SHORT so "popular" means something.
  // Each item goes in its own quotes, with a comma after it.
  popularItems: [
    "Chicken Corn Soup (our best seller)",
    "Blue Fire Fries (very spicy and tangy)",
    "Pani Puri (spicy and tangy)",
    "Chatpata Fries (tangy and spicy)",
  ],

  // Taste notes. The bot uses these to describe food and match flavours.
  // This text is inside backticks, so it can run over many lines.
  menuNotes: `
- Chicken Corn Soup: our best seller
- Yakhni Soup: made with chicken
- Classic Salted Fries: classic and crispy
- Green Chilli Fries: mild spicy
- BBQ Fries: smoky and mild spicy
- Chatpata Fries: tangy and spicy
- Salsa Fries: tangy
- Cheese Fries: cheddar cheesy flavour
- Blue Fire Fries: very spicy and tangy
- Pani Puri: spicy and tangy
- Flavoured sodas (Blueberry, Apple, Orange, Lemon, Ice Cream Soda): refreshing and fizzy
`,

  // Put a REAL offer here when you run one, for example:
  // "Order any soup and fries together and get a free soda"
  // Leave it empty ("") when there is no offer. The bot will never invent one.
  currentOffer:   "",
};