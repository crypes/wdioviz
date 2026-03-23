Feature: The Internet Login

  Scenario: Successful login
    Given I am on the login page
    When I login with valid credentials
    Then I should see the secure area
    Then the page visually matches "full" screenshot "accounts/summary/abc"
