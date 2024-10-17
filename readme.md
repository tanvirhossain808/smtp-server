# Email Campaign Manager

An application that manages SMTP email sending and campaigns with integrated login and signup functionality. This tool allows users to add, update, and delete SMTP servers (Gmail, Yahoo, Hotmail, HostingMail) and maintain student email lists. Users can create campaigns, manage sent emails, and handle replies via IMAP.

## Features

-   **Login/Signup**: User authentication to securely access the application.
-   **SMTP Management**:
    -   Add, update, and delete SMTP configurations (Gmail, Yahoo, Hotmail, HostingMail).
-   **Student Email Lists**:
    -   Create, update, and delete email lists.
    -   Supports multiple lists like **Student Email List 1**, **Student Email List 2**, etc.
    -   Example addition: Add an email with a message like `assalamu alaikum`.
-   **Campaign Management**:

    -   Create, update, and delete email campaigns.
    -   Assign SMTP servers and email lists to campaigns.
    -   Toggle campaigns ON/OFF.
    -   Define campaign details such as From Name, Subject, SMTP server selection (via dropdown), and Student Email List selection.

-   **Email Sending**:
    -   Manage sent emails (1-9) and track sent status.
-   **IMAP Integration**:
    -   Reply to emails directly through IMAP.
    -   Example: `example@mail.com` replies with content like `walaikum assalam`.
    -   Sent and replied emails stored in the database.

## Usage

1. **SMTP Configuration**:
    - Set up your SMTP details for Gmail, Yahoo, Hotmail, or other hosting mail.
2. **Managing Email Lists**:
    - Add student emails to different lists, and manage them (update/delete).
3. **Creating a Campaign**:
    - Select an SMTP server from the dropdown, choose a student email list, and define your email's subject and content.
    - Activate or deactivate campaigns using the ON/OFF toggle.
4. **Sending Emails**:
    - Track emails sent to your student lists. The app supports up to 9 sent emails per campaign.
5. **Handling Replies**:
    - Monitor replies to sent emails via IMAP and store them in the database for review.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/tanvirhossain808/smtp-server
    cd smtp-server
    ```
