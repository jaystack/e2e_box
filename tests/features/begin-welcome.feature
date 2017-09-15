Feature: Website main page

Scenario: Visitors are welcomed
 Given a website to accept visitors
 When  I open the main page
 Then I see a welcome message saying "Welcome to React"

