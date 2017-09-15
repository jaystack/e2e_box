Feature: Products api


Scenario: GET "/products"

Given the product database contains the following items
  |name          |price  |
  |Ribeye steak  |8      |
  |Sirloin steak |6      |
When I issue a GET request to "/products"
Then I receive the following JSON response
"""
[
  {
    "name": "Ribeye steak",
    "price": "8"
  },
  {
    "name": "Sirloin steak",
    "price": "6"
  }
]
"""
