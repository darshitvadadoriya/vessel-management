$(document).ready(function () {
    // Create an instance of Notyf
    var notyf = new Notyf();
    var files = []

    $('#upload-image').change(function () {
        files = $(this)[0].files;        
    });


   


    $('#save').click(function () {


        var form_data_list = $('form').serializeArray();
        var form_data = {};
        $.each(form_data_list, function (index, field) {

            form_data[field.name] = field.value;
        });


        // Error handler 
        // check first_name nad email address is filled

        if (!form_data['first_name']) {
            $('#first_name_error').remove(); // Remove any existing error message
            $('#first_name').after('<span id="first_name_error" class="error-message">Please first name is mandatory.</span>');
        }
        else if (!form_data['email']) {
            $('#email_error').remove(); // Remove any existing error message
            $('#email').after('<span id="email_error" class="error-message">Please email is mandatory.</span>');
        }
        else {
            // create_user(form_data)
        }
        console.log(form_data);

        $("#first_name").on("input", function () {
            $('#first_name_error').remove(); // Remove first name error message
        })
        $("#email").on("input", function () {
            $('#email_error').remove(); // Remove emailerror message
        })


        if (files.length > 0 ) {
           var file_data = files[0]
            upload_file(file_data); // Pass the first file to the upload_file function
        } else {
            create_user(form_data) // save data without image
        }

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
                    window.location.href = "/user/"+user_id
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
                    console.dir(xhr.responseJSON.exc_type); // Print the XHR object for more details
                    if (xhr.responseJSON.exc_type == "DuplicateEntryError") {
                        notyf.error({
                            message: "User already added",
                            duration: 5000
                        })
                    }
                }
            })
        }
    })



   

})
