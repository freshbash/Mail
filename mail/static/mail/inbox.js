document.addEventListener('DOMContentLoaded', function() {

  	// By default, load the inbox
  	load_mailbox('inbox');

	// Use buttons to toggle between views
	document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
	document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
	document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
	document.querySelector('#compose').addEventListener('click', compose_email);

});

//Helper functions

//===============================================================================================================================================

//Click action
function click(tab) {
	let clickEvent = new MouseEvent("click", {
		"view": window,
		"bubbles": true,
		"cancelable": false
	});
	document.querySelector(`#${tab}`).dispatchEvent(clickEvent);
}

//function to start animation for hiding an element
function hideAnimation(element) {
	element.style.animationPlayState = "running";
	element.addEventListener("animationend", () => {
		element.remove();
	})
}

//Send the composed email data to the database.
function sendEmail() {
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
		// Load the mailbox once the email has been sent.
		click("inbox");
	});
}

//Function to display a given view
function display(view) {
	if (view === "emails") {
		document.querySelector('#emails-view').style.display = 'block';

		//Hide other views
		document.querySelector('#email-content-view').style.display = 'none';
		document.querySelector('#compose-view').style.display = 'none';
	}
	else if(view === "email") {
		document.querySelector('#email-content-view').style.display = 'block';

		//Hide other views
		document.querySelector('#emails-view').style.display = 'none';
		document.querySelector('#compose-view').style.display = 'none';
	}
	else if (view === "compose") {
		document.querySelector('#compose-view').style.display = 'block';

		//Hide other views
		document.querySelector('#emails-view').style.display = 'none';
		document.querySelector('#email-content-view').style.display = 'none';
	}
}

//Function to clear compose-email form fields
function clearFields() {
	document.querySelector('#compose-recipients').value = '';
	document.querySelector('#compose-subject').value = '';
	document.querySelector('#compose-body').value = '';
}

//===============================================================================================================================================

//Function to properly display the compose email form and send emails to the data base.
function compose_email() {

	// Show compose view and hide other views
	display("compose");

	// Clear out composition fields
	clearFields();

	// Wait for the user to click the 'send email' button.
	document.querySelector('#compose-form').onsubmit = () => {
		sendEmail();
		// Prevent the page from refreshing.
		return false;
	}
}

