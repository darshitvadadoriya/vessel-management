$(document).ready(function () {

    var old_form_data = {};
    var user_image //store old image url for user
    var user_id //store old userid for file delete
    

     // Create an instance of Notyf
     var notyf = new Notyf({
          types: [
            {
              type: 'alert',
              background: '#ff9800',
              icon: "<i class='fas fa-exclamation-triangle' style='font-size:22px;color:#ffffff;'></i>"
            }
          ]
      });




    var files = []

    $('#upload-image').change(function () {
        files = $(this)[0].files;

    });



    // get user data 
    var url = window.location.href
    var user_id = url.substring(url.lastIndexOf('/') + 1);

    get_user(user_id)
    function get_user(name) {
        
        $.ajax({
            url: "/api/resource/User",
            type: "GET",
            dataType: "json",
            data: {
                filters: JSON.stringify([["name", "=", name]]),
                fields: JSON.stringify(["name", "user_image", "email", "first_name", "full_name", "middle_name", "last_name", "username", "language", "enabled", "location", "phone", "mobile_no", "birth_date"])
            },
            success: function (data) {
                var user_info = data.data[0]
                
                user_image = user_info.user_image
                user_id = user_info.name
                var user_profile_img = user_info.user_image && user_info.user_image.includes("https") ? user_info.user_image : (user_info.user_image ? window.location.origin + user_info.user_image : window.location.origin + "/assets/vessel/files/images/default_user.jpg")

                
                $("#page_title").html(user_info.full_name)
                $("#user_id").val(user_info.name)
                $('#image-preview').css('background-image', 'url(' + user_profile_img + ')')
                $("#first_name").val(user_info.first_name)
                $("#middle_name").val(user_info.middle_name)
                $("#last_name").val(user_info.last_name)
                $("#email").val(user_info.email)
                $("#user_name").val(user_info.username)
                $("#language").val(user_info.language)
                $("#status").val(user_info.enabled)
                $("#phone").val(user_info.phone)
                $("#mobile").val(user_info.mobile_no)
                $("#location").val(user_info.location)
                $("#date_of_birth").val(user_info.birth_date)
                $("#state").val(user_info.state)



                var old_form_data_list = $('form').serializeArray();

                $.each(old_form_data_list, function (index, field) {

                    old_form_data[field.name] = field.value;
                });


            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.error('Error: ' + error); // Print the error to the console
                console.error('Status: ' + status); // Print the status to the console
                console.dir(xhr); // Print the XHR object for more details

            }
        })
    }





    // click on save to update data
    $('#save').click(function (e) {

        e.preventDefault();

        // Serialize the current form data
        var form_data_list = $('form').serializeArray();
        var form_data = {};

        $.each(form_data_list, function (index, field) {
            form_data[field.name] = field.value;
        });

        // Compare old form data with current form data and store updated fields
        var updated_form_data = {};

        $.each(form_data, function (key, value) {

            if (old_form_data[key] !== value) {
                updated_form_data[key] = value;
            }
        });

        console.log(updated_form_data)


      //get today date
        var today = new Date();
        var today_date = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
        
        


        // error handler (validation)
        // check first_name nad email address is filled

        if (!form_data['first_name']) {
            $('#first_name_error').remove(); // Remove existing error message
            $('#first_name').after('<span id="first_name_error" class="error-message">Please first name is mandatory.</span>');
            return false;
        }
        else if (!form_data['email']) {
            $('#email_error').remove(); // Remove existing error message
            $('#email').after('<span id="email_error" class="error-message">Please email is mandatory.</span>');
            return false;   
        }
        else if(updated_form_data['birth_date'] >today_date){
            $('#date_error').remove(); // Remove existing error message
            $('#date_of_birth').after('<span id="date_error" class="error-message">Please add date before today</span>');
            return false;
        }
        else {
            $('#date_error').remove();
            // create_user(form_data)
        }
        

        $("#first_name").on("input", function () {
            $('#first_name_error').remove(); // Remove first name error message
        })
        $("#email").on("input", function () {
            $('#email_error').remove(); // Remove emailerror message
        })


        if (files.length > 0) {
            var file_data = files[0]
            upload_file(file_data); // Pass the first file to the upload_file function
        } else {
            if(Object.keys(updated_form_data).length !== 0)
            {
                update_user(updated_form_data) // save data without image
            }
            else{
                notyf.success({
                    type:'alert',
                    message: "Changes are not available",
                    duration: 5000
                })
            }
        }

        function upload_file(files) {
            
            var file_data = new FormData();
            file_data.append('file', files);
            file_data.append('file_name', files.name);
            file_data.append('file_url', "/file/" + files.name);


            $.ajax({
                url: "/api/method/upload_file",
                type: "POST",
                processData: false,
                contentType: false,
                data: file_data, // Assuming form_data contains a file object
                success: function (response) {
                    
                    var profile_image_url = response.message.file_url
                    updated_form_data["user_image"] = profile_image_url;
                    update_user(updated_form_data)

                    // delete old file
                    $.ajax({
                        type: 'DELETE',
                        url: '/api/method/vessel.www.user.updateuser.delete_old_file',
                        data: {
                            file_url: user_image,
                            attached_to_name: user_id,
                            attached_to_field: "user_image",
                            attached_to_doctype:"User"
                        },
                        success: function(deleteResponse) {
                            console.log(deleteResponse);
                            console.log('File deleted successfully.');
                            // Handle success
                        },
                        error: function(xhr, status, error) {
                            console.error('Failed to delete file:', error);
                            console.dir(xhr)
                            // Handle error
                        }
                    });
                },
                error: function (xhr, status, error) {
                    // Handle the error response here
                  
                    console.dir(xhr); // Print the XHR object for more details


                }
            })
        }

        
      
        

        function update_user(updated_form_data) {
            var user_id = $('#user_id').val()

            $.ajax({
                url: "/api/resource/User/" + user_id,
                type: "PUT",
                dataType: "json",
                data: JSON.stringify(updated_form_data),
                success: function (data) {

                    notyf.success({
                        message: "User updated successfully",
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