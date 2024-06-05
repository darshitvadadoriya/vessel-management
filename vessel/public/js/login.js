$(document).ready(function () {

  // check if already login to redirect admin
  

  // Create an instance of Notyf
  var notyf = new Notyf();

  //show and hide password in password field
  $(".show-hide-password").click(function () {
    const passwordField = $(".password");
    const passwordFieldType =
      passwordField.attr("type") === "password" ? "text" : "password";
    passwordField.attr("type", passwordFieldType);

    $(this).text(passwordFieldType === "password" ? "show" : "hide");
  });

  // click login to login process
  $("#login").click(function (e) {
    var username = $("#username").val();
    var password = $("#password").val();

    if (validateEmail(username)) {
      // Display an error notification
      notyf.error("Please enter valid email address");
    } else if (password == "") {
      // Display an error notification
      notyf.error("Please enter passwors");
    } else {
      // set verifying status
      $("#login").val("Verifying...");

      $.ajax({
        url: "/api/method/login",
        type: "POST",
        dataType: "json",
        data: {
          usr: username,
          pwd: password,
        },
        success: function (data) {
          window.location.href = "/admin";
          
        },
        error: function (xhr, status, error) {
          if (error == "UNAUTHORIZED")
          {  notyf.error(
              "Please enter valid username or password"
            );
          }
          $("#forget-password").val("Reset Password");
        },
      });
      // set Login status
      $("#login").val("Login");
    }
    e.preventDefault();
  });

  // click reset password to send email link on entered email
  $("#forget-password").click(function (e) {
    var emailaddress = $("#email-address").val();

    if (validateEmail(emailaddress)) {
      // Display an error notification
      notyf.error("Please enter valid email address");
    } else {
      $("#forget-password").val("Sending...");
      $.ajax({
        url: "/api/method/vessel.www.login.login.reset_password", 
        method: "POST",
        dataType: "json",
        data: {
          user: emailaddress,
        },
        success: function (data) {
          // Display a success notification
          notyf.success(
            "Password reset instructions have been sent to your email"
          );
          // Set the button text  "Reset Password"
          $("#forget-password").val("Reset Password");
        },
        error: function (xhr, status, error) {
          notyf.error(
            "An error occurred while trying to reset the password. Please try again."
          );
          $("#forget-password").val("Reset Password");
        },
      });
    }

    e.preventDefault();
  });


  // click reset password 
$("#confirm_password").click(function (e) {
  var new_password = $("#new-password").val();
  var confirm_password = $("#confirm-password").val();

  //get key param
  const queryString = window.location.search;
  const key = new URLSearchParams(queryString);
  const user_key = key.get('key')


  if (validatePassword(new_password,confirm_password)) {
    // Display an error notification
    notyf.error(validatePassword(new_password,confirm_password));
  
  }
   else {
    $("#confirm_password").val("Confirming...");
    $.ajax({
      url: "/api/method/frappe.core.doctype.user.user.update_password", 
      method: "POST",
      dataType: "json",
      data: {
        new_password: new_password,
        key:user_key
      },
      success: function (data) {
        // Display a success notification
        notyf.success(
          "Password reset instructions have been sent to your email"
        );
        // Set the button text  "Reset Password"
        $("#confirm_password").val("Confirm Password");

        window.location.href="/login"
      },
      error: function (xhr, status, error) {
          console.log(xhr);
        notyf.error({
          message:xhr.responseJSON.exception,
          duration:5000
      });
        $("#confirm_password").val("Confirm Password");
      },
    });
  }

  e.preventDefault();
});



  // password match validation
function validatePassword(new_password,confirm_password) {
  if(new_password==""){
      return "New password cannot be empty."
  }
  else if(confirm_password==""){
       return "Confirm password cannot be empty."
  }
  else if(new_password !== confirm_password)
  {
      return "New password and confirm password do not match."
  }
}
    


  // email validation
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email) == false || email == "") {
      return "please entre valid address";
    }
  }



});
