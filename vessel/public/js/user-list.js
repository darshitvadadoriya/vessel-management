$(document).ready(function(){


        // get count of records
        function get_count(filters){
            $.ajax({
                url: "/api/resource/User", 
                type: "GET", 
                dataType: "json",
                data: {
                    fields: JSON.stringify(["count(name) as count"]),
                    filters:JSON.stringify(filters),
    
                },
                success: function(response) {
                    
                    var page_count = response.data[0].count;
                    var page_no = Math.ceil(page_count / 2);
                    
                    // if only one page then hide pagination
                   $('#pagination').toggleClass("hide", page_no === 1);

                    console.log("page_no:", page_no); // Log the value of page_no
                    
                    for (var i = 1; i <= page_no; i++) {
                        var listItem = $(`<li class="page-item"><a class="page-link page-num" href="javascript:void(0)" data-page="${i}">${i}</a></li>`);
                        listItem.insertAfter('.previous-btn');
                    }
                    
                    $("#nextpage").attr("data-lastpage", page_no);
                    updatePagination(page_no);
                }
                
            })
        }

        // get count and set pagination
        get_count()
    



        // load data page wise and default first page
        page_no = page_number()
       if(page_no != undefined)
       {
            data_limit_start = page_no * 10 - 9;
            show_list(data_limit_start)
       }
       else{
            show_list(1)
       }
    
       var filters = [];
       
       $("#user-name").on('input', function() {
       var user_name = $("#user-name").val();

        
        // Check if the user_name is empty
        if(user_name.trim() === '') {
            // If empty, remove the query parameter from the URL
            window.history.pushState({}, '', window.location.pathname);
        } else {
            // Construct the query string parameter properly
            var queryString = '?username=' + encodeURIComponent(user_name);
            
            // Update the URL with the new query string parameter
            window.history.pushState({}, '', queryString);
        }
        filters = [["username","LIKE", "%" + user_name + "%"]];
        show_filtered_list(1,filters)
        get_count(filters)
    });
   
    
       
    

    function show_filtered_list(data_limit_start){
         // clear table data after move next page
         $("#data-list").empty();

        $.ajax({
            url: "/api/resource/User", 
            type: "GET", 
            dataType: "json",
            data: {
                fields: JSON.stringify(["full_name", "email", "mobile_no", "location", "enabled", "user_image"]),
                filters: JSON.stringify(filters),
                data_limit_start:data_limit_start,
                limit: 2
            },
            success: function(response) {
                console.log(response)
                $.each(response.data,function(i,data){
                    var user_profile = data.user_image ? window.location.origin + data.user_image : window.location.origin + "/assets/vessel/files/images/default_user.jpg";
                    
                    $('tbody').append(` <tr>
                    <td class="check-box"><input type="checkbox" class="check" name="check" /></td>
                    <td class="d-flex align-items-center">
                        <div class="profile-image mr-2">
                            <img src="${user_profile}">
                        </div>
                        <div class="user-name">
                        ${data.full_name ? data.full_name : " "}
                        </div>
                    </td>
                    <td>${data.email ? data.email : " "}</td>
                    <td>${data.mobile_no ? data.mobile_no : " "}</td>
                    <td>${data.location ? data.location : " "}</td>
                    <td class="d-flex ${data.enabled === 1 ? '' : 'inactive'}">
                        <div><div class="radio"></div></div>
                    <div> ${data.enabled === 1 ? "Active" : "Inactive"} </div>
                    </td>
                </tr>`)
                    
                })

            },
            error: function(xhr, status, error) {
                // Handle the error response here
                console.error('Error: ' + error); // Print the error to the console
                console.error('Status: ' + status); // Print the status to the console
                console.dir(xhr); // Print the XHR object for more details
            }
        });
    }


    

    // show user list view
    function show_list(data_limit_start){
       
        // clear table data after move next page
        $("#data-list").empty();

        $.ajax({
            url: "/api/resource/User", 
            type: "GET", 
            dataType: "json",
            data: {
                fields: JSON.stringify(["full_name", "email", "mobile_no", "location", "enabled", "user_image"]),
                limit_start: data_limit_start,
                limit: 2
            },
            success: function(response) {
                console.log(response)
                $.each(response.data,function(i,data){
                    var user_profile = data.user_image ? window.location.origin + data.user_image : window.location.origin + "/assets/vessel/files/images/default_user.jpg";
                    
                    $('tbody').append(` <tr>
                    <td class="check-box"><input type="checkbox" class="check" name="check" /></td>
                    <td class="d-flex align-items-center">
                        <div class="profile-image mr-2">
                            <img src="${user_profile}">
                        </div>
                        <div class="user-name">
                        ${data.full_name ? data.full_name : " "}
                        </div>
                    </td>
                    <td>${data.email ? data.email : " "}</td>
                    <td>${data.mobile_no ? data.mobile_no : " "}</td>
                    <td>${data.location ? data.location : " "}</td>
                    <td class="d-flex ${data.enabled === 1 ? '' : 'inactive'}">
                        <div><div class="radio"></div></div>
                    <div> ${data.enabled === 1 ? "Active" : "Inactive"} </div>
                    </td>
                </tr>`)
                    
                })

            },
            error: function(xhr, status, error) {
                // Handle the error response here
                console.error('Error: ' + error); // Print the error to the console
                console.error('Status: ' + status); // Print the status to the console
                console.dir(xhr); // Print the XHR object for more details
            }
        });
    }
    

    // get page number from url
    function page_number(){
        const urlParams = new URLSearchParams(window.location.search);

        // Get the value of the 'page' parameter
        const page = urlParams.get('page');
        return page === null ? 1 : parseInt(page);
    }

    //  // get page number from url
    //  function user_name(){
    //     const urlParams = new URLSearchParams(window.location.search);

    //     // Get the value of the 'page' parameter
    //     const username = urlParams.get('username');
    //     $("#user-name").val(username)
    //     filters = [["username","LIKE", "%" + username + "%"]];
    //     show_filtered_list(1,filters)
    // }
    // user_name()


    //====== pagination start here =====

      // set global variable for show current page
      var current_page = 1

      // click previous button to move previous pahe
     $(".previous-btn").click(function(){
              current_page = page_number()
              var next_page = parseInt(current_page) - 1
              window.history.pushState({}, '', '?page='+next_page);
              data_limit_start = next_page * 1 + 1;
              show_list(data_limit_start)

              // disable next button
              disable_pagination()
            // set active class on page no
              dynamic_active()

              updatePagination(current_page);
     })

      // click next button to mobe next page
     $(".next-btn").click(function(){
          current_page = page_number()
          var next_page = parseInt(current_page) + 1
          window.history.pushState({}, '', '?page='+next_page);
          data_limit_start = next_page * 1 + 1;
          show_list(data_limit_start)

         // disable next button
         disable_pagination()

         // set active class on page no
         dynamic_active()
         
         updatePagination(current_page);
          
      })


    // check page is last then next btn is disable
    function disable_pagination(){
        
        const lastpage = $(".next-btn .page-link").data("lastpage")
        const current_page_num =  page_number()
        if(lastpage == current_page_num)
        {
            $('.next-btn').addClass('diable-btn');
            $('.previous-btn').removeClass('diable-btn');
        }  
        else if(current_page_num == 1){
            $('.previous-btn').addClass('diable-btn');
            $('.next-btn').removeClass('diable-btn');
        }   
        else{
            $('.next-btn').removeClass('diable-btn');
            $('.previous-btn').removeClass('diable-btn');
        }

    }
    // check page and disable according disable
    disable_pagination()
  

    function dynamic_active(){
        const current_page_num =  page_number()
          // dynamic active class set in page number
          $(".page-item .page-link").each(function() {
           
            if ($(this).data("page") == current_page_num) {
                $(this).parent().addClass("active");
            }
            else
            {
                $(this).parent().removeClass("active");
            }
        });
    }
    // set active class on page no
    dynamic_active()


    // show only 5 pages
    function updatePagination(current_page) {
        const total_pages = $(".next-btn .page-link").data("lastpage");
        let start_page = Math.max(1, current_page - 2);
        let end_page = Math.min(total_pages, current_page + 2);
        if (current_page <= 3) end_page = Math.min(5, total_pages);
        else if (current_page > total_pages - 2) start_page = Math.max(1, total_pages - 4);

        $(".page-item").not(".previous-btn, .next-btn").remove();
        for (let i = start_page; i <= end_page; i++) {
            const active_class = (i === current_page) ? 'active' : '';
            $(`<li class="page-item ${active_class}"><a class="page-link page-num" href="javascript:void(0)" data-page="${i}">${i}</a></li>`).insertBefore(".next-btn");
        }
        $('.next-btn').toggleClass('disabled', current_page >= total_pages);
        $('.previous-btn').toggleClass('disabled', current_page <= 1);


          // set active class on page no
            dynamic_active()

    }


    updatePagination(1);

    //  clcik page not ot redirect on particular page
     $(document).on('click', '.page-num', function() {
        // get page number from data-page attribute
        var page_num = $(this).data("page");
        window.history.pushState({}, '', '?page=' + page_num);
        var data_limit_start = page_num * 10 - 9;
        
        show_list(data_limit_start);

        // disable next button
        disable_pagination();

        updatePagination(page_num);
    });

})