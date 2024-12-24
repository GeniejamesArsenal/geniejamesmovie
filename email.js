 // Initialize EmailJS with your User ID
 emailjs.init("YVeShsfL2X11z2KYX");  // Your User ID from EmailJS

 // Form submission handler
 document.getElementById('contact-form').addEventListener('submit', function(event) {
     event.preventDefault();

     // Get form data
     var name = document.getElementById('name').value;  // Sender's name
     var email = document.getElementById('email').value;  // Sender's email
     var message = document.getElementById('message').value;  // Message content
     var to_name = "Recipient Name";  // Replace with the recipient's name or a dynamic value

     // Send email using EmailJS
     emailjs.send("service_g1s863l", "template_jtdb98f", {
         to_name: to_name,  // The recipient's name
         from_name: name,  // Sender's name
         from_email: email,  // Sender's email
         message: message  // Message content
     }).then(function(response) {
         console.log("Success", response);
         alert("Message sent successfully!");
     }, function(error) {
         console.log("Error", error);
         alert("Failed to send message. Please try again. Error: " + error.text);
     });
 });