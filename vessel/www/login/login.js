$(document).ready(function(){
    
    // Create an instance of Notyf
    var notyf = new Notyf();


    //show and hide password in password field
    $('#show-hide-password').click(function () {
 
        const passwordField = $('#password');
        const passwordFieldType = passwordField.attr('type') === 'password' ? 'text' : 'password';
        passwordField.attr('type', passwordFieldType);
        
        $(this).text(passwordFieldType === 'password' ? 'show' : 'hide');
    });

    // click login to login process
    $(".btn-login").click(function(e){
        var username = $("#username").val()
        var password = $("#password").val()

       if(validateEmail(username)){
        // Display an error notification
        notyf.error('Please enter valid email address');

       }
       else if(password=="")
        {
           // Display an error notification
            notyf.error('Please enter passwors');

        }
        else{
            // set verifying status
            $('.btn-login').val("Verifying...")
            
            $.ajax({
                url: "/api/method/login",
                type: "POST",
                dataType: "json",
                data: {
                usr: username,
                pwd: password,
                },
                success: function (data) {
                    window.location.href = "/app"
                    // set verifying status
                    $('.btn-login').val("Login")
                },
            
                });
        }
        e.preventDefault()

    })
    

    // email validation
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(emailRegex.test(email) == false || email=="")
        {
            return "please entre valid address"
        }
        
        
        
      }
})