```mermaid
sequenceDiagram
    participant browser
    participant server
    
    Note right of browser: The user adds a new note
    Note right of browser: The note is added to the array
    
    Note right of browser: The new note is send to the server
    browser->>server: POST .../new_note_spa
    activate server
    server-->>browser: 201 Created
    deactivate server

    Note right of browser: The browser adds the new note to the notes list
```
