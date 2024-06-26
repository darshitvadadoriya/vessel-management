$(document).ready(function () {


    // Create an instance of Notyf
    var notyf = new Notyf();
    var files = []
    var phone_list = []
    var email_list = []
    var phone_data_list
    var email_data_list
    var customer_accounts
    var company_value
    var contact_id
    var email_data_list
    var phone_data_list
    var company_select_list = []
    var customer_profile_img


    var old_form_data = {};

    //  country select field 




    //  upload customer image
    $('#upload-image').change(function () {
        files = $(this)[0].files;
    });



    // on click add email to add new row
    $("#add_email").click(function () {
        var customer_email = $("#email_address_value").val()

        $(`<div class="row w-100 justify-content-between email_row">
               <div class="email">${customer_email}</div>
               <div class="delete"><img src="/assets/vessel/files/images/delete.png" alt="delete"></div>
           </div>`).insertBefore("#customer_email_input")
        $("#email_address_value").val("")
    })

    // on click add phone to add new row
    $("#add_phone").click(function () {
        var phone_no_value = $("#phone_no_value").val()
        $(`<div class="row w-100 justify-content-between phone_row">
               <div class="phone">${phone_no_value}</div>
               <div class="delete"><img src="/assets/vessel/files/images/delete.png" alt="delete"></div>
           </div>`).insertBefore("#customer_phone_input")
        $("#phone_no_value").val("")
    })

    // on click delete icon to delete particular clicked row
    $(document).on('click', '.delete', function () {
        $(this).parent().remove()
        $(".checkall").prop("checked", "false");
    })


    // onclick add row to new row add in table
    $("#add_new_row").click(function () {
        add_row()

    })

    // add_row("","")
    // add row button to add new row in account table
    function add_row() {
        var company_id = "company_id" + $('#customer-accounts tbody tr').length
        var account_id = "account_id" + $('#customer-accounts tbody tr').length

        $("#account_table").append(`<tr class="select-accounts">
                <td class="check"><input type="checkbox" class="checkbox" name="checkbox" /></td>
                <td>
                   
                <select id="${company_id}" class="company form-select form-control tab-select">
            
                 </select>
                </td>
                <td>
                    
                    <select class="account form-select form-control tab-select ${account_id}" id="${account_id}" data-searchable="true">
                            
                 </select>
                </td>
            </tr>`)



        $.each(company_select_list, function (i, company) {
            $("#" + company_id).append(`<option value="${company}">${company}</option>`)

        })
        // set accounts company wise
        get_account(function (data) {
            console.log(data);
            $("#" + account_id).empty()
            data.forEach(function (account) {

                $("#" + account_id).append(`<option value="${account.name}">${account.name}</option>`)
            });


        }, company_value);


        $("#" + company_id).change(function () {
            company_value = $("#" + company_id).val()

            get_account(function (data) {
                console.log(data);
                $("#" + account_id).empty()
                data.forEach(function (account) {

                    $("#" + account_id).append(`<option value="${account.name}">${account.name}</option>`)
                });

            }, company_value);

        })

    }

    // get company data from company master on page load time
    get_company_details()
    console.log(company_select_list);
    //set company
    function get_company_details() {
        company_select_list = []
        get_company(function (data) {

            $.each(data, function (i, company) {

                company_select_list.push(company.name)
            })

        });

    }



    // onclick delete row get checked checkbpx
    $("#delete_row").click(function () {
        $('.checkbox').each(function () {
            // remove only checked checkbox
            if ($(this).prop("checked")) {
                $(this).parent().parent().remove()
            }
        });
    })



    // show data in form
    var url = window.location.href

    var customer_id = url.substring(url.lastIndexOf('/') + 1).replaceAll("%20", " ");

    get_customer(customer_id)
    function get_customer(name) {

        $.ajax({
            url: "/api/resource/Customer/" + name,
            type: "GET",
            dataType: "json",

            success: function (data) {
                var customer_info = data.data


                customer_id = customer_info.name
                customer_accounts = customer_info.accounts
                customer_profile_img = customer_info.image && customer_info.image.includes("https") ? customer_info.image : (customer_info.image ? window.location.origin + customer_info.image : window.location.origin + "/assets/vessel/files/images/default_user.jpg")

                console.log(customer_info);
                $("#page_title").html(customer_info.customer_name)
                $("#user_id").val(customer_id)
                $('#image-preview').css('background-image', 'url(' + customer_profile_img + ')')
                $("#customer_name").val(customer_info.customer_name)
                $("#country").val(customer_info.custom_country)
                $("#address").val(customer_info.custom_address)
                $("#customer_type").val(customer_info.customer_type)
                $("#country").val(customer_info.custom_country)
                $("#person_in_charge").val(customer_info.custom_person_in_charge)
                $("#remarks").val(customer_info.custom_remarks)
                $("#status").val(customer_info.disabled)
                

                // setTimeout(()=>{
                $.each(customer_accounts, function (index, data) {
                    add_row()

                    var id = index + 1
                    setTimeout(() => {

                        $("#company_id" + id).val(data.company)
                        company_value = $("#company_id" + id).val()

                        get_account(function (data) {
                            console.log(data);
                            $("#account_id" + id).empty()
                            data.forEach(function (account) {

                                $("#account_id" + id).append(`<option value="${account.name}">${account.name}</option>`)
                            });


                        }, company_value);
                        // setup the company in particular field
                        setTimeout(() => {
                            $("#account_id" + id).val(data.account)
                        }, 200)

                    }, 150)



                })
                // },1000)



                var old_form_data_list = $('form').serializeArray();

                $.each(old_form_data_list, function (index, field) {

                    old_form_data[field.name] = field.value;
                });

            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.dir(xhr); // Print the XHR object for more details

            }
        })
    }

    get_contact(customer_id)

    function get_contact(customer_id) {

        $.ajax({
            url: "/api/method/vessel.api.customer.get_contact",
            type: "GET",
            dataType: "json",
            data: {
                doctype: "Customer",
                doc_name: customer_id
            },
            success: function (data) {
            
                console.log(data);
                email_data_list = data.message.emails
                
                phone_data_list = data.message.phones
                contact_id = data.message.contact_id

                $.each(phone_data_list, function (i, data) {
                    $(`<div class="row w-100 justify-content-between phone_row">
                                        <div class="phone">${data}</div>
                                        <div class="delete"><img src="/assets/vessel/files/images/delete.png" alt="delete"></div>
                                    </div>`).insertBefore("#customer_phone_input")
                })

                $.each(email_data_list, function (i, data) {
                    $(`<div class="row w-100 justify-content-between email_row">
                        <div class="email">${data}</div>
                        <div class="delete"><img src="/assets/vessel/files/images/delete.png" alt="delete"></div>
                    </div>`).insertBefore("#customer_email_input")
                })


            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.dir(xhr); // Print the XHR object for more details

            }
        })
    }


    function get_company(callback) {

        $.ajax({
            url: "/api/resource/Company",
            type: "GET",
            dataType: "json",
            data: {
                fields: JSON.stringify(["name"]),
                limit_page_length: "None"
            },
            success: function (data) {
                callback(data.data)
            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.dir(xhr); // Print the XHR object for more details

            }
        })
    }


    function get_account(callback, companyval) {
        var filters = JSON.stringify([["company", "=", companyval]])

        $.ajax({
            url: "/api/resource/Account",
            type: "GET",
            dataType: "json",
            data: {
                fields: JSON.stringify(["name"]),
                filters: filters,
                limit_page_length: "None"
            },
            success: function (data) {
                callback(data.data)

            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.dir(xhr); // Print the XHR object for more details

            }
        })
    }

    // load country select box
    get_country()
    function get_country() {
        $.ajax({
            url: "/api/resource/Country",
            type: "GET",
            dataType: "json",
            data: {
                fields: JSON.stringify(["name"]),
                limit_page_length: "None"
            },
            success: function (data) {
                var country_list = data.data
                $("#country").empty()
                country_list.forEach(function (country, i) {
                    // countryoptions
                    $("#country").append(`<option value="${country.name}">${country.name}</option>`)
                })


            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.dir(xhr); // Print the XHR object for more details
            }
        })
    }




    $('#save').click(function () {


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

        console.log(updated_form_data);

        // phone section data
        $("#customer_phone .phone_row").each(function (i, data) {
            var phone_no = $(data).find(".phone").text();
            // if (!phone_list.includes(phone_no) && !phone_data_list.includes(phone_no)) {
            phone_list.push({ "phone_nos": phone_no, "parentfield": "phone_nos", "parenttype": "Contact", "parent": contact_id }); // push unique value in phone_list
            // }
        });

        // form_data["phone"] = phone_list
        console.log(phone_list);

        //email data
        $("#customer_email .email_row").each(function (i, data) {
            var email_data = $(data).find(".email").text();
            //  if (!email_list.includes(email_data) && !email_data_list.includes(email_data)) {
            email_list.push({ "email_ids": email_data, "parentfield": "email_ids", "parenttype": "Contact", "parent": contact_id }); // push unique value in email_list
            // }
        });
        console.log(email_list);



        console.log(contact_id);
        console.log("Contact----id");

        $.ajax({
            url: "/api/method/vessel.api.customer.update_contact_email_ids",
            type: "PUT",
            data: {
                "contact_name": contact_id,
                "new_email_ids": JSON.stringify(email_list)
            },
            success: function (response) {
                console.log(response);
            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.dir(xhr); // Print the XHR object for more details


            }
        })

    
        $.ajax({
            url: "/api/method/vessel.api.customer.update_contact_phone_nos",
            type: "PUT",
            data: {
                "contact_name": JSON.stringify(contact_id),
                "new_phone_nos": JSON.stringify(phone_list)
            },
            success: function (response) {
                console.log(response);
            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.dir(xhr); // Print the XHR object for more details


            }
        })





        // account table grouping data
        account_lst = []
        $('#account_table tr').each(function (index) {
            var companyvalue = $("#company_id" + index).val();
            var accountvalue = $("#account_id" + index).val();
            console.log(companyvalue);
            if (index <= 0) {
                console.log("first row is blank") //if first row is blank default
            }
            else {
                account_list()
            }
            function account_list() {
                account_lst.push({ 'company': companyvalue, "account": accountvalue })
            }

        });
        if (account_lst) {
            console.log(account_lst);
            updated_form_data["accounts"] = account_lst
        }
        console.log(updated_form_data);



        // error handler 
        // check customer name and customer type is filled

        if (!form_data['customer_name']) {
            $('#customer_name_error').remove(); // Remove any existing error message
            $('#customer_name').after('<span id="customer_name_error" class="error-message">Please customer name is mandatory.</span>');
        }
        else if (!form_data['customer_type']) {
            $('#customer_type_error').remove(); // Remove any existing error message
            $('#customer_type').after('<span id="customer_type_error" class="error-message">Please email is mandatory.</span>');
        }
        else {
            if (files.length > 0) {
                var file_data = files[0]
                upload_file(file_data); // Pass the first file to the upload_file function
            } else {
                update_customer(updated_form_data) // save data without image
            }
        }
        console.log(updated_form_data);

        $("#customer_name").on("input", function () {
            $('#customer_name_error').remove(); // Remove customer name error message
        })
        $("#customer_type").on("input", function () {
            $('#customer_type_error').remove(); // Remove customer_type error message
        })


        function upload_file(files) {
            console.log(files)
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
                    updated_form_data["image"] = profile_image_url;
                    update_customer(updated_form_data)


                    // delete old file
                    $.ajax({
                        type: 'DELETE',
                        url: '/api/method/vessel.api.updateuser.delete_old_file',
                        data: {
                            file_url: customer_profile_img,
                            attached_to_name: customer_id,
                            attached_to_field: "image",
                            attached_to_doctype: "Customer"
                        },
                        success: function (deleteResponse) {
                            console.log(deleteResponse);
                        },
                        error: function (xhr, status, error) {
                            console.dir(xhr)

                        }
                    });


                },
                error: function (xhr, status, error) {
                    // Handle the error response here
                   
                    console.dir(xhr); // Print the XHR object for more details


                }
            })
        }
        console.log(updated_form_data);


        function update_customer(updated_form_data) {
            $(".overlay").show()
            $(".overlay-content").text("Please Wait....")
            $.ajax({
                url: "/api/resource/Customer/" + customer_id,
                type: "PUT",
                dataType: "json",
                data: JSON.stringify(updated_form_data),
                success: function (data) {

                    setTimeout(() => {
                        $(".overlay").hide()
                        window.location.reload()
                    }, 3000);
                    notyf.success({
                        message: "Update customer successfully",
                        duration: 5000
                    })

                },
                error: function (xhr, status, error) {
                    // Handle the error response here
                   
                    console.dir(xhr); // Print the XHR object for more details
                    if (xhr.responseJSON.exc_type == "DuplicateEntryError") {
                        notyf.error({
                            message: "customer already added",
                            duration: 5000
                        })
                    }
                }
            })
        }
    })



    // click on checkall to check checkboxes
    $(document).on("click", ".checkall", function () {
        var isChecked = $(this).prop("checked");
        $(".checkbox").each(function () {
            $(this).prop("checked", isChecked);
        });
    })

  
    

    $("#delete").click(function(){

            // delete file
            $.ajax({
            url: "/api/resource/Customer/" + customer_id,
            type: "DELETE",
            dataType: "json",
            
            success: function (data) {
                console.log(data);
                notyf.success({
                    message: "Deleted record  successfully",
                    duration: 5000
                })
                setTimeout(() => {
                        window.location.href = "/logistic/customer"
                }, 3000);
    
            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.dir(xhr); // Print the XHR object for more details
                
            }
        })
    })

})

