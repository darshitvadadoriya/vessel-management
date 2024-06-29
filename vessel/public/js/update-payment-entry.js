$(document).ready(function () {

    var customer_list = []
    var new_account_lst = []
    var old_account_lst = []
    var diff_account_lst = []
    var old_form_data = []
    var file_list = []
    var files = []
    var updated_form_data = {}; //updated data form
    // Create an instance of Notyf
    var notyf = new Notyf();
    var url = window.location.href
    var payment_entry_id = url.substring(url.lastIndexOf('/') + 1).replaceAll("%20", " "); //payment entry id


    //  set default today date in posting date
    var today = new Date();
    var day = String(today.getDate()).padStart(2, '0');
    var month = String(today.getMonth() + 1).padStart(2, '0');
    var year = today.getFullYear();

    //format year-month-date
    var today_date = year + '-' + month + '-' + day;
    $('#posting_date').val(today_date); //set today date


    // click on checkall to check checkboxes
    $(document).on("click", ".checkall", function () {
        var isChecked = $(this).prop("checked");
        $(".checkbox").each(function () {
            $(this).prop("checked", isChecked);
        });
    })

    // onclick delete row get checked checkbpx
    $("#delete_row").click(function () {
        $('.checkbox').each(function () {
            // remove only checked checkbox
            if ($(this).prop("checked")) {
                $(this).parent().parent().remove()
            }
        });
        $(".checkall").prop("checked", false); //uncheck main checkbox

        if ($("#payment_entry_details tr").length == 0) {
            $("#payment_entry_details").append(`<tr id="empty_table"></tr>`)
        }

    })

    $("#add_new_row").click(function () {
        $('#posting_date_error').remove();
        $('#company_error').remove();
        console.log($("#company").val());
        if ($("#company").val() == "") {
            $('<span id="company_error" class="error-message">Please enter company name.</span>').insertAfter('#company');
        }
        else if ($("#posting_date").val() == "") {
            $('<span id="posting_date_error" class="error-message">Please enter company name.</span>').insertAfter('#posting_date');
        }
        else {
            $('#company_error').remove();
            $('#posting_date_error').remove();
            add_row()
        }

    })

    function add_row() {
        $("#empty_table").remove()
        var party_id = "party_id" + $('#payment_entry_details tr').length
        var account_id = "account_id" + $('#payment_entry_details tr').length
        var debit_id = "debit_id" + $('#payment_entry_details tr').length
        var credit_id = "credit_id" + $('#payment_entry_details tr').length
        var file_id = "file_id" + $('#payment_entry_details tr').length
        var file_id = "file_id" + $('#payment_entry_details tr').length
        var file_label = "file_label" + $('#payment_entry_details tr').length
        var img_attached = "img_attached" + $('#payment_entry_details tr').length

        $("#payment_entry_details").append(`
            <tr>
                <td class="check"><input type="checkbox" class="checkbox" name="checkbox" /></td>
                <td>
                    <select id="${party_id}" class="party form-select custom-select tab-select">
                        <option></option>
                     </select>
                </td>
                <td>
                    <select id=${account_id} class="partytype form-select custom-select tab-select">
                        <option></option>
                       
                     </select>
                </td>
                <td><input type="number" id="${debit_id}" class="form-control debit" value="0"></td>
                <td><input type="number" id="${credit_id}" class="form-control credit" value="0"></td>
                <td><input type="text" class="form-control"></td>
                <td class="row align-items-center">
                 <div>
                    <label>
                            <div class="" id=${file_label}><img src="/assets/vessel/files/images/attach-image.png" class="mr-2"></div>
                        </lable>
                        <input type="file" class="form-control choose-file" id="${file_id}">
                        
                    </div>
                    <div id="${img_attached}">
                    </div>
                </td>
                
            </tr>
            `)


        $.each(customer_list, function (i, customer) {
            $("#" + party_id).append(`<option value="${customer.name}">  ${customer.customer_name}</option>`)
        })

        get_bank_account(function (data) {

            $.each(data, function (i, account) {
                $("#" + account_id).append(`<option value="${account.name}">${account.name}</option>`)
            })
        })

        $("#" + party_id).change(function () {
            $("#" + account_id).empty()
            var customer_name = $(this).val()

            if (customer_name == "") {
                get_bank_account(function (data) {

                    console.log(data);
                    $.each(data, function (i, account) {
                        $("#" + account_id).append(`<option value="${account.name}">${account.name}</option>`)
                    })
                })
            }
            else {

                $("#" + account_id).empty()
                get_account(function (data) {

                    $.each(data, function (i, account) {
                        $("#" + account_id).append(`<option value="${account.account}">${account.account}</option>`)
                    })
                }, customer_name)
            }

        })


        $("#" + file_id).change(function () {
            var file_data = $(this)[0].files
            if (files.length === 0) {
                files.push({ [file_id]: file_data });
            } else {
                var fileexists = false;
                $.each(files, function (i, data) {
                    if (data[file_id]) {

                        files[i][file_id] = file_data;
                        fileexists = true;
                        return false;
                    }
                });

                if (!fileexists) {
                    files.push({ [file_id]: file_data });
                }
            }


        })



    }

    // get customer wise account from customer
    function get_account(callback, customer) {
        var company = $("#company").val()
        $.ajax({
            url: "/api/method/vessel.api.account.get_accounts",
            type: "GET",
            dataType: "json",
            data: {
                "customer": customer,
                "company": company
            },
            success: function (data) {
                console.log(data)
                callback(data.message)

            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.dir(xhr); // Print the XHR object for more details
            }
        })
    }

    function get_bank_account(callback) {
        var company = $("#company").val()
        $.ajax({
            url: "/api/method/vessel.api.account.get_bank_accounts",
            type: "GET",
            dataType: "json",
            data: {
                "company": company
            },
            success: function (data) {
                console.log(data)
                callback(data.message)

            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.dir(xhr); // Print the XHR object for more details
            }
        })
    }


    get_customer()
    function get_customer() {
        $.ajax({
            url: "/api/resource/Customer",
            type: "GET",
            dataType: "json",
            data: {
                fields: JSON.stringify(["name", "customer_name"]),
                filters: JSON.stringify([["disabled", "=", "0"]]),
                limit_page_length: "None"
            },
            success: function (data) {
                customer_list = data.data


            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.dir(xhr); // Print the XHR object for more details
            }
        })
    }

    //get company
    get_company()
    function get_company() {

        $.ajax({
            url: "/api/resource/Company",
            type: "GET",
            dataType: "json",
            data: {
                fields: JSON.stringify(["name"]),
                limit_page_length: "None"
            },
            success: function (data) {
                var company = data.data
                $.each(company, function (i, company) {
                    $("#company").append(`<option value="${company.name}">${company.name}</option>`)
                })
            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.dir(xhr); // Print the XHR object for more details

            }
        })
    }

    //get company
    get_mode_of_payment()
    function get_mode_of_payment() {

        $.ajax({
            url: "/api/resource/Mode of Payment",
            type: "GET",
            dataType: "json",
            data: {
                fields: JSON.stringify(["name"]),
                filters: JSON.stringify([["enabled", "=", "1"]]),
                limit_page_length: "None"
            },
            success: function (data) {
                var company = data.data
                $.each(company, function (i, payment_mode) {
                    $("#mode_of_payment").append(`<option value="${payment_mode.name}">${payment_mode.name}</option>`)
                })
            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.dir(xhr); // Print the XHR object for more details

            }
        })
    }




    // get payment entry details fromjournal entry
    $.ajax({
        url: "/api/resource/Journal Entry/" + payment_entry_id,
        type: "GET",
        dataType: "json",

        success: function (data) {
            console.log(data);
            var payment_entry = data.data

            $("#page_title").html(payment_entry.title)
            $("#company").val(payment_entry.company)
            $("#mode_of_payment").val(payment_entry.mode_of_payment)
            $("#posting_date").val(payment_entry.posting_date)
            $("#total_debit").val(payment_entry.total_debit)
            $("#total_credit").val(payment_entry.total_credit)

            if (payment_entry.docstatus == 1) {
                $("#save").remove()
                $("#delete").hide()
                $(".action-btn-group").append(`<button class="btn btn-cancel" id="cancel">Cancel</button>`)
                // for not woring on child table to set settimeout
                setTimeout(() => {
                    $('form').find('input, textarea, select').prop('disabled', true);
                }, 50);
                $("#add_new_row").css({ "pointer-events": "none", "opacity": "0.5" })
                $("#delete_row").css({ "pointer-events": "none", "opacity": "0.5" })
            }

            if (payment_entry.docstatus == 2) {
                // for not woring on child table to set settimeout
                setTimeout(() => {
                    $('form').find('input, textarea, select').prop('disabled', true);
                }, 50);
                $("#save").hide()
                $("#delete").hide()
                $("#add_new_row").css({ "pointer-events": "none", "opacity": "0.5" })
                $("#delete_row").css({ "pointer-events": "none", "opacity": "0.5" })
            }

            if (payment_entry.docstatus == 0) {
                $("#save").remove()
                $(".action-btn-group").append(`<button class="btn btn-submit" id="submit">Submit</button>`)

            }

            old_account_lst = []
            $.each(payment_entry.accounts, function (index, account) {
                add_row()
                setTimeout(() => {
                    if (account.party != "") {
                        $("#party_id" + index).val(account.party).change()
                    }
                    $("#account_id" + index).val(account.account)
                    $("#debit_id" + index).val(account.debit)
                    $("#credit_id" + index).val(account.credit)
                    if (account.custom_attachments) {
                        $("#img_attached" + index).html(`<a href='${account.custom_attachments}'>${account.custom_attachments.substring(0, 10) + '...'}</a> <button class="btn clear" data-clear="${account.custom_attachments}" type="button">Clear</button>`)
                    }

                }, 200);


                // old account list
                old_account_lst.push({
                    'party_type': payment_entry.party_type,
                    'party': payment_entry.party,
                    'account': payment_entry.account,
                    'debit_in_account_currency': payment_entry.debit,
                    'credit_in_account_currency': payment_entry.credit,
                    'custom_attachments': payment_entry.custom_attachments
                });




            })




            setTimeout(() => {
                // if change any form input and select than change submit to save button
                $('form').on('change', 'input, select', function () {
                    $("#submit").remove()
                    $("#save").remove()
                    $(".action-btn-group").append(`<button class="btn save-btn" id="save">Save</button>`)
                    console.log("asasasasasas")
                });
            }, 200);


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


    // click to clier remove attachments
    $(document).on("click", ".clear", function () {

        console.log();
        var file_url = $(this).data("clear")

        $("#"+$(this).parent().attr("id")).html("")

        $.ajax({
            url: "/api/method/vessel.api.account.delete_file",
            type: "DELETE",
            dataType: "json",
            data: {
               "file_url":JSON.stringify(file_url),
               "payment_entry_id":JSON.stringify(payment_entry_id),
            },
            success: function (data) {
                console.log(data);
               
            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.dir(xhr); // Print the XHR object for more details

            }
        })

    })


    $(document).on("input", ".debit", function () {
        let total_debit = 0
        $(".debit").each(function (index, data) {
            let value = parseFloat(data.value);
            total_debit += isNaN(value) ? 0 : value;
        });
        $("#total_debit").val(total_debit)
    });

    $(document).on("input", ".credit", function () {
        let total_credit = 0;
        $(".credit").each(function (index, data) {
            let value = parseFloat(data.value);
            total_credit += isNaN(value) ? 0 : value;
        });
        $("#total_credit").val(total_credit);
    });







    $(document).on("click", "#save", function () {
        $(".overlay").show()
        $(".overlay-content").text("Please Wait....")
        var form_data_list = $('form').serializeArray();
        var form_data = {};
        $.each(form_data_list, function (index, field) {

            form_data[field.name] = field.value;
        });

        // Compare old form data with current form data and store updated fields
        $.each(form_data, function (key, value) {

            if (old_form_data[key] !== value) {
                updated_form_data[key] = value;
            }
        });








        // Counter to track completed uploads
        var uploadcompleted = 0;

        // Array to store uploaded file URLs
        var uploadedFileUrls = [];
        var file_list = []; // Ensure file_list is initialized


        for (var i = 0; i < $('#payment_entry_details tr').length; i++) {
            let file_id = 'file_id' + i; // Generate file_id like 'file_id0', 'file_id1', etc.

            // Check if files contains an object with the file_id as key
            let foundFile = files.find(file => file[file_id]);

            if (foundFile) {
                console.log('File with ID ' + file_id + ' exists:', foundFile[file_id]);
                uploadFile(foundFile[file_id][0], i)

                // Here you can access the file or perform further actions
            } else {
                console.log('File with ID ' + file_id + ' does not exist');
            }
        }







        // Function to handle file upload asynchronously
        function uploadFile(file, index) {
            var file_data = new FormData();
            file_data.append("file", file);
            file_data.append("file_name", file.name);
            file_data.append("file_url", "/files/" + file.name);

            $.ajax({
                url: "/api/method/upload_file",
                type: "POST",
                processData: false,
                contentType: false,
                data: file_data,
                success: function (response) {
                    console.log("File uploaded successfully:", response);

                    // Check if response.message is valid
                    if (response.message && typeof response.message.file_url === 'string') {
                        $("#img_attached" + index).html(`<a href='${response.message.file_url}'>${response.message.file_url.substring(0, 10) + '...'}</a> <button class="btn clear" data-clear="${response.message.file_url}" type="button">Clear</button>`);
                        file_list.push(response.message);
                        uploadedFileUrls.push(response.message.file_url);
                    } else {
                        console.error("Invalid response:", response);
                        // Handle invalid response if needed
                    }

                    // Increment completed uploads counter
                    uploadcompleted++;

                    // Check if all uploads are complete
                    if (uploadcompleted === files.length) {

                        // get updated account table details prepare object
                        new_account_lst = [];
                        $('#payment_entry_details tr').each(function (index) {
                            var partyvalue = $("#party_id" + index).val();
                            var accountvalue = $("#account_id" + index).val();
                            var debit = $("#debit_id" + index).val();
                            var credit = $("#credit_id" + index).val();
                            var img_attached = $("#img_attached" + index + " .btn.clear").data("clear");

                            if (partyvalue !== "") {
                                create_account_lst("Customer", partyvalue, accountvalue, debit, credit, img_attached);
                            } else {
                                create_account_lst("", partyvalue, accountvalue, debit, credit, img_attached);
                            }
                        });

                        function create_account_lst(partytype, partyvalue, accountvalue, debit, credit, custom_attachments) {
                            new_account_lst.push({
                                'party_type': partytype,
                                'party': partyvalue,
                                'account': accountvalue,
                                'debit_in_account_currency': debit,
                                'credit_in_account_currency': credit,
                                'custom_attachments': custom_attachments
                            });
                        }

                        console.log(new_account_lst);
                        updated_form_data["accounts"] = new_account_lst;

                        console.log(new_account_lst);

                        update_payment_entry(updated_form_data);

                    }
                },
                error: function (xhr, status, error) {
                    console.dir(xhr);
                }
            });
        }




    })

    $(document).on("click", "#submit", function () {
        $(".overlay").show()
        $(".overlay-content").text("Please Wait....")
        updated_form_data = { "docstatus": 1 }
        update_payment_entry(updated_form_data)
    })

    $(document).on("click", "#cancel", function () {
        $(".overlay").show()
        $(".overlay-content").text("Please Wait....")
        updated_form_data = { "docstatus": 2 }
        update_payment_entry(updated_form_data)
    })





    function update_payment_entry(updated_form_data) {
        $('#overlay').show();
        $.ajax({
            url: "/api/resource/Journal Entry/" + payment_entry_id,
            type: "PUT",
            dataType: "json",
            data: JSON.stringify(updated_form_data),
            success: function (data) {
                console.log(data);
                notyf.success({
                    message: "Payment Entry update successfully",
                    duration: 5000
                })
                setTimeout(() => {
                    window.location.reload()
                    $(".overlay").hide()
                }, 2500);

            },
            error: function (xhr, status, error) {
                $('#overlay').hide();
                console.dir(xhr); // Print the XHR object for more details
                // if (xhr.responseJSON.exc_type == "DuplicateEntryError") {
                //     notyf.error({
                //         message: "customer already added",
                //         duration: 5000
                //     })
                // }
            }
        })
    }

})