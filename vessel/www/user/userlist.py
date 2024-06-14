import frappe
import json


@frappe.whitelist()
def delete_user(user_lst):
    
    for user in user_lst:
        if user != frappe.session.user:
            frappe.delete_doc("User",user)
    return True
        
