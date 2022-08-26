document.addEventListener('DOMContentLoaded', function() {

  // By default, load the inbox
  load_mailbox('inbox');

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-content-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  // Wait for the user to click the 'send email' button.
  document.querySelector('#compose-form').onsubmit = () => {

    // Get the details from the form, namely, the recipient, the subject, and the body of the email, respectively.
    const R = document.querySelector('#compose-recipients').value;
    const S = document.querySelector('#compose-subject').value;
    const B = document.querySelector('#compose-body').value;

    //Make an asynchronous POST request to the API to save the email in the database.
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: R,
        subject: S,
        body: B
      })
    })
    .then(response => response.json())
    .then(result => {
      console.log(result);

      // Load the mailbox once the email has been sent.
      load_mailbox('sent');
    });
    // Prevent the page from refreshing.
    return false;
  }
}

// Function to load the mailbox: Inbox, sent, archive.
function load_mailbox(mailbox) {

  // Make an asynchronous GET request to the API to get all the emails for the particular mailbox.
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    console.log(emails);
    emails.forEach(email => {
      // Render each email.
      const outer_div = document.createElement('div');
      outer_div.className = 'email';
      if(email.read){
        outer_div.style.backgroundColor = 'lightgrey';
      } else {
        outer_div.style.backgroundColor = 'white';
      }
      
      const top = document.createElement('div');
      top.style.display = 'flex';

      const sender_div = document.createElement('div');
      sender_div.className = 'sender';
      sender_div.style.textAlign = 'left';
      sender_div.style.width = '50%';
      sender_div.innerHTML = `From: ${email.sender}`;

      const subject_div = document.createElement('div');
      subject_div.className = 'subject';
      subject_div.innerHTML = email.subject;

      const timestamp_div = document.createElement('div');
      timestamp_div.style.textAlign = 'right';
      timestamp_div.style.width = '50%';
      timestamp_div.innerHTML = email.timestamp;

      top.append(sender_div, timestamp_div);

      outer_div.append(top, subject_div);
      document.querySelector('#emails-view').append(outer_div);

      // Add a click event listener to each email.
      outer_div.addEventListener('click', () => view_email(email, mailbox));
    })
  })
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#email-content-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  return false;
}

// Function to display an email clicked upon by the user.
function view_email(email, mailbox){

  // Show the email view and hide other views.
  document.querySelector('#email-content-view').style.display = 'block';
  document.querySelector('#emails-view').innerHTML = '';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  // Make an asynchronous GET request to change the read status of that email to true.
  fetch(`/emails/${email.id}`, {
    method: 'PUT', 
    body: JSON.stringify({
      read: true
    })
  })

  // Render the email in an appropriate format.
  const from = document.querySelector('#from');
  from.innerHTML = email.sender;

  const to = document.querySelector('#to');
  let recipients = email.recipients[0];
  email.recipients.slice(1).forEach(r => {
    recipients.concat(',', r);
  })
  to.innerHTML = recipients;

  const subject = document.querySelector('#subject');
  subject.innerHTML = email.subject;

  const timestamp = document.querySelector('#timestamp');
  timestamp.innerHTML = email.timestamp;

  let archive = document.querySelector('#archive');

  if (mailbox === "inbox"){  
    archive.innerHTML = 'Archive';
  }else if (mailbox === "archive"){
    archive.innerHTML = 'Unarchive';
  }else {
    archive.style.display = 'none';
    document.querySelector('#reply').style.display = 'none';
  }

  // Add the onclick property for the 'reply' and 'archive' buttons.
  archive.onclick = () => archive_it(email, mailbox);
  document.querySelector('#reply').onclick = () => reply(email);

  const body = document.querySelector('#body');
  body.innerHTML = email.body;

}

// Function to archive a particular email.
function archive_it(email, mailbox){

  // Determine whether the email has to be archived/unarchived
  // based on the mailbox from which the email was accessed.
  let archive = '';
  if (mailbox === 'inbox'){
    archive = true;
  } else {
    archive = false;
  }

  // Make an asynchronous PUT request to the API to archive/unarchive the email.
  fetch(`/emails/${email.id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: archive
    })
  })
  .then(result => {
    console.log(result);
    // once the mail id archived, load the inbox.
    load_mailbox('inbox');
  });
  return false;
}

// Function to make a reply to an email.
function reply(email){
  // Load the compose page.
  compose_email();

  // Prefill the fields with appropriate information.
  document.querySelector('#compose-recipients').value = email.sender;
  let subject = email.subject;
  if (email.subject.slice(0, 3) !== "Re:"){
    subject = `Re: ${email.subject}`;
  }
  document.querySelector('#compose-subject').value = subject;

  const text = `~~~ On ${email.timestamp} ${email.sender} wrote:`;
  const body =  email.body;
  const final = `\n\n ${text} \n ${body}`;
  document.querySelector('#compose-body').value = final;
}
