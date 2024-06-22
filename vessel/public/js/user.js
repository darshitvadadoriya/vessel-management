$(document).ready(function () {
    // Create an instance of Notyf
    var notyf = new Notyf();
    var files = []

    $('#upload-image').change(function () {
        files = $(this)[0].files;        
    });

    // get languages
    get_language()
     function get_language() {

        $.ajax({
            url: "/api/resource/Language",
            type: "GET",
            dataType: "json",
            data: {
                fields: JSON.stringify(["name","language_name"]),
                limit_page_length: "None"
            },
            success: function (data) {
                var language = data.data
                
                $.each(language,function(i,language){
                    
                    $("#language").append(`<option value=${language.name}>${language.language_name}-${language.name}</option>`)
                })

            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.dir(xhr); // Print the XHR object for more details

            }
        })
    }


   


    $('#save').click(function () {


        var form_data_list = $('form').serializeArray();
        var form_data = {};
        $.each(form_data_list, function (index, field) {

            form_data[field.name] = field.value;
        });
        console.log(form_data);


        // Error handler 
        // check first_name nad email address is filled

        let mobile_no = form_data['mobile_no'];
        let phone = form_data['mobile_no'];
        if (!form_data['first_name']) {
                $('#first_name_error').remove(); // Remove any existing error message
                $('#first_name').after('<span id="first_name_error" class="error-message">Please first name is mandatory.</span>');
        }
        else if(validateEmail(email) == false)
            {
                $('#email_error').remove(); // Remove any existing error message
                $('#email').after('<span id="email_error" class="error-message">Please enter valid email address.</span>');
            }
        else if (!form_data['email']) {
            $('#email_error').remove(); // Remove any existing error message
            $('#email').after('<span id="email_error" class="error-message">Please email is mandatory.</span>');
        }
        // else if (form_data['phone'] != "") {
        //     if (form_data['phone'].length != 10) {
        //         $('#phone_error').remove(); // Remove any existing error message
        //         $('#phone').after('<span id="phone_error" class="error-message">Valid only 10 digits in mobile.</span>');
        //     }
        // }
        // else if (form_data['mobile_no'] != "") {
        //     console.log("Mobile number length is:", typeof(form_data['mobile_no'].length));
        //     if (form_data['mobile_no'].length != 10) {
        //         console.log("under 10 digit");
        //         $('#mobile_no_error').remove(); // Remove any existing error message
        //         $('#mobile_no').after('<span id="mobile_no_error" class="error-message">Valid only 10 digits in mobile.</span>');
        //     } 
        // }           
        else {
            if (files.length > 0 ) {
                var file_data = files[0]
                 upload_file(file_data); // Pass the first file to the upload_file function
             } else {
                 create_user(form_data) // save data without image
             }
        }
        
        
        $("#first_name").on("input", function () {
            $('#first_name_error').remove(); // Remove first name error message
        })
        $("#email").on("input", function () {
            $('#email_error').remove(); // Remove emailerror message
        })


     

        function upload_file(files) {
            console.log(files)
            var file_data = new FormData();
            file_data.append('file', files);
            file_data.append('file_name', files.name);
            file_data.append('file_url', "/file/"+files.name);
    
            
            $.ajax({
                url: "/api/method/upload_file",
                type: "POST",
                processData: false,
                contentType: false,
                data:file_data, // Assuming form_data contains a file object
                success: function (response) {
                    var profile_image_url = response.message.file_url
                    form_data["user_image"] = profile_image_url;
                    create_user(form_data)
                },
                error: function (xhr, status, error) {
                    // Handle the error response here
                    console.error('Error: ' + error); // Print the error to the console
                    console.error('Status: ' + status); // Print the status to the console
                    console.dir(xhr); // Print the XHR object for more details
            
                    
                }
            })
        }


        function create_user(form_data) {
            $.ajax({
                url: "/api/resource/User",
                type: "POST",
                dataType: "json",
                data: JSON.stringify(form_data),
                success: function (data) {

                    console.log(data.data.name);
                    var user_id = data.data.name
                   
                    setTimeout(() => {
                        window.location.href = "/user/"+user_id
                    }, 2000);
                    
                    console.log("ENTERED.................")
                    notyf.success({
                        message: "User created successfully",
                        duration: 5000
                    })

                },
                error: function (xhr, status, error) {
                    // Handle the error response here
                    console.error('Error: ' + error); // Print the error to the console
                    console.error('Status: ' + status); // Print the status to the console
                    console.dir(xhr)
                    var error = JSON.stringify(xhr.responseJSON._server_messages)
                    console.log(error.message)
                    console.dir(xhr.responseJSON.exc_type); // Print the XHR object for more details
                    if (xhr.responseJSON.exc_type == "DuplicateEntryError") {
                        notyf.error({
                            message: "User already added",
                            duration: 5000
                        })
                    }
                    if (xhr.responseJSON.exc_type == "UniqueValidationError") {
                        notyf.error({
                            message: "Please mobile no set unique",
                            duration: 5000
                        })
                    }
                }
            })
        }
    })



    // email validation
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email) == false || email == "") {
      return "please entre valid address";
    }
  }

})
