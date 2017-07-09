Feature: Product list


Background:

  Given a website to accept visitors
  Given the product database contains the following items
  |name          |price  |
  |Picalilly     |4      |
  |Ribeye steak  |8      |
  |Sirloin steak |6      |
  |Rocket salad  |2      |

Scenario: Adding items to the cart multiple times
  Given I navigate to the product page
  Then I see "4" items in the product list
  When I put the "Picalilly" product in my cart
  Then I see "1" items in my cart
   And the total cart value is "£ 4"
  When I put the "Picalilly" product in my cart
  Then I see "2" items in my cart
   And the total cart value is "£ 8"
  When I put the "Sirloin steak" product in my cart
  Then I see "3" items in my cart
   And the total cart value is "£ 14"


Scenario Outline: Adding items to the cart multiple times

  Given I navigate to the product page
  When I put the "<name>" product in my cart
  Then I see "1" items in my cart
   And the total cart value is "<value>"

  Examples:
  |name          |value    |
  |Picalilly     |£ 4      |
  |Ribeye steak  |£ 8      |
  |Sirloin steak |£ 6      |
  |Rocket salad  |£ 2      |