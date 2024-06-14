import frappe
import json

@frappe.whitelist()
def get_contact(doctype,doc_name):
   
    results = frappe.db.sql("""
        SELECT 
            contact.name AS contact_name,
            GROUP_CONCAT(DISTINCT ce.email_id) AS emails,
            GROUP_CONCAT(DISTINCT cp.phone) AS phones
        FROM
            `tabContact` AS contact
        LEFT JOIN
            `tabDynamic Link` AS tdl ON tdl.parent = contact.name
        LEFT JOIN
            `tabContact Email` AS ce ON ce.parent = contact.name
        LEFT JOIN
            `tabContact Phone` AS cp ON cp.parent = contact.name
        WHERE
            tdl.link_doctype = %s AND tdl.link_name = %s
        GROUP BY
            contact.name
        ORDER BY
            contact.name
    """, (doctype, doc_name), as_dict=True)

    contacts_dict = {}
    # return results
    for result in results:
        contact_name = result['contact_name']
        emails = result['emails'].split(',') if result['emails'] else []
        phones = result['phones'].split(',') if result['phones'] else []

        contacts_dict = {
            "contact_id":contact_name,
            'emails': emails,
            'phones': phones
        }

    return contacts_dict



    
@frappe.whitelist()
def create_contact(customer_name,phone,email):
    # set in dict sets
    email_ids = [{"email_id": email_id} for email_id in email]
    phone_nos = [{"phone": phone_no} for phone_no in phone]
    # create new contact
    doc = frappe.get_doc({
        "doctype": "Contact",  
        "first_name": customer_name,
        "email_ids": email_ids,  
        "phone_nos": phone_nos,  
        "links": [  
            {
                "link_doctype": "Customer",  
                "link_name": customer_name  #link with customer doc
            }
        ]
    })
    
    doc.insert()



    