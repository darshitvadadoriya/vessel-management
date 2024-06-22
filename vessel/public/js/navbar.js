$(document).ready(function(){
    var loggedin_user 

     // Clear existing breadcrumbs
     $('.breadcrumbs').empty();
        
     // Get the path of the current page
     var path = window.location.pathname.split('/').filter(function(item) {
         return item !== '';
     });

     $('.breadcrumbs').append('<a href="/admin">Admin</a>');

     // Generate breadcrumbs for each segment of the path
     var fullPath = '';
     for (var i = 0; i < path.length; i++) {
         fullPath += '/' + path[i];
         if (i === path.length - 1) {
             // Add the last breadcrumb item with a special class
             $('.breadcrumbs').append('<span class="arrow"> > </span><a href="' + fullPath + '" class="last-breadcrumb">' + path[i].replaceAll("%20"," ") + '</a>');
         } else {
             $('.breadcrumbs').append('<span class="arrow"> > </span><a href="' + fullPath + '">' + path[i].replaceAll("%20"," ") + '</a>');
         }
     }



    //  logout
    $("#logout").click(function(){
        $.ajax({
            url: "/api/method/logout",
            type: "POST",
            success: function (response) {
             window.location.href = "/login"
            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.error('Error: ' + error); // Print the error to the console
                console.error('Status: ' + status); // Print the status to the console
                console.dir(xhr); // Print the XHR object for more details
                    
                    
           }
        })
        
    })




    // check if user not loggedin then redirect login page
    $.ajax({
        url: "/api/method/vessel.api.login.verify_loggedin",
        type: "GET",
        dataType: "json",
        success: function (data) {
            console.log(data)
            loggedin_user = data.message
                // Loggedin user
                $.ajax({
                    url: "/api/resource/User/"+data.message,
                    type: "GET",
                    dataType: "json",
                    success: function (data) {
                    var user_info = data.data
                    var user_profile_img = user_info.user_image && user_info.user_image.includes("https") ? user_info.user_image : (user_info.user_image ? window.location.origin + user_info.user_image : window.location.origin + "/assets/vessel/files/images/default_user.jpg")
                    $("#profile").attr("src",user_profile_img)
                    },
                    error: function (xhr, status, error) {
                        // Handle the error response here
                        console.dir(xhr); // Print the XHR object for more details

                    }
                })


            // click to profile redirect user profile page
            $("#profile-page").click(function(){
                window.location.href = "/user/"+data.message
            })


            $("#logged_in_user").text(loggedin_user)
            if(data.message=="Guest"){
              window.location.href = "/login"
            }
            
        },
        error: function (xhr, status, error) {
            // Handle the error response here
            console.dir(xhr); // Print the XHR object for more details

        }
    })

  

    
    
})