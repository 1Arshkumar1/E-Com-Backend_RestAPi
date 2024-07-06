# E-COM-Backend-App/RESTApi

## Project Setup
 - Download the zip file and extract it.
 - Open the git bash terminal in this directory and run
    ```bash
      npm start  
    ```
 - Output will show that the server is live on port 3000.
 - Now we will test the api endpoints using Postman.
  1. Open Postman and create a new http request.
  2. To Register a New User as a Buyer/Seller:
     - Method: POST
     - Request: localhost:3000/auth/register
     - JSON Body
     ```bash
     {
       "username":"provide_a_username",
       "password":"set_a_password",
       "role":"seller_or_buyer
     }
     ```
  3. To Login as a buyer/seller:
     - Method: POST
     - Request: localhost:3000/auth/login
     - JSON Body:
     ```bash
     {
       "username":"your's username",
       "password":"your's password"
     }
     ```
  4. You will receive a token,use it for authentication for accessing the products by putting the values as API keys in header section:
      - key : "Authorization"
      - value : "your_token_number"
  
 ## Buyer Functionality
  5. To Search a Product by name/category:
     - Method: GET
     - Request(By Name): localhost:3000/api/products/search?name=Product1 (Change it according to your product name)
     - Request(By Category): localhost:3000/api/products/search?category=clothes (change it according to your category name)
 
  6. To view products as a buyer:
    - Method: GET
    - Request: localhost:3000/api/products
    - DO mention your token in header section (You would have received one while registering yourself as a buyer):
       - Key: "Authorization"
       - Value: "your_token"
 
 ## Cart Functionality
  
 7. To add product in cart as a buyer:
    - Method: POST
    - Request: localhost:3000/api/cart
    - JSON Body:
     ```bash
       {
          "productId": product id from product list,
         "quantity": no_of_items
       }
     ```
  8. To view the items in cart:
      - Method: GET
      - Request: localhost:3000/api/cart
  
  9. To remove the items in cart:
      - Method: DELETE
      - Request: localhost:3000/api/cart/product_id (Replace it with the product id you want to Remove)

  ## Seller Functionality

  10. To create a product as a seller:
      - Method: POST
      - Request: localhost:3000/api/products
      - JSON body:
      ```bash
       {
           "name": "product_name",
           "price": product_price,
           "category": "product_category",
           "description": "product_highlights",
           "discount": product_discount
       }
      ```
         
  11. To edit the Existing Product:
       - Method: PUT
       - Request: localhost:3000/api/products/product_id (Replace it with the product id you want to edit)
       -  JSON Body:
       ```bash
       {    
           "name": "product_name",
           "price": product_price,
           "category": "product_category",
           "description": "product_highlights",
           "discount": product_discount,
           "id": product_id
        }
       ```

   12. To delete a listed product:
        - Method: DELETE
        - Request: localhost:3000/api/products/product_id (Replace it with the product id you want to Delete)
  
