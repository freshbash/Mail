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

  document.querySelector('#compose-form').onsubmit = () => {
    const R = document.querySelector('#compose-recipients').value;
    const S = document.querySelector('#compose-subject').value;
    const B = document.querySelector('#compose-body').value;

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
      load_mailbox('sent');
    });

    return false;
  }
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#email-content-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  load_emails(mailbox);
  return false;
}

function load_emails(mailbox){
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    console.log(emails);
    emails.forEach(email => {
      const outer_div = document.createElement('div');
      outer_div.id = 'click';
      outer_div.style.display = 'flex';
      outer_div.style.border = '1px solid black';
      if(email.read){
        outer_div.style.backgroundColor = 'lightgrey';
      } else {
        outer_div.style.backgroundColor = 'white';
      }

      const sender_div = document.createElement('div');
      sender_div.style.width = '15%';
      sender_div.innerHTML = email.sender;

      const subject_div = document.createElement('div');
      subject_div.style.width = '85%';
      subject_div.innerHTML = email.subject;

      const timestamp_div = document.createElement('div');
      timestamp_div.style.width = '20%';
      timestamp_div.innerHTML = email.timestamp;

      outer_div.append(sender_div, subject_div, timestamp_div);
      document.querySelector('#emails-view').append(outer_div);

      outer_div.addEventListener('click', () => view_email(email.id, mailbox));
    })
  })
}

function view_email(email_id, mailbox){
  document.querySelector('#email-content-view').style.display = 'block';
  document.querySelector('#emails-view').innerHTML = '';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  fetch(`/emails/${email_id}`, {
    method: 'PUT', 
    body: JSON.stringify({
      read: 'True'
    })
  })

  fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(email => {
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

    const body = document.querySelector('#body');
    body.innerHTML = email.body;

    let archive = document.querySelector('#archive');

    if (mailbox === "inbox"){  
      archive.innerHTML = 'Archive';
    }else if (mailbox === "archive"){
      archive.innerHTML = 'Unarchive';
    }else {
      archive.style.display = 'none';
      document.querySelector('#reply').style.display = 'none';
    }

    archive.addEventListener('click', () => archive_it(email_id, mailbox));
    document.querySelector('#reply').addEventListener('click', () => reply(email));
  })
}

function archive_it(email_id, mailbox){
  let archive = '';
  if (mailbox === 'inbox'){
    archive = true;
  } else {
    archive = false;
  }
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: archive
    })
  })
  // Problem here.
  .then(() => {
    load_mailbox('inbox');
  })
  return false;
}

function reply(email){
  compose_email();
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
