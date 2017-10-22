Feature: Todo input feature
  As a user of Todos with TDD
  I want to be able to enter a new todo item
  So that I can add to my list of things to do

  Scenario: See the todo input
    Given I am on the Todos with TDD page
    When I look for an element with class "new-todo"
    Then I should see a placeholder of "What needs to be done?"
