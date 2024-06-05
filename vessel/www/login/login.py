import frappe
from frappe.core.doctype.user.user import reset_password    

@frappe.whitelist(allow_guest=1)
def reset_pswd(user):
    print(user)
    print("\n\n\n\n\n\n\n\n\n")
    # reset_password(data)