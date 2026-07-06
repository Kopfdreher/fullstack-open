sequenceDiagram
    participant browser
    participant server

    Note right of browser: User types a note into the text field and clicks the Save button

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    activate server
    Note left of server: The server saves the new note to its 'notes' array
    server-->>browser: HTTP status code 302 (Redirect to /notes)
    deactivate server

    Note over browser, server: The reload chain starts here:

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: HTML document
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the css file
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: the JavaScript file
    deactivate server

    Note right of browser: The browser executes the JS code, which triggers the JSON data fetch

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{ "content": "Your new note", "date": "2026-07-06" }, ... ]
    deactivate server

    Note right of browser: The browser executes the callback function to render the updated notes list
