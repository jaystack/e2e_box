Feature: Calculator

Scenario: Calculator computes sum value
 Given a user navigates to the site
 Then they see an input for the "x" value
  And an input for the "y" value
  And a button saying "Add"
 When the user puts "3" into the "x" value
  And "5" into the "y" value
  And presses the button
 Then the result "3+5=8" is displayed.

Scenario Outline: Calculator computes sum value with examples
 Given a user navigates to the site
 When the user sets X to <x> and Y to <y>
  And presses the button
 Then <result> is displayed as result.

 Examples:
    |   x   |   y   |   result    |
    |   3   |   5   |   3+5=8     |
    |   8   |   8   |   8+8=16    |
    |  19   |  10   |   19+10=29  |
