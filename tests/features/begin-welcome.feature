Feature: Website main page

Background:
 Given a website to accept visitors

Scenario: Visitors are welcomed
 When  I open the main page
 Then I see a welcome message saying "Welcome to React"