// Function to load the mailbox: Inbox, sent, archive.(Use React for this!!!)
async function load_mailbox(mailbox) {

	// Show the mailbox name
	document.querySelector('#emails-view').innerHTML = `<h3 class="mb-4">${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

	// Show the mailbox and hide other views
	display("emails");

	// Make an asynchronous GET request to the API to get all the emails for the particular mailbox.
	await fetch(`/emails/${mailbox}`)
	.then(response => response.json())
	.then(emails => {
		emails.forEach(email => {
		// Email tile.
		const card = document.createElement("div");
		card.className = "card email";

		const cardBody = document.createElement("div");
		cardBody.className = "card-body"
		card.append(cardBody)

		//Background color of the tile based on read status
		if(email.read){
			card.style.backgroundColor = "rgb(236, 236, 236)";
		} else {
			card.style.backgroundColor = "white";
		}
		
		//Div containing the header for the email tile.
		const top = document.createElement('div');
		top.className = 'd-flex justify-content-between';

		//Div containing the information about the sender
		const sender_div = document.createElement('div');
		if (mailbox !== "sent") {
			sender_div.innerHTML = `From: ${email.sender}`;
		} else {
			sender_div.innerHTML = `To: ${email.recipients}`;
		}

		//Div containing the timestamp
		const timestamp_div = document.createElement('div');
		timestamp_div.innerHTML = email.timestamp;

		const bottom = document.createElement("div");
		bottom.className = "d-flex justify-content-between";
		

		//Div containing the subject of the email
		const subject_div = document.createElement('div');
		subject_div.className = "d-flex flex-column fw-bold justify-content-center";
		subject_div.innerHTML = email.subject;

		//Div containing the action buttons
		const actions = document.createElement("div");
		actions.className = "d-flex justify-content-evenly";
		
		//Action buttons

		//Delete button
		const del = document.createElement("button");
		del.className = "btn";
		const del_icon = document.createElement('i');
		del_icon.className = "bi bi-trash";
		del.append(del_icon);


		//Read/Unread button
		const read = document.createElement("button");
		read.className = "btn";
		const read_icon = document.createElement('i');
		email.read ? read_icon.className = "bi bi-envelope-fill" : read_icon.className = "bi bi-envelope-open"
		read.append(read_icon);

		//Archive/Unarchive button
		const archive = document.createElement("button");		
		mailbox === "sent" ? archive.className = "btn disabled" : archive.className = "btn";

		const archive_icon = document.createElement('i');
		email.archived ? archive_icon.className = "bi bi-archive" : archive_icon.className = "bi bi-archive-fill";
		archive.append(archive_icon);

		//Add event listeners to the buttons
		archive.addEventListener("click", (e) => {
			e.stopPropagation();
			archiveEmail(email);
			hideAnimation(card);
		});

		del.addEventListener("click", (e) => {
			e.stopPropagation();
			deleteEmail(email);
			hideAnimation(card);
		})

		//State variable
		let readStatus = email.read;

		let isProcessing = false;
		read.addEventListener("click", async (e) => {
			e.stopPropagation();

			if (isProcessing) {
				return
			}

			isProcessing = true;

			try {	
				await markRead(email.id, readStatus);
				readStatus = !readStatus;

				//Change style of the tile
				const currentCardColor = card.style.backgroundColor;
				currentCardColor === "white" ? card.style.backgroundColor = "rgb(236, 236, 236)" : card.style.backgroundColor = "white";

				const currentIcon = read_icon.className;
				currentIcon === "bi bi-envelope-open" ? read_icon.className = "bi bi-envelope-fill" : read_icon.className = "bi bi-envelope-open";
			}
			catch (error) {
				console.log(error);
			}
			finally {
				isProcessing = false;
			}
		})

		//Add the buttons to actions div
		actions.append(archive, del, read);

		//Apend the sender and timestamp info to top
		//And the subject and the options to bottom
		top.append(sender_div, timestamp_div);
		bottom.append(subject_div, actions);


		//Append top and subject to outer_div
		cardBody.append(top, bottom);
		document.querySelector('#emails-view').append(card);

		// Add a click event listener to each email.
		card.addEventListener('click', () => viewEmail(email, mailbox));
		})
	})
}

// Function to display an email clicked upon by the user.
function viewEmail(email, mailbox){

	// Show the email view and hide other views.
	display("email");

	// Make an asynchronous PUT request to change the read status of that email to true.
	markRead(email);

	// Render the email in an appropriate format.(Do it in React!)
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
	}

	// Add the onclick property for the 'reply' and 'archive' buttons.
	archive.onclick = () => archiveEmail(email, mailbox);
	document.querySelector('#reply').onclick = () => reply(email);

	const body = document.querySelector('#body');
	body.innerHTML = email.body;

}

//Function to mark an email as read or unread
async function markRead(emailId, status) {
	let readStatus;
	status === true ? readStatus = false : readStatus = true

	//Make the API call to the backend
	fetch(`/emails/${emailId}`, {
		method: "PUT",
		body: JSON.stringify({
			read: readStatus
		})
	})
	.then(result => console.log(result));
}

//Function to send an API request to the server to delete an email
function deleteEmail(email) {
	//Make the asynchronous request
	fetch(`/emails/${email.id}`, {
		method: "DELETE",
		body: JSON.stringify({
			email_id: email.id
		})
	})
	.then(result => console.log(result));
}

// Function to archive a particular email.
function archiveEmail(email){

	// Determine whether the email has to be archived/unarchived
	// based on the mailbox from which the email was accessed.
	let archive = null;
	email.archived ? archive = false : archive = true
	

	// Make an asynchronous PUT request to the API to archive/unarchive the email.
	fetch(`/emails/${email.id}`, {
		method: 'PUT',
		body: JSON.stringify({
		archived: archive
		})
	})
}

// Function to make a reply to an email.
function reply(email){
	// Load the compose page.
	compose_email();

	// Prefill the fields with appropriate information.
	if (email.sender === document.querySelector("#sender").value) {
		document.querySelector('#compose-recipients').value = email.recipients;
	} else {
		document.querySelector('#compose-recipients').value = email.sender;
	}
	
	let subject = email.subject;
	if (email.subject.slice(0, 4) !== "Re: "){
		subject = `Re: ${email.subject}`;
	}
	document.querySelector('#compose-subject').value = subject;

	const text = `~~~ On ${email.timestamp}, ${email.sender} wrote:`;
	const body =  email.body;
	const final = `\n\n ${text} \n ${body}`;
	document.querySelector('#compose-body').value = final;
	deleteEmail(email)
}
