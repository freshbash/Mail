import React from "react";

const Inbox = () => {
  return (
    <div>
      {/* <h2>{{ request.user.email }}</h2>*/}

      <ul class="my-4 nav nav-tabs" id="myTab" role="tablist">
        <div class="d-flex justify-content-between w-100">
          <div class="d-flex flex-column flex-sm-row">
            <li class="nav-item" role="presentation">
              <button
                class="nav-link active"
                id="inbox"
                data-bs-toggle="tab"
                data-bs-target="#inbox-tab-pane"
                type="button"
                role="tab"
                aria-controls="home-tab-pane"
                aria-selected="true"
              >
                Inbox
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                id="compose"
                data-bs-toggle="tab"
                data-bs-target="#compose-tab-pane"
                type="button"
                role="tab"
                aria-controls="profile-tab-pane"
                aria-selected="false"
              >
                Compose
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                id="sent"
                data-bs-toggle="tab"
                data-bs-target="#sent-tab-pane"
                type="button"
                role="tab"
                aria-controls="contact-tab-pane"
                aria-selected="false"
              >
                Sent
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                id="archived"
                data-bs-toggle="tab"
                data-bs-target="#archived-tab-pane"
                type="button"
                role="tab"
                aria-controls="disabled-tab-pane"
                aria-selected="false"
              >
                Archived
              </button>
            </li>
          </div>
          <div>
            <li class="nav-item" role="presentation">
              <a class="nav-link" href="{% url 'logout' %}" id="logout">
                Log Out
              </a>
            </li>
          </div>
        </div>
      </ul>

      <div id="confirmation"></div>

      <div id="emails-view"></div>

      <div id="email-content-view">
        <div class="d-flex justify-content-between">
          <div id="details">
            <div>
              <label class="fw-bold">From: </label>
              <label id="from"></label>
            </div>
            <div>
              <label class="fw-bold">To: </label>
              <label id="to"></label>
            </div>
            <div>
              <label class="fw-bold">Subject: </label>
              <label id="subject"></label>
            </div>
            <div>
              <label class="fw-bold">Timestamp: </label>
              <label id="timestamp"></label>
            </div>
          </div>
          <div class="d-flex flex-column flex-sm-row justify-content-between">
            <button type="submit" class="btn" id="reply">
              <i class="bi bi-reply"></i>
            </button>
            <button type="reset" class="btn" id="archive"></button>
            <button type="button" class="btn" id="delete">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
        <div class="border border-2 border-dark my-4"></div>
        <div>
          <textarea class="px-2 py-2" disabled id="body"></textarea>
        </div>
      </div>

      <div id="compose-view">
        <h3>New Email</h3>
        <form id="compose-form">
          <div class="input-group mb-3">
            <span class="fw-bold input-group-text" id="compose-field-label">
              From
            </span>
            <input
              id="sender"
              type="text"
              class="form-control"
              placeholder="{{ request.user.email }}"
              aria-label="Sender"
              aria-describedby="compose-field-label"
              disabled
            />
          </div>

          <div class="input-group mb-3">
            <span class="fw-bold input-group-text" id="compose-field-label">
              To
            </span>
            <input
              id="compose-recipients"
              type="text"
              class="form-control"
              aria-label="Recipient(s)"
              aria-describedby="compose-field-label"
            />
          </div>

          <div class="input-group mb-3">
            <span class="fw-bold input-group-text" id="compose-field-label">
              Subject
            </span>
            <input
              id="compose-subject"
              type="text"
              class="form-control"
              aria-label="Email subject"
              aria-describedby="compose-field-label"
            />
          </div>

          <div class="input-group">
            <span class="fw-bold input-group-text" id="compose-field-label">
              Body
            </span>
            <textarea
              id="compose-body"
              class="form-control"
              aria-label="email body"
              style={{ height: "200px" }}
            ></textarea>
          </div>

          <div class="d-flex justify-content-end my-4">
            <input
              type="submit"
              class="btn btn-dark"
              id="send"
              value="Send Email"
            />
          </div>
        </form>
      </div>

      <script src="{% static 'mail/inbox.js' %}"></script>
    </div>
  );
};

export default Inbox;
