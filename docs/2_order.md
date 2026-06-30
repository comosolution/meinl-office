# Order Entry

## Start Page

You can start the ordering process by searching for any type of customer-related information (No, Name, Matchcode, Address…)

![Customer Search – start page with search field and customer result list showing columns Info, Customer No., Name, Matchcode, Address, Country, Type](/docs/order/AE_1.png)

Click on the desired customer to proceed.

## Main Page

At the top, you can choose between two ways of adding items:

![Navigation bar showing tabs: Customer Search, Cart/Order, BULK](/docs/order/AE_2.png)

- **Cart/Order** – for adding a single item
- **BULK** – for multi-order

### Cart/Order

The page consists of three sections:

![Main page overview with red customer info bar at top, green order data section in the middle, and blue shopping cart section at the bottom](/docs/order/AE_3.png)

| Color     | Section       | Description                                                                             |
| --------- | ------------- | --------------------------------------------------------------------------------------- |
| **Red**   | Customer Info | Information on the current customer – click "Customer Details" for detailed information |
| **Green** | Order Data    | Various sections for entering data                                                      |
| **Blue**  | Shopping Cart | Offers options to search, add, edit or remove items                                     |

## The Green Section

Per default, only "Order Data" is displayed, but you can add (or remove) "Address", "Starttext" and/or "Terms" by clicking the appropriate buttons.

### Order Data

Holds the order's header data:

![Order Data form with fields: Placed by, PO Number, Through, Buyer (with Edit checkbox), Comment, Order date, Desired shipping date](/docs/order/AE_4.png)

If the buyer cannot be found in the "Buyer" list, you can enter a new name in "Buyer" by checking the "Edit" box.

### Address

Holds delivery and billing address:

![Address section showing Delivery Address dropdown with full address details on the left and Billing Address on the right](/docs/order/AE_5.png)

You can select another address from the list, set delivery address = billing address, or enter a new address by selecting "Manual Input" from the list.

### Starttext

![Starttext form with fields: Starttext (AS400), Starttext (AS400 full), Invoice Special Instructions, Invoice text, Proforma Special Instructions, Proforma invoice text](/docs/order/AE_6.png)

### Terms

Holds the payment terms for the current order.

![Terms form with fields: Due on Date (date picker), Days until due, Terms (dropdown), Payment method (NET 30)](/docs/order/AE_7.png)

You can either:

- select a due date
- specify a timeframe within which the payment must be made, or
- choose from a list of terms

> Please note that entering/selecting one of the above options removes any previously entered/selected options.

"Payment Method" offers a list of options (optional).

## The Blue Section

### Searching for Items

Search for an item to add to the shopping cart:

![Product search bar with Art-No. only checkbox, search field, and result row showing Item-No., Stock, LIST price, NET price, Model, Product Name](/docs/order/AE_8.png)

Having the **Art-No. only** box checked, the search only searches for matches in Item-No. (incl. partial matches) – unchecked, also "Product Name" is searched.

### Item Detail

Clicking the select checkbox (✓) shows details for the selected item:

![Item detail panel showing Item-No., Item Name, Stock, Quantity, LIST price, discount percentages, NET price, Edit checkbox, Comment field, Free checkbox, You sold toggle, and Add button](/docs/order/AE_9.png)

- Check the **"Edit"** box to enter a desired NET price.
- Check the **"Free"** box to mark the item as free.
- Switch **"You sold"** to "Yes" if applicable.
- Click **"Add"** to add the current item to the shopping cart.

### Shopping Cart

All added items will appear in the shopping cart:

![Shopping cart showing Reload cart, Empty cart and Send order buttons, a table with columns POS, Item-No., Qty, LIST, % discounts, NET, Free, You sold, Comment, and a sum total](/docs/order/AE_10.png)

You can:

- edit single entries (✏️ pencil icon)
- delete them (🗑 trash icon)
- empty the whole cart — **"Empty Cart"** button
- place the order — **"Send Order"** button

## Bulk

Offers the possibility to enter multiple items at once. These items will be added via the "Add to Cart" button to the shopping cart and can be edited there afterwards.

![Bulk / Multi-Order view with a text area for entering product number and quantity pairs, Clear Form and Add to Cart buttons, and an instruction panel on the right showing valid delimiters and examples](/docs/order/AE_11.png)

The input format is compatible with common Excel table formats, so you can copy & paste a selection of 2 columns.

Each line must contain the product number and quantity, separated by a delimiter. End each line with the return key. The delimiter at line ending is optional.

**Valid delimiters:**

| Delimiter | Symbol |
| --------- | ------ |
| Space     | ` `    |
| Comma     | `,`    |
| Semicolon | `;`    |
| Tab       | `→`    |

**Example (Space):**

```
B13FH 1
HCAJ1NT 23
CH-TT28 456;
```

There are several examples listed on the right side of the Bulk view.
