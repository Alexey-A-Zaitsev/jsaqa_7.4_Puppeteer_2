Feature: Test cinema site
    Scenario: Should reserve one seat
        Given user is on cinema hall page
        When user selects day "2"
        When user selects hall "1"
        When user selects "1" free chairs
        When user click `book` button
        Then user sees the booked ticket
    
    Scenario: Should reserve some seats
        Given user is on cinema hall page
        When user selects day "2"
        When user selects hall "1"
        When user selects "3" free chairs
        When user click `book` button
        Then user sees the booked ticket
    
    Scenario: Shouldn't book one chair twice
        Given user is on cinema hall page
        When user selects day "2"
        When user selects hall "1"
        When user selects "1" free chairs
        When user click `book` button
        When user click `book` button
        When user return to cinema hall
        When user selects day "2"
        When user selects hall "1"
        Then button 'Booking' not active